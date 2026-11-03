/**
 * Hall Khoj Finder — Official Support & Bug Reporting Routes (Phase 22)
 * Handles:
 * - Direct Concierge Support Inquiries
 * - Comprehensive Bug Report Submissions with Attachments
 * - Anti-spam Honeypot Protection & Rate Limiting
 * - Official Contact Verification (+91 97736 47612)
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { successResponse, errorResponse } = require('../utils/response');
const { sensitiveEndpointLimiter } = require('../middleware/security.middleware');

// File upload configuration for bug screenshots/attachments (max 5MB)
const UPLOADS_DIR = path.join(__dirname, '../../frontend/assets/uploads/bug_reports');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = `bug_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
    cb(null, cleanName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid attachment format. Only JPG, PNG, WEBP, and PDF files under 5MB are permitted.'));
    }
  }
});

const DATA_DIR = path.join(__dirname, '../data');
const BUG_REPORTS_FILE = path.join(DATA_DIR, 'bug_reports.json');
const SUPPORT_TICKETS_FILE = path.join(DATA_DIR, 'support_tickets.json');

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) || [];
  } catch (e) {
    return [];
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing to', filePath, e.message);
  }
}

// 1. Official Support Info
router.get('/contact-info', (req, res) => {
  return successResponse(res, {
    supportPhone: '+91 97736 47612',
    supportPhoneFormatted: '+91 97736 47612',
    supportPhoneRaw: '+919773647612',
    supportEmail: 'support@hallkhoj.in',
    whatsappLink: 'https://wa.me/919773647612',
    operatingHours: '24/7 National Wedding & Event Concierge',
    headquarters: 'Lucknow, Uttar Pradesh, India'
  }, 'Support contact details retrieved successfully.');
});

// 2. Submit Bug Report (with Honeypot Anti-Spam & Validation)
router.post('/bug-report', sensitiveEndpointLimiter, (req, res) => {
  upload.single('attachment')(req, res, (err) => {
    if (err) {
      return errorResponse(res, err.message, 'ATTACHMENT_ERROR', 400);
    }

    const {
      fullName,
      email,
      phone,
      category,
      pageUrl,
      description,
      stepsToReproduce,
      _hp_check // Honeypot field (hidden from humans)
    } = req.body;

    // Honeypot check: If bot filled this hidden field, silently reject
    if (_hp_check && _hp_check.trim().length > 0) {
      return successResponse(res, { reportId: 'BUG-BOT-REJECTED' }, 'Report received.');
    }

    // Required Field Validations
    if (!fullName || fullName.trim().length < 2) {
      return errorResponse(res, 'Full name is required (minimum 2 characters).', 'VALIDATION_ERROR', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return errorResponse(res, 'A valid email address is required for follow-up.', 'VALIDATION_ERROR', 400);
    }

    if (phone && phone.trim().length > 0) {
      const cleanPhone = phone.replace(/[\s+-]/g, '');
      if (cleanPhone.length < 10) {
        return errorResponse(res, 'Please provide a valid 10-digit phone number or leave blank.', 'VALIDATION_ERROR', 400);
      }
    }

    if (!category || category.trim().length === 0) {
      return errorResponse(res, 'Please select an issue category.', 'VALIDATION_ERROR', 400);
    }

    if (!pageUrl || pageUrl.trim().length === 0) {
      return errorResponse(res, 'Please specify the page or feature where the bug occurred.', 'VALIDATION_ERROR', 400);
    }

    if (!description || description.trim().length < 10) {
      return errorResponse(res, 'Please describe the bug in at least 10 characters.', 'VALIDATION_ERROR', 400);
    }

    if (!stepsToReproduce || stepsToReproduce.trim().length < 5) {
      return errorResponse(res, 'Please provide brief steps to reproduce the issue.', 'VALIDATION_ERROR', 400);
    }

    // Generate Unique Report ID
    const reportId = `BUG-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const attachmentUrl = req.file ? `/assets/uploads/bug_reports/${req.file.filename}` : null;

    const bugReport = {
      id: reportId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      category: category.trim(),
      pageUrl: pageUrl.trim(),
      description: description.trim(),
      stepsToReproduce: stepsToReproduce.trim(),
      attachmentUrl,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown'
    };

    // Store securely in backend data store (never exposed publicly)
    const reports = readJsonFile(BUG_REPORTS_FILE);
    reports.push(bugReport);
    writeJsonFile(BUG_REPORTS_FILE, reports);

    console.log(`🐞 [Bug Report] New report registered: ${reportId} by ${email}`);

    return successResponse(res, {
      reportId,
      submittedAt: bugReport.createdAt,
      supportPhone: '+91 97736 47612',
      whatsappLink: 'https://wa.me/919773647612'
    }, 'Bug report submitted successfully! Our engineering team will review it.');
  });
});

// 3. Submit General Support Ticket
router.post('/ticket', sensitiveEndpointLimiter, (req, res) => {
  const { name, email, phone, subject, message, _hp_check } = req.body;

  if (_hp_check && _hp_check.trim().length > 0) {
    return successResponse(res, { ticketId: 'TKT-REJECTED' }, 'Support ticket received.');
  }

  if (!name || name.trim().length < 2) {
    return errorResponse(res, 'Full name is required.', 'VALIDATION_ERROR', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return errorResponse(res, 'Valid email address is required.', 'VALIDATION_ERROR', 400);
  }

  if (!message || message.trim().length < 10) {
    return errorResponse(res, 'Message must be at least 10 characters.', 'VALIDATION_ERROR', 400);
  }

  const ticketId = `TKT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const ticket = {
    id: ticketId,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : null,
    subject: subject ? subject.trim() : 'General Inquiry',
    message: message.trim(),
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };

  const tickets = readJsonFile(SUPPORT_TICKETS_FILE);
  tickets.push(ticket);
  writeJsonFile(SUPPORT_TICKETS_FILE, tickets);

  return successResponse(res, { ticketId, submittedAt: ticket.createdAt }, 'Support inquiry received. A concierge agent will respond within 4 business hours.');
});

module.exports = router;
