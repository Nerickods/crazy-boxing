'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { galleryService } from '@/features/facilities/services/galleryService';
import { GalleryImage } from '@/features/facilities/types/gallery';
import {
    Loader2, Plus, Trash2, ArrowUp, ArrowDown,
    ImagePlus, X, CheckCircle2, AlertCircle, GripVertical,
    Play, Maximize2, ChevronLeft, ChevronRight, Film, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime';
const VALID_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];

export default function AdminGalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ total: number; current: number } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const [previewList, setPreviewList] = useState<GalleryImage[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Derived lists
    const photos = images.filter(i => i.media_type === 'image');
    const videos = images.filter(i => i.media_type === 'video');

    useEffect(() => {
        loadImages();
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Keyboard navigation for preview
    useEffect(() => {
        if (previewIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewIndex(null);
            if (e.key === 'ArrowRight') setPreviewIndex(prev => prev !== null && prev < previewList.length - 1 ? prev + 1 : prev);
            if (e.key === 'ArrowLeft') setPreviewIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
        };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = 'unset';
        };
    }, [previewIndex, previewList.length]);

    const loadImages = async () => {
        try {
            const data = await galleryService.getAllGalleryImages();
            setImages(data);
        } catch {
            showToast('Error al cargar medios', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    const openPreview = (list: GalleryImage[], index: number) => {
        setPreviewList(list);
        setPreviewIndex(index);
    };

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const validFiles = Array.from(files).filter(f => VALID_MIMES.includes(f.type));
        if (validFiles.length === 0) {
            showToast('Solo se permiten imágenes y videos (JPG, PNG, WebP, GIF, MP4, WebM)', 'error');
            return;
        }

        setUploading(true);
        setUploadProgress({ total: validFiles.length, current: 0 });

        let successCount = 0;
        for (const file of validFiles) {
            try {
                await galleryService.uploadMedia(file);
                successCount++;
                setUploadProgress(prev => prev ? { ...prev, current: successCount } : null);
            } catch (error) {
                console.error('Upload failed for:', file.name, error);
                showToast(`Error subiendo ${file.name}`, 'error');
            }
        }

        setUploading(false);
        setUploadProgress(null);
        if (successCount > 0) {
            showToast(`${successCount} archivo${successCount > 1 ? 's' : ''} subido${successCount > 1 ? 's' : ''}`, 'success');
            await loadImages();
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (image: GalleryImage) => {
        try {
            await galleryService.deleteImage(image);
            setImages(prev => prev.filter(img => img.id !== image.id));
            setDeleteConfirm(null);
            showToast('Archivo eliminado', 'success');
        } catch {
            showToast('Error al eliminar', 'error');
        }
    };

    const handleMoveUp = async (index: number, list: GalleryImage[]) => {
        if (index === 0) return;
        try {
            await galleryService.swapOrder(list[index], list[index - 1]);
            await loadImages();
        } catch {
            showToast('Error al reordenar', 'error');
        }
    };

    const handleMoveDown = async (index: number, list: GalleryImage[]) => {
        if (index === list.length - 1) return;
        try {
            await galleryService.swapOrder(list[index], list[index + 1]);
            await loadImages();
        } catch {
            showToast('Error al reordenar', 'error');
        }
    };

    // Drag & Drop
    const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }, []);
    const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }, []);
    const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); handleFileSelect(e.dataTransfer.files); }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    /* ═══════════════════════════════════════════════
       MEDIA CARD — Shared for photos and videos
    ═══════════════════════════════════════════════ */
    const MediaCard = ({ item, index, list }: { item: GalleryImage; index: number; list: GalleryImage[] }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-lg ${item.media_type === 'video' ? 'aspect-[9/16] max-w-[200px]' : 'aspect-square'
                }`}
        >
            {/* Media Content */}
            {item.media_type === 'video' ? (
                <video
                    src={item.public_url}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                />
            ) : (
                <img
                    src={item.public_url}
                    alt={item.alt_text || item.file_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            )}

            {/* Video Badge */}
            {item.media_type === 'video' && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg z-10">
                    <Film className="w-3 h-3 text-cyan-400" />
                    <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">Video</span>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Order Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                    <GripVertical className="w-3 h-3 text-white/60" />
                    <span className="text-white text-xs font-mono font-bold">#{index + 1}</span>
                </div>

                {/* Preview button */}
                <button
                    onClick={() => openPreview(list, index)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-white/20 backdrop-blur-sm rounded-2xl text-white hover:bg-white/40 transition-all hover:scale-110"
                    title="Ver en pantalla completa"
                >
                    {item.media_type === 'video' ? (
                        <Play className="w-8 h-8" />
                    ) : (
                        <Maximize2 className="w-6 h-6" />
                    )}
                </button>

                {/* Reorder Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <button
                        onClick={() => handleMoveUp(index, list)}
                        disabled={index === 0}
                        className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => handleMoveDown(index, list)}
                        disabled={index === list.length - 1}
                        className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Delete Button */}
                <div className="absolute bottom-3 right-3">
                    {deleteConfirm === item.id ? (
                        <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm rounded-xl px-3 py-2">
                            <span className="text-white text-xs font-medium">¿Eliminar?</span>
                            <button onClick={() => handleDelete(item)} className="px-2 py-0.5 bg-white/20 rounded text-white text-xs font-bold hover:bg-white/40">Sí</button>
                            <button onClick={() => setDeleteConfirm(null)} className="px-2 py-0.5 bg-white/10 rounded text-white/80 text-xs hover:bg-white/20">No</button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-2 bg-red-500/80 backdrop-blur-sm rounded-xl text-white hover:bg-red-500 transition-all hover:scale-110"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* File Name */}
                <div className="absolute bottom-3 left-3 max-w-[60%]">
                    <p className="text-white/80 text-[10px] font-mono truncate">{item.file_name}</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto space-y-8">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border ${toast.type === 'success'
                                ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                            }`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium text-sm">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-30 py-4 -my-4 border-b border-gray-100 dark:border-white/5">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        Galería de Instalaciones
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Gestiona fotos y videos de la sección &quot;THE BATTLEGROUND&quot;.
                    </p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all transform active:scale-95 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4 stroke-[3px]" />
                    )}
                    {uploading
                        ? `Subiendo ${uploadProgress?.current}/${uploadProgress?.total}...`
                        : 'Subir Archivos'
                    }
                </button>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
            />

            {/* Empty State / Drop Zone */}
            {images.length === 0 ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        flex flex-col items-center justify-center gap-6 p-16 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300
                        ${dragOver
                            ? 'border-blue-500 bg-blue-500/5 scale-[1.02]'
                            : 'border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-500/5'
                        }
                    `}
                >
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${dragOver ? 'bg-blue-500/20 scale-110' : 'bg-slate-100 dark:bg-white/5'}`}>
                        <ImagePlus className={`w-10 h-10 ${dragOver ? 'text-blue-500' : 'text-slate-300 dark:text-white/20'}`} />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2">
                            {dragOver ? '¡Suelta para subir!' : 'Arrastra y suelta fotos o videos aquí'}
                        </h3>
                        <p className="text-sm text-slate-400">JPG, PNG, WebP, GIF, MP4, WebM • Videos max 50MB</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Drop Zone Banner */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-300 ${dragOver ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-transparent hover:border-slate-200 dark:hover:border-white/10'
                            }`}
                    >
                        {dragOver && <p className="text-blue-500 font-bold text-sm animate-pulse">Suelta los archivos aquí</p>}
                    </div>

                    {/* ═══════ PHOTOS SECTION ═══════ */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Camera className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Fotos</h2>
                                <p className="text-xs text-slate-400">{photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</p>
                            </div>
                        </div>

                        {photos.length === 0 ? (
                            <p className="text-slate-400 text-sm italic py-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                                No hay fotos. Sube la primera foto arriba.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                <AnimatePresence>
                                    {photos.map((photo, index) => (
                                        <MediaCard key={photo.id} item={photo} index={index} list={photos} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* ═══════ VIDEOS SECTION ═══════ */}
                    <div className="mt-12">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                <Film className="w-5 h-5 text-cyan-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Videos</h2>
                                <p className="text-xs text-slate-400">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</p>
                            </div>
                        </div>

                        {videos.length === 0 ? (
                            <p className="text-slate-400 text-sm italic py-8 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                                No hay videos. Sube el primer video arriba.
                            </p>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                <AnimatePresence>
                                    {videos.map((video, index) => (
                                        <div key={video.id} className="shrink-0">
                                            <MediaCard item={video} index={index} list={videos} />
                                        </div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ═══════════════════════════════════════════════
                FULLSCREEN PREVIEW MODAL
                - Videos: object-contain on dark bg (respects original aspect ratio)
                - Images: object-contain centered
            ═══════════════════════════════════════════════ */}
            <AnimatePresence>
                {previewIndex !== null && previewList[previewIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center"
                        onClick={() => setPreviewIndex(null)}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setPreviewIndex(null)}
                            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl text-white transition-all z-10 hover:scale-110"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Counter */}
                        <div className="absolute top-6 left-6 text-white/60 text-sm font-mono z-10">
                            {previewIndex + 1} / {previewList.length}
                        </div>

                        {/* Media Type Badge */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-sm text-xs font-bold uppercase tracking-wider ${previewList[previewIndex].media_type === 'video'
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    : 'bg-white/10 text-white/60 border border-white/10'
                                }`}>
                                {previewList[previewIndex].media_type === 'video' ? (
                                    <><Film className="w-3.5 h-3.5" /> Video</>
                                ) : (
                                    <><Maximize2 className="w-3.5 h-3.5" /> Imagen</>
                                )}
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        {previewIndex > 0 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setPreviewIndex(previewIndex - 1); }}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl text-white transition-all z-10 hover:scale-110"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {previewIndex < previewList.length - 1 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setPreviewIndex(previewIndex + 1); }}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl text-white transition-all z-10 hover:scale-110"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}

                        {/* Media Content — object-contain respects original aspect ratio */}
                        <motion.div
                            key={previewIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {previewList[previewIndex].media_type === 'video' ? (
                                <video
                                    key={previewList[previewIndex].id}
                                    src={previewList[previewIndex].public_url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
                                />
                            ) : (
                                <img
                                    src={previewList[previewIndex].public_url}
                                    alt={previewList[previewIndex].alt_text || previewList[previewIndex].file_name}
                                    className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
                                />
                            )}
                        </motion.div>

                        {/* File info */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10 z-10">
                            <p className="text-white/80 text-sm font-mono truncate max-w-[60vw]">
                                {previewList[previewIndex].file_name}
                            </p>
                        </div>

                        {/* Thumbnail Strip */}
                        {previewList.length > 1 && (
                            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto p-2 rounded-2xl bg-white/5 backdrop-blur-sm z-10">
                                {previewList.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={(e) => { e.stopPropagation(); setPreviewIndex(idx); }}
                                        className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 transition-all border-2 ${idx === previewIndex
                                                ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/30'
                                                : 'border-transparent opacity-50 hover:opacity-80'
                                            }`}
                                    >
                                        {item.media_type === 'video' ? (
                                            <>
                                                <video src={item.public_url} className="w-full h-full object-cover" muted preload="metadata" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Play className="w-3 h-3 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <img src={item.public_url} alt="" className="w-full h-full object-cover" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Progress Overlay */}
            <AnimatePresence>
                {uploading && uploadProgress && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-white/10 text-center max-w-sm w-full mx-4"
                        >
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Subiendo archivos...</h3>
                            <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                />
                            </div>
                            <p className="text-sm font-mono text-slate-500">{uploadProgress.current} / {uploadProgress.total}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
