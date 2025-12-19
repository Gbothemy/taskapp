import React, { useState, useRef } from 'react';
import { fileService } from '../../services/supabase';

import LoadingSpinner from './LoadingSpinner';

const FileUpload = ({ 
  onFileUploaded, 
  acceptedTypes = "image/*,.pdf,.doc,.docx,.txt", 
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  folder = '',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedFiles = [];

    try {
      for (const file of files) {
        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        }

        // Upload file
        const result = await fileService.uploadFile(file, 'task-files', folder);
        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          path: result.data.path,
          url: result.data.publicUrl
        });
      }

      onFileUploaded(multiple ? uploadedFiles : uploadedFiles[0]);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <LoadingSpinner size="md" />
            <p className="mt-2 text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              {acceptedTypes.includes('image') && 'Images, '}
              {acceptedTypes.includes('.pdf') && 'PDFs, '}
              {acceptedTypes.includes('.doc') && 'Documents '}
              up to {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;