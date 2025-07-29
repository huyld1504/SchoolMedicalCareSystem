/* eslint-disable n/no-process-env */
/* eslint-disable no-console */

import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  success: boolean;
  public_id?: string;
  url?: string;
  secure_url?: string;
  error?: string;
}

export interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
  [key: string]: unknown;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  format?: string;
  transformation?: TransformationOptions[];
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
}

class CloudinaryService {
  /**
   * Upload hình ảnh từ file path
   * @param filePath - Đường dẫn đến file
   * @param options - Các tùy chọn upload
   * @returns Promise<CloudinaryUploadResult>
   */
  public async uploadImage(
    filePath: string,
    options: CloudinaryUploadOptions = {},
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder ?? 'school-medical-care',
        resource_type: 'image' as const,
        ...options,
      };

      const result: UploadApiResponse = await cloudinary.uploader.upload(
        filePath,
        uploadOptions,
      );

      return {
        success: true,
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload hình ảnh từ buffer
   * @param buffer - Buffer của file
   * @param options - Các tùy chọn upload
   * @returns Promise<CloudinaryUploadResult>
   */
  public async uploadFromBuffer(
    buffer: Buffer,
    options: CloudinaryUploadOptions = {},
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder ?? 'school-medical-care',
        resource_type: 'image' as const,
        ...options,
      };

      return await new Promise((resolve) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              resolve({
                success: false,
                error: error.message,
              });
            } else if (result) {
              resolve({
                success: true,
                public_id: result.public_id,
                url: result.url,
                secure_url: result.secure_url,
              });
            } else {
              resolve({
                success: false,
                error: 'Upload failed - no result returned',
              });
            }
          },
        ).end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Upload hình ảnh từ base64 string
   * @param base64String - Chuỗi base64 của hình ảnh
   * @param options - Các tùy chọn upload
   * @returns Promise<CloudinaryUploadResult>
   */
  public async uploadFromBase64(
    base64String: string,
    options: CloudinaryUploadOptions = {},
  ): Promise<CloudinaryUploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder ?? 'school-medical-care',
        resource_type: 'image' as const,
        ...options,
      };

      const result: UploadApiResponse = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64String}`,
        uploadOptions,
      );

      return {
        success: true,
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }  /**
   * Xóa hình ảnh từ Cloudinary
   * @param publicId - Public ID của hình ảnh
   * @returns Promise<boolean>
   */
  public async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId) as {
        result: string,
      };
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  /**
   * Tạo URL với transformation
   * @param publicId - Public ID của hình ảnh
   * @param transformations - Các transformation cần áp dụng
   * @returns string - URL đã được transform
   */
  public generateTransformedUrl(
    publicId: string,
    transformations: TransformationOptions[] = [],
  ): string {
    return cloudinary.url(publicId, {
      transformation: transformations,
      secure: true,
    });
  }
  /**
   * Tạo URL thumbnail
   * @param publicId - Public ID của hình ảnh
   * @param width - Chiều rộng thumbnail
   * @param height - Chiều cao thumbnail
   * @returns string - URL thumbnail
   */
  public generateThumbnailUrl(
    publicId: string,
    width = 150,
    height = 150,
  ): string {
    return cloudinary.url(publicId, {
      transformation: [
        { width, height, crop: 'fill' },
        { quality: 'auto:good' },
        { format: 'webp' },
      ],
      secure: true,
    });
  }

  /**
   * Lấy thông tin của hình ảnh
   * @param publicId - Public ID của hình ảnh
   * @returns Promise<unknown>
   */
  public async getImageInfo(publicId: string): Promise<unknown> {
    try {
      const result = await cloudinary.api.resource(publicId) as unknown;
      return result;
    } catch (error) {
      console.error('Cloudinary get info error:', error);
      return null;
    }
  }

  /**
   * Kiểm tra kết nối Cloudinary
   * @returns Promise<boolean>
   */
  public async testConnection(): Promise<boolean> {
    try {
      await cloudinary.api.ping();
      return true;
    } catch (error) {
      console.error('Cloudinary connection test failed:', error);
      return false;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
export { cloudinary };