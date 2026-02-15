import { createClient } from '@/shared/lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { GalleryImage, GalleryImageInsert } from '../types/gallery';

const BUCKET_NAME = 'gallery';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Generates a unique file path for storage upload.
 */
function generateStoragePath(fileName: string): string {
    const timestamp = Date.now();
    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    return `${timestamp}-${sanitized}`;
}

/**
 * Compresses an image file client-side before uploading.
 * Returns a Blob ready for upload.
 */
export async function compressImage(
    file: File,
    maxWidth = 1600,
    quality = 0.85
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                'image/webp',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

export const galleryService = {
    /**
     * Fetch all active gallery images ordered by display_order.
     */
    async getGalleryImages(supabaseClient?: SupabaseClient): Promise<GalleryImage[]> {
        const supabase = supabaseClient || createClient();
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching gallery images:', error);
            return [];
        }

        return data as GalleryImage[];
    },

    /**
     * Fetch ALL gallery images (including inactive) for admin panel.
     */
    async getAllGalleryImages(): Promise<GalleryImage[]> {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('gallery_images')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching all gallery images:', error);
            return [];
        }

        return data as GalleryImage[];
    },

    /**
     * Upload a single media file (image or video) to Storage and register it in the DB.
     * Images are compressed to WebP; videos are uploaded as-is.
     */
    async uploadMedia(file: File, altText = ''): Promise<GalleryImage> {
        const supabase = createClient();
        const isVideo = file.type.startsWith('video/');
        const mediaType = isVideo ? 'video' as const : 'image' as const;

        let uploadBlob: Blob;
        let contentType: string;
        let storagePath: string;

        if (isVideo) {
            // Videos: upload as-is, no compression
            uploadBlob = file;
            contentType = file.type;
            storagePath = generateStoragePath(file.name);
        } else {
            // Images: compress to WebP
            uploadBlob = await compressImage(file);
            contentType = 'image/webp';
            storagePath = generateStoragePath(file.name.replace(/\.[^.]+$/, '.webp'));
        }

        // 1. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, uploadBlob, {
                contentType,
                cacheControl: '31536000',
                upsert: false,
            });

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // 3. Get next display_order
        const { data: lastImage } = await supabase
            .from('gallery_images')
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1)
            .single();

        const nextOrder = (lastImage?.display_order ?? -1) + 1;

        // 4. Insert DB record
        const insertData: GalleryImageInsert = {
            file_name: file.name,
            storage_path: storagePath,
            public_url: publicUrl,
            alt_text: altText,
            media_type: mediaType,
            display_order: nextOrder,
        };

        const { data, error: insertError } = await supabase
            .from('gallery_images')
            .insert(insertData)
            .select()
            .single();

        if (insertError) {
            // Cleanup: remove from storage if DB insert fails
            await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
            throw insertError;
        }

        return data as GalleryImage;
    },

    /**
     * Delete a gallery image: remove from Storage + DB.
     */
    async deleteImage(image: GalleryImage): Promise<void> {
        const supabase = createClient();

        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([image.storage_path]);

        if (storageError) {
            console.error('Storage delete error:', storageError);
            // Continue with DB deletion even if storage fails
        }

        // 2. Delete from DB
        const { error: dbError } = await supabase
            .from('gallery_images')
            .delete()
            .eq('id', image.id);

        if (dbError) throw dbError;
    },

    /**
     * Reorder images by swapping display_order of two items.
     */
    async swapOrder(imageA: GalleryImage, imageB: GalleryImage): Promise<void> {
        const supabase = createClient();

        const [resA, resB] = await Promise.all([
            supabase
                .from('gallery_images')
                .update({ display_order: imageB.display_order, updated_at: new Date().toISOString() })
                .eq('id', imageA.id),
            supabase
                .from('gallery_images')
                .update({ display_order: imageA.display_order, updated_at: new Date().toISOString() })
                .eq('id', imageB.id),
        ]);

        if (resA.error) throw resA.error;
        if (resB.error) throw resB.error;
    },

    /**
     * Update alt text for an image.
     */
    async updateAltText(id: string, altText: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase
            .from('gallery_images')
            .update({ alt_text: altText, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};
