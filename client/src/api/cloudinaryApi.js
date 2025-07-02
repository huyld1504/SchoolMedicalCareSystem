import { callAPI, callAPIFormData } from "./axiosClient";
const cloudinaryApi = {
  // Upload single image to Cloudinary
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return await callAPIFormData("post", "/images/upload", formData);
  },

  // Upload multiple images to Cloudinary
  uploadMultipleImages: async (imageFiles) => {
    const formData = new FormData();

    // Append all files to formData
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    return await callAPIFormData("post", "/images/upload-multiple", formData);
  },

  // Upload image from base64 string
  uploadImageFromBase64: async (base64Data, fileName) => {
    const requestBody = {
      base64Data,
      fileName,
      folder
    };

    return await callAPI("post", "/images/upload-base64", requestBody);
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    return await callAPI("delete", `/images/${publicId}`);
  },

  // Get thumbnail URL
  getThumbnailUrl: async (publicId, width, height) => {
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());

    const queryString = params.toString();
    const url = `/images/thumbnail/${publicId}${queryString ? `?${queryString}` : ''}`;

    return await callAPI("get", url);
  },

  // Generate optimized image URL using Cloudinary transformations
  getOptimizedUrl: (publicId, transformations = {}) => {
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      gravity = 'auto',
      ...otherTransforms
    } = transformations;

    let transformString = `q_${quality},f_${format}`;

    if (width) transformString += `,w_${width}`;
    if (height) transformString += `,h_${height}`;
    if (crop) transformString += `,c_${crop}`;
    if (gravity) transformString += `,g_${gravity}`;

    // Add other transformations
    Object.entries(otherTransforms).forEach(([key, value]) => {
      transformString += `,${key}_${value}`;
    });

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
  },

  // Validate image file before upload
  validateImage: (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB to match backend limit
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    } = options;

    const errors = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default cloudinaryApi;
