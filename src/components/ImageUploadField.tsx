import React, { useState } from 'react';
import { Upload, X, Star, FileImage } from 'lucide-react';

interface ImageUploadFieldProps {
  images: string[];
  onChange: (images: string[]) => void;
  primaryImage: string;
  onPrimaryChange: (url: string) => void;
  isDarkMode: boolean;
  triggerToast: (msg: string) => void;
  disabled?: boolean;
}

export default function ImageUploadField({
  images,
  onChange,
  primaryImage,
  onPrimaryChange,
  isDarkMode,
  triggerToast,
  disabled = false
}: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadFile = async (file: File) => {
    if (disabled) return;
    if (!file.type.startsWith('image/')) {
      triggerToast('Only image files are supported!');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Str = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            base64: base64Str
          })
        });

        if (res.ok) {
          const data = await res.json();
          const uploadedUrl = data.url;
          
          // Append to images list
          const updatedImages = [...images, uploadedUrl];
          onChange(updatedImages);

          // If no primary image set, or primary is empty/placeholder, set it as primary
          if (!primaryImage || primaryImage.includes('unsplash.com/photo-1568901346375-23c9450c58cd')) {
            onPrimaryChange(uploadedUrl);
          }
          triggerToast('Image uploaded successfully!');
        } else {
          const err = await res.json();
          triggerToast(`Upload failed: ${err.error || 'Unknown error'}`);
        }
      } catch (e: any) {
        console.error(e);
        triggerToast(`Upload exception: ${e.message}`);
      } finally {
        setIsUploading(false);
      }
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const updated = images.filter(url => url !== urlToRemove);
    onChange(updated);

    // If we removed the primary, assign a new primary if available
    if (primaryImage === urlToRemove) {
      if (updated.length > 0) {
        onPrimaryChange(updated[0]);
      } else {
        onPrimaryChange('');
      }
    }
  };

  const borderClass = isDarkMode ? 'border-gray-800' : 'border-gray-300';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-4 text-left" id="image-upload-wrapper">
      <label className="block text-xs font-black uppercase tracking-wider text-black">
        Gourmet Dishes Images & Carousel *
      </label>

      {/* Drag & Drop Frame */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center border-4 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-[#E63946] bg-[#E63946]/5 scale-[0.99]' 
            : 'border-black bg-gray-50 hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        id="drag-and-drop-container"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          title="Upload new item image"
        />
        
        {isUploading ? (
          <div className="space-y-2 animate-pulse">
            <div className="flex justify-center text-[#E63946]">
              <FileImage className="h-10 w-10 stroke-[2] animate-bounce" />
            </div>
            <p className="text-xs font-black text-black uppercase tracking-widest">
              Uploading file to server...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center text-[#E63946]">
              <Upload className="h-10 w-10 stroke-[2]" />
            </div>
            <p className="text-xs font-black text-black uppercase tracking-widest">
              Drag & Drop file or click to browse
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Supports JPEG, PNG, WEBP (Max 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 0 && (
        <div className="space-y-2">
          <span className="block text-[10px] font-black uppercase tracking-widest text-[#E63946]">
            Dish Media Gallery ({images.length} images):
          </span>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" id="uploaded-thumbnails-grid">
            {images.map((url, idx) => {
              const isPrimary = url === primaryImage;
              return (
                <div
                  key={url + '-' + idx}
                  className={`relative rounded-xl border-2 overflow-hidden bg-gray-100 aspect-video group transition-all ${
                    isPrimary ? 'border-[#E63946] shadow-sm' : 'border-black'
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Badge */}
                  {isPrimary && (
                    <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 rounded bg-[#E63946] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white border border-black/10">
                      <Star className="h-2 w-2 fill-current" />
                      Primary
                    </span>
                  )}

                  {/* Overlay Toolbar */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => onPrimaryChange(url)}
                        className="rounded-lg bg-emerald-500 text-white p-1.5 border border-black hover:bg-emerald-600 transition-colors shadow-sm"
                        title="Set as Primary Display Image"
                      >
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => handleRemoveImage(url)}
                      className="rounded-lg bg-[#E63946] text-white p-1.5 border border-black hover:bg-red-600 transition-colors shadow-sm disabled:opacity-55"
                      title="Remove image from dish gallery"
                    >
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
