import { useState } from 'react';
import cloudinaryApi from '../api/cloudinaryApi';

/**
 * Hook for handling Cloudinary image uploads
 */
export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Validate file before upload
  const validateFile = (file, maxSize = 5 * 1024 * 1024) => {
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`File size too large. Maximum size is ${maxSizeMB}MB.`);
    }

    return true;
  };

  // Upload single image
  const uploadSingleImage = async (file, folder = 'school-medical-care/medical-orders') => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate file
      validateFile(file);

      setUploadProgress(30);

      // Upload to Cloudinary via backend
      const response = await cloudinaryApi.uploadImage(file, folder);
      console.log('API Response:', response);

      setUploadProgress(100);

      if (response && response.data) {
        return {
          success: true,
          url: response.data.secure_url || response.data.url,
          publicId: response.data.public_id,
          data: response.data
        };
      } else if (response && response.success && response.uploadedImage) {
        // Alternative response format
        return {
          success: true,
          url: response.uploadedImage.secure_url || response.uploadedImage.url,
          publicId: response.uploadedImage.public_id,
          data: response.uploadedImage
        };
      } else {
        throw new Error(response?.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
      return {
        success: false,
        error: err.message || 'Upload failed'
      };
    } finally {
      setUploading(false);
    }
  };

  // Upload multiple images
  const uploadMultipleImages = async (files, folder = 'school-medical-care/medical-orders') => {
    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      // Validate all files
      files.forEach(file => validateFile(file));

      setUploadProgress(30);

      // Upload to Cloudinary via backend
      const response = await cloudinaryApi.uploadMultipleImages(files, folder);

      setUploadProgress(100);

      if (response.success && response.data) {
        return {
          success: true,
          images: response.data.map(img => ({
            url: img.secure_url,
            publicId: img.public_id,
            data: img
          }))
        };
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
      return {
        success: false,
        error: err.message || 'Upload failed'
      };
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const deleteImage = async (publicId) => {
    try {
      const response = await cloudinaryApi.deleteImage(publicId);
      return {
        success: response.success,
        message: response.message
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Delete failed'
      };
    }
  };

  // Reset states
  const reset = () => {
    setError(null);
    setUploadProgress(0);
    setUploading(false);
  };

  return {
    uploading,
    uploadProgress,
    error,
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage,
    reset
  };
};

export default useCloudinaryUpload;
