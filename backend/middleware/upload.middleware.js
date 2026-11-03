/**
 * Hall Khoj Finder — Image Upload Middleware (Multer)
 * Enforces file type validation (JPEG, PNG, WebP) and 5MB size limit.
 */

const multer = require('multer');

// Memory storage keeps file buffer in memory for processing & storage transfer
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file format. Only JPEG, PNG and WebP images are allowed.');
    error.code = 'INVALID_FILE_TYPE';
    error.statusCode = 400;
    cb(error, false);
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
});

module.exports = {
  uploadImage: upload.single('image'),
  uploadMultiple: upload.array('images', 8)
};
