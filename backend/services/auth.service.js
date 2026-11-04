/**
 * Hall Khoj Finder — Authentication Service
 * Uses bcryptjs for salt hashing and jsonwebtoken for stateless, secure auth.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const firestore = require('./firestore.service');
const { generateId } = require('../utils/idGenerator');

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'hall_khoj_finder_super_secure_jwt_secret_2026';
const JWT_EXPIRES_IN = '7d';

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      mobile: user.mobile,
      email: user.email || '',
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

async function registerUser({
  name,
  mobile = '',
  email = '',
  password,
  role = 'user',
  state = '',
  city = '',
  village = '',
  pinCode = '',
  businessName = '',
  businessCategory = '',
  businessType = ''
}) {
  if (!name || name.trim().length < 2) {
    const error = new Error('Please enter your full name (minimum 2 characters).');
    error.code = 'INVALID_NAME';
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanMobile = (mobile || '').replace(/[\s+-]/g, '').slice(-10);

  if (!cleanEmail && !cleanMobile) {
    const error = new Error('Please enter an email address or mobile number to register.');
    error.code = 'IDENTIFIER_REQUIRED';
    error.statusCode = 400;
    throw error;
  }

  if (cleanEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      const error = new Error('Please enter a valid email address.');
      error.code = 'INVALID_EMAIL';
      error.statusCode = 400;
      throw error;
    }
    const existingByEmail = await firestore.queryCollection('users', u => (u.email || '').toLowerCase().trim() === cleanEmail);
    if (existingByEmail.length > 0) {
      const error = new Error('An account with this email address already exists. Please sign in or use another email.');
      error.code = 'EMAIL_EXISTS';
      error.statusCode = 409;
      throw error;
    }
  }

  if (cleanMobile) {
    if (cleanMobile.length < 10) {
      const error = new Error('Please enter a valid 10-digit mobile number.');
      error.code = 'INVALID_MOBILE';
      error.statusCode = 400;
      throw error;
    }
    const existingByMobile = await firestore.queryCollection('users', u => {
      const m = (u.mobile || '').replace(/[\s+-]/g, '').slice(-10);
      return m && m === cleanMobile;
    });
    if (existingByMobile.length > 0) {
      const error = new Error('An account with this mobile number already exists. Please sign in or use another mobile number.');
      error.code = 'MOBILE_EXISTS';
      error.statusCode = 409;
      throw error;
    }
  }

  if (!password || password.length < 8) {
    const error = new Error('Password must be at least 8 characters long.');
    error.code = 'WEAK_PASSWORD';
    error.statusCode = 400;
    throw error;
  }

  const isOwner = role === 'owner';
  const resolvedCategory = (businessCategory || businessType || '').trim();
  const resolvedBusinessName = (businessName || '').trim();

  if (isOwner) {
    if (!resolvedCategory) {
      const error = new Error('Please select your business category.');
      error.code = 'CATEGORY_REQUIRED';
      error.statusCode = 400;
      throw error;
    }
    if (!resolvedBusinessName) {
      const error = new Error('Please enter your business or venue name.');
      error.code = 'BUSINESS_NAME_REQUIRED';
      error.statusCode = 400;
      throw error;
    }
  }

  const hashedPassword = await hashPassword(password);
  const userId = generateId('usr');

  const newUser = {
    id: userId,
    name: name.trim(),
    mobile: cleanMobile,
    email: cleanEmail,
    password: hashedPassword,
    role: isOwner ? 'owner' : 'user',
    businessCategory: isOwner ? resolvedCategory : '',
    businessName: isOwner ? resolvedBusinessName : '',
    state: (state || '').trim(),
    city: (city || '').trim(),
    village: (village || '').trim(),
    pinCode: (pinCode || '').trim(),
    isVerified: true,
    favorites: [],
    createdAt: new Date().toISOString()
  };

  // If registering as owner, create owner profile document
  if (isOwner) {
    const ownerProfile = {
      id: `owner_${userId}`,
      userId: userId,
      ownerName: name.trim(),
      businessName: resolvedBusinessName,
      businessCategory: resolvedCategory,
      businessType: resolvedCategory,
      mobile: cleanMobile,
      email: cleanEmail,
      city: (city || '').trim(),
      state: (state || '').trim(),
      village: (village || '').trim(),
      pinCode: (pinCode || '').trim(),
      verificationStatus: 'PENDING',
      rating: 5.0,
      totalListings: 0,
      createdAt: new Date().toISOString()
    };
    await firestore.setDocument('owners', ownerProfile.id, ownerProfile);
  }

  await firestore.setDocument('users', userId, newUser);

  // Return safe user object (without password) + JWT token
  const safeUser = { ...newUser };
  delete safeUser.password;

  if (isOwner) {
    safeUser.businessCategory = resolvedCategory;
    safeUser.businessName = resolvedBusinessName;
  }

  const token = generateToken(safeUser);
  return { user: safeUser, token };
}

async function loginUser(identifier, password) {
  if (!identifier) {
    const error = new Error('Please enter your email or mobile number.');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 400;
    throw error;
  }

  if (!password) {
    const error = new Error('Please enter your password.');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 400;
    throw error;
  }

  const cleanInput = (identifier || '').trim();
  const cleanMobile = cleanInput.replace(/[\s+-]/g, '').slice(-10);
  const normalizedEmail = cleanInput.toLowerCase();

  const users = await firestore.queryCollection('users', u => {
    const userMobile = (u.mobile || '').replace(/[\s+-]/g, '').slice(-10);
    const userEmail = (u.email || '').toLowerCase().trim();
    return (userEmail && userEmail === normalizedEmail) || 
      (cleanMobile.length === 10 && userMobile && userMobile === cleanMobile);
  });
  
  if (users.length === 0) {
    const error = new Error('No account found with this email or mobile number. Please register first.');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error('Incorrect password. Please try again.');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 401;
    throw error;
  }

  if (user.accountStatus === 'SUSPENDED' || user.isSuspended) {
    const error = new Error('Your account has been suspended by platform administration. Please contact support.');
    error.code = 'ACCOUNT_SUSPENDED';
    error.statusCode = 403;
    throw error;
  }

  const safeUser = { ...user };
  delete safeUser.password;

  // Ensure owner business category and name are populated after login
  if (safeUser.role === 'owner') {
    const owner = await firestore.getDocument('owners', `owner_${safeUser.id}`) ||
      (await firestore.queryCollection('owners', o => o.userId === safeUser.id))[0];
    if (owner) {
      safeUser.businessCategory = safeUser.businessCategory || owner.businessCategory || owner.businessType || '';
      safeUser.businessName = safeUser.businessName || owner.businessName || '';
      safeUser.ownerId = owner.id;
    }
  }

  const token = generateToken(safeUser);
  return { user: safeUser, token };
}

async function googleAuth({ credential, email, name, picture, role = 'user' }) {
  if (!email && !credential) {
    const error = new Error('Google credential or email is required.');
    error.code = 'INVALID_CREDENTIALS';
    error.statusCode = 400;
    throw error;
  }

  let userEmail = (email || '').toLowerCase().trim();
  let userName = (name || '').trim();
  let userAvatar = picture || '';

  // Safely extract from Google JWT token if provided
  if (credential && typeof credential === 'string') {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload.email) userEmail = payload.email.toLowerCase().trim();
        if (payload.name && !userName) userName = payload.name.trim();
        if (payload.picture && !userAvatar) userAvatar = payload.picture;
      }
    } catch (e) {
      console.warn('[Google Auth Token Decode]', e.message);
    }
  }

  if (!userEmail) {
    const error = new Error('Unable to extract verified email from Google Sign-In.');
    error.code = 'INVALID_GOOGLE_TOKEN';
    error.statusCode = 400;
    throw error;
  }

  const existingUsers = await firestore.queryCollection('users', u => (u.email || '').toLowerCase().trim() === userEmail);
  let user = null;
  let isNewUser = false;

  if (existingUsers.length > 0) {
    user = existingUsers[0];
    if (userAvatar && !user.avatar) {
      await firestore.updateDocument('users', user.id, { avatar: userAvatar });
      user.avatar = userAvatar;
    }
  } else {
    const userId = generateId('usr');
    const newUser = {
      id: userId,
      name: userName || userEmail.split('@')[0],
      email: userEmail,
      mobile: '',
      role: role === 'owner' ? 'owner' : 'user',
      authProvider: 'google',
      avatar: userAvatar,
      isVerified: true,
      favorites: [],
      createdAt: new Date().toISOString()
    };
    await firestore.setDocument('users', userId, newUser);
    user = newUser;
    isNewUser = true;

    if (newUser.role === 'owner') {
      const ownerProfile = {
        id: `owner_${userId}`,
        userId: userId,
        ownerName: newUser.name,
        businessName: `${newUser.name}'s Venue Services`,
        businessCategory: 'Event Venue',
        businessType: 'Event Venue',
        email: userEmail,
        verificationStatus: 'PENDING',
        rating: 5.0,
        totalListings: 0,
        createdAt: new Date().toISOString()
      };
      await firestore.setDocument('owners', ownerProfile.id, ownerProfile);
    }
  }

  if (user.accountStatus === 'SUSPENDED' || user.isSuspended) {
    const error = new Error('Your account has been suspended by platform administration.');
    error.code = 'ACCOUNT_SUSPENDED';
    error.statusCode = 403;
    throw error;
  }

  const safeUser = { ...user };
  delete safeUser.password;
  const token = generateToken(safeUser);
  return { user: safeUser, token, isNewUser };
}

// In-memory store for OTPs (with expiration)
const otpStore = new Map();

async function sendOtp(mobile) {
  const cleanMobile = (mobile || '').replace(/[\s+-]/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    const error = new Error('Valid 10-digit Indian mobile number is required.');
    error.code = 'INVALID_MOBILE';
    error.statusCode = 400;
    throw error;
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(cleanMobile, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  console.log(`📲 [Auth OTP] Dispatched OTP ${otp} for mobile: ${cleanMobile}`);

  return {
    mobile: cleanMobile,
    expiresInSeconds: 300,
    debugOtp: process.env.NODE_ENV !== 'production' ? otp : undefined
  };
}

async function verifyOtp(mobile, otp) {
  const cleanMobile = (mobile || '').replace(/[\s+-]/g, '').slice(-10);
  const record = otpStore.get(cleanMobile);

  if (!record) {
    const error = new Error('No OTP request found for this mobile number. Please request a new OTP.');
    error.code = 'OTP_NOT_FOUND';
    error.statusCode = 400;
    throw error;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanMobile);
    const error = new Error('OTP has expired. Please request a new one.');
    error.code = 'OTP_EXPIRED';
    error.statusCode = 400;
    throw error;
  }

  if (record.otp !== (otp || '').trim()) {
    const error = new Error('Incorrect OTP entered. Please try again.');
    error.code = 'INVALID_OTP';
    error.statusCode = 400;
    throw error;
  }

  // Delete used OTP
  otpStore.delete(cleanMobile);

  // Find user by mobile
  const users = await firestore.queryCollection('users', u => (u.mobile || '').replace(/[\s+-]/g, '').slice(-10) === cleanMobile);
  let user = null;
  let isNewUser = false;

  if (users.length > 0) {
    user = users[0];
  } else {
    // Create new customer account on first OTP login
    const userId = generateId('usr');
    const newUser = {
      id: userId,
      name: `Customer ${cleanMobile.slice(-4)}`,
      email: `${cleanMobile}@hallkhoj.phone`,
      mobile: cleanMobile,
      role: 'customer',
      profilePhoto: '',
      address: '',
      state: '',
      district: '',
      city: '',
      village: '',
      pinCode: '',
      isVerified: true,
      favorites: [],
      savedLocations: [],
      createdAt: new Date().toISOString()
    };
    await firestore.setDocument('users', userId, newUser);
    user = newUser;
    isNewUser = true;
  }

  const safeUser = { ...user };
  delete safeUser.password;
  const token = generateToken(safeUser);

  return { user: safeUser, token, isNewUser };
}

async function forgotPassword(email) {
  const normalizedEmail = (email || '').toLowerCase().trim();
  const users = await firestore.queryCollection('users', u => u.email === normalizedEmail);

  if (users.length === 0) {
    return {
      message: `If an account with ${normalizedEmail} exists, password reset instructions have been generated.`
    };
  }

  const user = users[0];
  const resetToken = jwt.sign(
    { id: user.id, email: user.email, purpose: 'password_reset' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  console.log(`🔑 [Auth Reset] Generated password reset token for: ${normalizedEmail}`);

  return {
    message: 'Password reset token generated successfully.',
    email: normalizedEmail,
    resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined
  };
}

async function resetPassword(token, newPassword) {
  if (!token) {
    const error = new Error('Reset token is required.');
    error.code = 'TOKEN_MISSING';
    error.statusCode = 400;
    throw error;
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Error('Password reset token is invalid or has expired.');
    error.code = 'INVALID_RESET_TOKEN';
    error.statusCode = 400;
    throw error;
  }

  if (decoded.purpose !== 'password_reset') {
    const error = new Error('Invalid token purpose.');
    error.code = 'INVALID_TOKEN_PURPOSE';
    error.statusCode = 400;
    throw error;
  }

  const user = await firestore.getDocument('users', decoded.id);
  if (!user) {
    const error = new Error('User not found.');
    error.code = 'NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);
  await firestore.updateDocument('users', decoded.id, {
    password: hashedPassword,
    passwordResetAt: new Date().toISOString()
  });

  return {
    message: 'Password has been reset successfully. You can now login with your new password.'
  };
}

async function seedAdminUser() {
  try {
    const adminEmail = 'admin@hallkhoj.com';
    const users = await firestore.queryCollection('users', u => u.email === adminEmail);
    if (users.length === 0) {
      const hashedPassword = await hashPassword('AdminPass@123');
      const adminUser = {
        id: 'usr_admin_master',
        name: 'Platform Administrator',
        email: adminEmail,
        mobile: '9999999999',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      await firestore.setDocument('users', adminUser.id, adminUser);
      console.log('🛡️ [Auth] Master Admin seed user initialized: admin@hallkhoj.com');
    }
  } catch (err) {
    console.warn('Admin seed warning:', err.message);
  }
}

// Ensure seed admin user exists
seedAdminUser();

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  googleAuth,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  seedAdminUser
};
