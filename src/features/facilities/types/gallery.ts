export type MediaType = 'image' | 'video';

export interface GalleryImage {
    id: string;
    file_name: string;
    storage_path: string;
    public_url: string;
    alt_text: string;
    media_type: MediaType;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface GalleryImageInsert {
    file_name: string;
    storage_path: string;
    public_url: string;
    alt_text?: string;
    media_type: MediaType;
    display_order: number;
    is_active?: boolean;
}

