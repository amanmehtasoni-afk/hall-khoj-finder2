/**
 * Hall Khoj Finder — Auth Controller
 */

const authService = require('../services/auth.service');
const firestore = require('../services/firestore.service');
const { successResponse, errorResponse } = require('../utils/response');

async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(res, result, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { mobile, identifier, email, password } = req.body;
    const userIdentifier = mobile || identifier || email;
    const result = await authService.loginUser(userIdentifier, password);
    return successResponse(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await firestore.getDocument('users', req.user.id);
    if (!user) {
      return errorResponse(res, 'User profile not found', 'NOT_FOUND', 404);
    }
    const safeUser = { ...user };
    delete safeUser.password;

    if (safeUser.role === 'owner') {
      const owner = await firestore.getDocument('owners', `owner_${safeUser.id}`) ||
        (await firestore.queryCollection('owners', o => o.userId === safeUser.id))[0];
      if (owner) {
        safeUser.businessCategory = safeUser.businessCategory || owner.businessCategory || owner.businessType || '';
        safeUser.businessName = safeUser.businessName || owner.businessName || '';
        safeUser.ownerId = owner.id;
      }
    }

    return successResponse(res, safeUser, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
}

async function sendOtp(req, res, next) {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return errorResponse(res, 'Mobile number is required', 'VALIDATION_ERROR', 400);
    }
    const result = await authService.sendOtp(mobile);
    return successResponse(res, result, 'OTP dispatched successfully');
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return errorResponse(res, 'Mobile and OTP are required', 'VALIDATION_ERROR', 400);
    }
    const result = await authService.verifyOtp(mobile, otp);
    return successResponse(res, result, 'Phone authentication successful');
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 'Email is required', 'VALIDATION_ERROR', 400);
    }
    const result = await authService.forgotPassword(email);
    return successResponse(res, result, result.message);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return errorResponse(res, 'Reset token and new password are required', 'VALIDATION_ERROR', 400);
    }
    const result = await authService.resetPassword(token, newPassword);
    return successResponse(res, result, result.message);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
};
