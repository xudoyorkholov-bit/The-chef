import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/profile', (req, res) => userController.getProfile(req, res));
router.put('/profile', (req, res) => userController.updateProfile(req, res));
router.post('/profile/picture', upload.single('picture'), (req, res) => userController.uploadProfilePicture(req, res));
router.delete('/profile/picture', (req, res) => userController.deleteProfilePicture(req, res));

// Payment methods routes
router.post('/payment-methods', (req, res) => userController.addPaymentMethod(req, res));
router.put('/payment-methods/:cardId', (req, res) => userController.updatePaymentMethod(req, res));
router.delete('/payment-methods/:cardId', (req, res) => userController.deletePaymentMethod(req, res));

export default router;
