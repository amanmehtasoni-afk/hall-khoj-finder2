/**
 * Hall Khoj Finder — Storage Service Layer
 * Local filesystem and Supabase Storage ready.
 * Free of Firebase dependencies.
 */

const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '../../frontend/assets/uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function uploadImageFile(file, folder = 'general') {
  if (!file) {
    const error = new Error('No image file provided for upload.');
    error.code = 'FILE_MISSING';
    error.statusCode = 400;
    throw error;
  }

  // Generate unique clean filename
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const cleanName = `${folder}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;

  // Store file locally in frontend assets upload directory
  const targetPath = path.join(UPLOADS_DIR, cleanName);
  fs.writeFileSync(targetPath, file.buffer);

  const localUrl = `/assets/uploads/${cleanName}`;
  return {
    url: localUrl,
    fileName: cleanName,
    size: file.size,
    mimetype: file.mimetype,
    storageProvider: 'local-filesystem'
  };
}

async function uploadBase64Image(dataUrl, folder = 'listings') {
  if (!dataUrl || typeof dataUrl !== 'string') {
    const error = new Error('Valid base64 data URL required');
    error.statusCode = 400;
    throw error;
  }

  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let ext = '.jpg';
  let buffer;

  if (matches && matches.length === 3) {
    const mime = matches[1];
    if (mime.includes('png')) ext = '.png';
    else if (mime.includes('webp')) ext = '.webp';
    buffer = Buffer.from(matches[2], 'base64');
  } else {
    buffer = Buffer.from(dataUrl, 'base64');
  }

  const cleanName = `${folder}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
  const targetPath = path.join(UPLOADS_DIR, cleanName);
  fs.writeFileSync(targetPath, buffer);

  return {
    url: `/assets/uploads/${cleanName}`,
    fileName: cleanName,
    size: buffer.length,
    storageProvider: 'local-filesystem'
  };
}

module.exports = {
  uploadImageFile,
  uploadBase64Image,
  UPLOADS_DIR
};
