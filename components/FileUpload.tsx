'use client';
import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

interface FileUploadProps {
    bucket: 'covers' | 'files' | 'avatars' | 'banners';
    accept?: string;
    label: string;
    hint?: string;
    onUploadComplete: (publicUrl: string) => void;
    currentUrl?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    bucket,
    accept = 'image/*',
    label,
    hint,
    onUploadComplete,
    currentUrl,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleUpload = useCallback(async (file: File) => {
        setError(null);
        setIsUploading(true);
        setFileName(file.name);

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setError('Please sign in to upload files');
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            setUploadedUrl(data.publicUrl);
            onUploadComplete(data.publicUrl);
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [bucket, onUploadComplete]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const handleClear = useCallback(() => {
        setUploadedUrl(null);
        setFileName(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    return (
        <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group
                ${isDragging ? 'border-black bg-gray-100 scale-[1.01]' : 'border-gray-200 bg-gray-50/50 hover:border-gray-400'}
                ${error ? 'border-red-300 bg-red-50/30' : ''}
                ${uploadedUrl ? 'border-green-300 bg-green-50/30' : ''}
            `}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleInputChange}
                className="hidden"
            />

            {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Uploading...</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{fileName}</p>
                </div>
            ) : uploadedUrl ? (
                <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{fileName || 'Uploaded'}</p>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleClear(); }}
                        className="mt-1 text-[10px] text-red-400 hover:text-red-600 flex items-center gap-1 font-medium"
                    >
                        <X className="w-3 h-3" /> Remove
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-[10px] text-gray-400">{hint || 'Click or drag to upload'}</p>
                </div>
            )}

            {error && (
                <p className="text-[10px] text-red-500 mt-2 font-medium">{error}</p>
            )}

            {/* Image preview thumbnail */}
            {uploadedUrl && accept?.includes('image') && (
                <div className="mt-3">
                    <img src={uploadedUrl} alt="Preview" className="h-16 w-auto mx-auto rounded-lg object-cover border border-gray-200" />
                </div>
            )}
        </div>
    );
};
