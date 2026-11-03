/**
 * Hall Khoj Finder — Upload Controller
 */

const { uploadImageFile, uploadBase64Image } = require('../services/storage.service');
const { successResponse, errorResponse } = require('../utils/response');

async function handleImageUpload(req, res, next) {
  try {
    const folder = req.body?.folder || 'listings';

    if (req.file) {
      const result = await uploadImageFile(req.file, folder);
      return successResponse(res, result, 'Image uploaded successfully', 201);
    }

    if (req.body?.base64) {
      const result = await uploadBase64Image(req.body.base64, folder);
      return successResponse(res, result, 'Image uploaded successfully', 201);
    }

    return errorResponse(res, 'No image file or base64 data uploaded', 'FILE_MISSING', 400);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleImageUpload
};
