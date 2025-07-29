/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { cloudinaryService } from '@src/common/libs/lib.cloudinary';
import { auth } from '@src/middlewares/ middleware.authorization';
import { transform } from '@src/middlewares/middleware.jwtTransform';

const router = Router();

// Cấu hình Multer cho upload file
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file hình ảnh
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh!'));
    }
  },
});

router.post(
  '/upload',
  [transform(), auth()],
  upload.single('image'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Không có file được upload',
        });
        return;
      }

      const timestamp = Date.now();
      const fileName = req.file.originalname.split('.')[0];
      const publicId = `${timestamp}-${fileName}`;

      const result = await cloudinaryService.uploadFromBuffer(
        req.file.buffer,
        {
          folder: 'school-medical-care/uploads',
          public_id: publicId,
          resource_type: 'image',
        },
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Upload hình ảnh thành công',
          data: {
            imageUrl: result.secure_url, // URL để lưu vào DB
            publicId: result.public_id,  // Để xóa sau này nếu cần
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
          },
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Upload thất bại',
          error: result.error,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

router.post(
  '/upload-multiple',
  auth(),
  upload.array('images', 10), // Tối đa 10 files
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Không có file nào được upload',
        });
        return;
      }

      const uploadPromises = files.map(async (file, index) => {
        const timestamp = Date.now();
        const fileName = file.originalname.split('.')[0];
        const publicId = `${timestamp}-${index}-${fileName}`;

        const result = await cloudinaryService.uploadFromBuffer(
          file.buffer,
          {
            folder: 'school-medical-care/uploads',
            public_id: publicId,
            resource_type: 'image',
          },
        );

        return {
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          uploadResult: result,
        };
      });

      const results = await Promise.all(uploadPromises);
      const successUploads = results.filter(r => r.uploadResult.success);
      const failedUploads = results.filter(r => !r.uploadResult.success);

      if (successUploads.length === 0) {
        res.status(500).json({
          success: false,
          message: 'Tất cả upload đều thất bại',
          errors: failedUploads.map(f => f.uploadResult.error),
        });
        return;
      }
      const successCount = successUploads.length;
      const totalCount = files.length;

      res.status(200).json({
        success: true,
        message: `Upload thành công ${successCount}/${totalCount} ảnh`,
        data: {
          images: successUploads.map(upload => ({
            imageUrl: upload.uploadResult.secure_url,
            publicId: upload.uploadResult.public_id,
            originalName: upload.originalName,
            size: upload.size,
            mimetype: upload.mimetype,
            uploadedAt: new Date().toISOString(),
          })),
          summary: {
            total: files.length,
            success: successUploads.length,
            failed: failedUploads.length,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

router.post(
  '/upload-base64',
  auth(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { base64Data, fileName, folder } = req.body;

      if (!base64Data) {
        res.status(400).json({
          success: false,
          message: 'Thiếu dữ liệu base64',
        });
        return;
      }

      const timestamp = Date.now(); const publicId = fileName ?
        `${timestamp}-${fileName}` : `${timestamp}-image`;
      const uploadFolder = folder ?? 'school-medical-care/uploads';

      const result = await cloudinaryService.uploadFromBase64(
        base64Data,
        {
          folder: uploadFolder,
          public_id: publicId,
        },
      );

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Upload hình ảnh thành công',
          data: {
            imageUrl: result.secure_url,
            publicId: result.public_id,
            uploadedAt: new Date().toISOString(),
          },
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Upload thất bại',
          error: result.error,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

router.delete(
  '/delete',
  [transform(), auth()],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { publicId } = req.body;

      if (!publicId) {
        res.status(400).json({
          success: false,
          message: 'Thiếu publicId',
        });
        return;
      }

      // Decode publicId nếu được encode
      // const decodedPublicId = decodeURIComponent(publicId);
      const deleted = await cloudinaryService.deleteImage(publicId);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'Xóa hình ảnh thành công',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Không tìm thấy hình ảnh hoặc xóa thất bại',
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

router.get(
  '/thumbnail/:publicId',
  (req: Request, res: Response): void => {
    try {
      const { publicId } = req.params;
      const { width, height } = req.query;

      if (!publicId) {
        res.status(400).json({
          success: false,
          message: 'Thiếu publicId',
        });
        return;
      }

      const decodedPublicId = decodeURIComponent(publicId);
      const thumbnailWidth = width ? parseInt(width as string, 10) : 150;
      const thumbnailHeight = height ? parseInt(height as string, 10) : 150;

      const thumbnailUrl = cloudinaryService.generateThumbnailUrl(
        decodedPublicId,
        thumbnailWidth,
        thumbnailHeight,
      );

      res.status(200).json({
        success: true,
        data: {
          thumbnailUrl,
          originalPublicId: decodedPublicId,
          width: thumbnailWidth,
          height: thumbnailHeight,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi server',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
);

export default router;
