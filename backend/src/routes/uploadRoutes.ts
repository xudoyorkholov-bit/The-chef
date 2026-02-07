import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import { authenticate } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

// Configure multer for file upload (temporary storage)
const storage = multer.memoryStorage(); // Use memory storage for processing

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Faqat rasm fayllari ruxsat etilgan!'));
    }
  }
});

// POST /api/upload - Upload image and convert to WebP
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          message: 'Fayl tanlanmagan',
          code: 'NO_FILE'
        }
      });
    }

    // Generate unique filename with .webp extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}.webp`;
    const uploadDir = path.join(__dirname, '../../uploads');
    const filepath = path.join(uploadDir, filename);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Convert image to WebP format with optimization
    await sharp(req.file.buffer)
      .webp({ 
        quality: 85, // Good balance between quality and file size
        effort: 4    // Compression effort (0-6, higher = better compression but slower)
      })
      .resize(1200, 1200, { // Max dimensions while maintaining aspect ratio
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(filepath);

    const imageUrl = `/uploads/${filename}`;
    
    res.json({
      url: imageUrl,
      filename: filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: {
        message: 'Rasm yuklashda xatolik',
        code: 'UPLOAD_ERROR'
      }
    });
  }
});

export default router;
