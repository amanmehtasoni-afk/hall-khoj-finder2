/**
 * Hall Khoj Finder — Formal Academic Project Synopsis PDF Generator
 * Designed specifically for College / University Submission & Viva Examination.
 * Includes academic cover page, 21 structured chapters, technical tables, and Viva cheat sheet.
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join(__dirname, '../../frontend/assets/Hall_Khoj_Academic_Project_Synopsis.pdf');
const logoPath = path.join(__dirname, '../../frontend/assets/logo.png');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const doc = new PDFDocument({
  autoFirstPage: false,
  size: 'A4',
  bufferPages: true,
  margins: { top: 40, bottom: 45, left: 45, right: 45 },
  info: {
    Title: 'Hall Khoj Finder — Academic Project Synopsis & Viva Technical Specification',
    Author: 'Department of Computer Science & Engineering',
    Subject: 'Final Year Major Project Synopsis Document',
    Keywords: 'Academic Project Synopsis, Hall Khoj, Computer Science, MongoDB, Node.js, Three.js, Viva Reference'
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Academic Styling Palette
const NAVY = '#0F172A';
const GOLD = '#B45309';
const DARK = '#1E293B';
const MUTED = '#475569';
const BORDER = '#CBD5E1';
const LIGHT_BG = '#F8FAFC';
const BLUE = '#1D4ED8';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 45;
const CONTENT_W = PAGE_W - (MARGIN * 2); // 505.28

function addPage() {
  doc.addPage({
    size: 'A4',
    margins: { top: 45, bottom: 45, left: 45, right: 45 }
  });
}

function drawSectionHeading(num, title) {
  doc.moveDown(0.8);
  const text = num ? `${num}. ${title.toUpperCase()}` : title.toUpperCase();
  doc.fontSize(12).fillColor(NAVY).font('Helvetica-Bold').text(text, { underline: false });
  doc.moveTo(MARGIN, doc.y + 2).lineTo(PAGE_W - MARGIN, doc.y + 2).strokeColor(GOLD).lineWidth(1.2).stroke();
  doc.moveDown(0.6);
}

function drawSubHeading(title) {
  doc.moveDown(0.4);
  doc.fontSize(10).fillColor(GOLD).font('Helvetica-Bold').text(title);
  doc.moveDown(0.3);
}

function drawParagraph(text, align = 'justify') {
  doc.fontSize(8.5).fillColor(DARK).font('Helvetica').lineGap(2.5).text(text, {
    width: CONTENT_W,
    align: align
  });
  doc.moveDown(0.4);
}

function drawBullet(boldPrefix, text) {
  const currentY = doc.y;
  doc.fontSize(8.5).fillColor(GOLD).font('Helvetica-Bold').text('• ', MARGIN + 5, currentY, { continued: true });
  if (boldPrefix) {
    doc.fillColor(NAVY).font('Helvetica-Bold').text(`${boldPrefix} `, { continued: true });
  }
  doc.fillColor(DARK).font('Helvetica').lineGap(2).text(text, { width: CONTENT_W - 20, align: 'justify' });
  doc.moveDown(0.2);
}

function drawTable(headers, rows, colWidths) {
  doc.moveDown(0.4);
  const startX = MARGIN;
  let startY = doc.y;

  // Header Row
  doc.rect(startX, startY, CONTENT_W, 20).fillAndStroke(NAVY, NAVY);
  let curX = startX;
  headers.forEach((h, i) => {
    doc.fontSize(8).fillColor('#FFFFFF').font('Helvetica-Bold').text(h, curX + 5, startY + 5, {
      width: colWidths[i] - 10,
      align: 'left'
    });
    curX += colWidths[i];
  });
  startY += 20;

  // Data Rows
  rows.forEach((row, rIdx) => {
    const rowBg = rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
    
    // Estimate row height
    let maxLines = 1;
    row.forEach((cell, i) => {
      const cellLines = Math.ceil(doc.widthOfString(cell, { fontSize: 7.5 }) / (colWidths[i] - 10));
      if (cellLines > maxLines) maxLines = cellLines;
    });
    const rowHeight = Math.max(20, maxLines * 11 + 8);

    // Page break protection
    if (startY + rowHeight > PAGE_H - 55) {
      addPage();
      startY = MARGIN + 10;
    }

    doc.rect(startX, startY, CONTENT_W, rowHeight).fillAndStroke(rowBg, BORDER);
    curX = startX;
    row.forEach((cell, i) => {
      doc.fontSize(7.5).fillColor(DARK).font('Helvetica').text(cell, curX + 5, startY + 5, {
        width: colWidths[i] - 10,
        align: 'left'
      });
      curX += colWidths[i];
    });
    startY += rowHeight;
  });

  doc.y = startY + 8;
}

// ==========================================
// PAGE 1: FORMAL ACADEMIC COVER PAGE
// ==========================================
addPage();

// Outer Academic Double Border
doc.rect(25, 25, PAGE_W - 50, PAGE_H - 50).strokeColor(NAVY).lineWidth(2).stroke();
doc.rect(28, 28, PAGE_W - 56, PAGE_H - 56).strokeColor(GOLD).lineWidth(0.8).stroke();

// Header Titles
doc.fontSize(10.5).fillColor(MUTED).font('Helvetica-Bold').text('PROJECT SYNOPSIS & TECHNICAL SPECIFICATION', 0, 60, { align: 'center' });
doc.fontSize(9).fillColor(GOLD).font('Helvetica').text('A DISSERTATION REPORT SUBMITTED IN PARTIAL FULFILLMENT OF DEGREE REQUIREMENTS', 0, 78, { align: 'center' });

// Academic Logo
if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, (PAGE_W - 80) / 2, 115, { width: 80 });
  } catch (e) {}
}

doc.fontSize(18).fillColor(NAVY).font('Helvetica-Bold').text('HALL KHOJ FINDER', 0, 215, { align: 'center' });
doc.fontSize(10.5).fillColor(GOLD).font('Helvetica-Bold').text('A MOBILE-FIRST MULTI-VENDOR EVENT VENUE & SERVICES MARKETPLACE WITH 3D SPATIAL VIRTUAL TOURS', 60, 240, { align: 'center', width: PAGE_W - 120 });

doc.moveTo(100, 280).lineTo(PAGE_W - 100, 280).strokeColor(BORDER).lineWidth(1).stroke();

// Project Details Block
doc.rect(60, 305, PAGE_W - 120, 160).fillAndStroke(LIGHT_BG, BORDER);
doc.fontSize(9.5).fillColor(NAVY).font('Helvetica-Bold').text('ACADEMIC CURRICULUM METADATA', 75, 320);

doc.fontSize(8.5).fillColor(MUTED).font('Helvetica');
doc.text('Course / Degree:', 75, 345);
doc.font('Helvetica-Bold').fillColor(DARK).text('Bachelor of Technology (B.Tech) / BCA / MCA', 200, 345);

doc.font('Helvetica').fillColor(MUTED).text('Department:', 75, 365);
doc.font('Helvetica-Bold').fillColor(DARK).text('Department of Computer Science & Engineering', 200, 365);

doc.font('Helvetica').fillColor(MUTED).text('Domain Specialization:', 75, 385);
doc.font('Helvetica-Bold').fillColor(DARK).text('Full-Stack Web Development, 3D Computer Graphics & Cloud DB', 200, 385);

doc.font('Helvetica').fillColor(MUTED).text('Academic Session:', 75, 405);
doc.font('Helvetica-Bold').fillColor(DARK).text('2025 - 2026', 200, 405);

doc.font('Helvetica').fillColor(MUTED).text('Live Demonstration URL:', 75, 425);
doc.font('Helvetica-Bold').fillColor(BLUE).text('https://hallkhoj.com  •  Port: 3000', 200, 425);

doc.font('Helvetica').fillColor(MUTED).text('Database & Storage:', 75, 445);
doc.font('Helvetica-Bold').fillColor(DARK).text('MongoDB Atlas + Atomic JSON Failover Storage', 200, 445);

// Candidate & Supervisor Sign-off Blocks
const boxW = (PAGE_W - 140) / 2;
// Left Box: Submitted By
doc.rect(60, 500, boxW, 140).fillAndStroke('#FFFFFF', BORDER);
doc.fontSize(8.5).fillColor(GOLD).font('Helvetica-Bold').text('SUBMITTED BY:', 75, 515);
doc.fontSize(9).fillColor(NAVY).font('Helvetica-Bold').text('Project Development Team', 75, 532);
doc.fontSize(8).fillColor(MUTED).font('Helvetica');
doc.text('Hall Khoj Project Group', 75, 550);
doc.text('Reg No: [University Roll No]', 75, 565);
doc.text('Final Year Major Project', 75, 580);
doc.fontSize(7.5).fillColor(DARK).font('Helvetica-Bold').text('Candidate Signature: _________________', 75, 615);

// Right Box: Under the Guidance of
doc.rect(PAGE_W - 60 - boxW, 500, boxW, 140).fillAndStroke('#FFFFFF', BORDER);
doc.fontSize(8.5).fillColor(GOLD).font('Helvetica-Bold').text('UNDER THE GUIDANCE OF:', PAGE_W - 60 - boxW + 15, 515);
doc.fontSize(9).fillColor(NAVY).font('Helvetica-Bold').text('Project Guide & Faculty', PAGE_W - 60 - boxW + 15, 532);
doc.fontSize(8).fillColor(MUTED).font('Helvetica');
doc.text('Assistant Professor / HOD', PAGE_W - 60 - boxW + 15, 550);
doc.text('Dept. of Computer Science & Engg.', PAGE_W - 60 - boxW + 15, 565);
doc.text('College / Institute of Engineering', PAGE_W - 60 - boxW + 15, 580);
doc.fontSize(7.5).fillColor(DARK).font('Helvetica-Bold').text('Faculty Signature: ___________________', PAGE_W - 60 - boxW + 15, 615);

// Bottom Institute Notice
doc.fontSize(8).fillColor(MUTED).font('Helvetica').text('AFFILIATED TO STATE TECHNOLOGICAL UNIVERSITY / NAAC ACCREDITED INSTITUTION', 0, 765, { align: 'center' });

// ==========================================
// PAGE 2: TABLE OF CONTENTS & INTRODUCTION
// ==========================================
addPage();
drawSectionHeading(null, 'TABLE OF CONTENTS & CHAPTER OUTLINE');

const tocData = [
  ['1', 'Project Title & Abstract', 'Page 01 - 02'],
  ['2', 'Introduction & Industrial Context', 'Page 02'],
  ['3', 'Project Overview & Stakeholders', 'Page 03'],
  ['4', 'Problem Statement & Current Market Challenges', 'Page 03'],
  ['5', 'Purpose of the Project', 'Page 04'],
  ['6', 'Aims and Primary Objectives', 'Page 04'],
  ['7', 'Scope of the Project (In-Scope vs Out-of-Scope)', 'Page 04 - 05'],
  ['8', 'Existing System vs Proposed System Comparison', 'Page 05'],
  ['9', 'Technologies Used & Architecture Stack', 'Page 05 - 06'],
  ['10', 'Hardware & Software System Requirements', 'Page 06'],
  ['11', 'Modules of the Project (Customer, Owner, Admin)', 'Page 07'],
  ['12', 'The 11 Supported Business Categories Deep-Dive', 'Page 07 - 08'],
  ['13', 'Database Description, Mongoose Schemas & Indexing', 'Page 08 - 09'],
  ['14', 'Frontend & Backend System Architecture', 'Page 09 - 10'],
  ['15', 'System Workflow & Sequence Lifecycle', 'Page 10'],
  ['16', 'Security Hardening, Privacy & Cryptographic Verification', 'Page 10 - 11'],
  ['17', 'Advantages of the Proposed System', 'Page 11'],
  ['18', 'System Limitations & Practical Constraints', 'Page 11'],
  ['19', 'Future Scope & Technological Enhancements', 'Page 11 - 12'],
  ['20', 'Conclusion', 'Page 12'],
  ['21', 'Viva-Voce Quick-Reference Summary Sheet', 'Page 12']
];

drawTable(['CH #', 'CHAPTER / TOPIC TITLE', 'PAGE REFERENCE'], tocData, [45, 360, 100]);

drawSectionHeading(2, 'Introduction');
drawParagraph(
  'In India, organizing weddings, receptions, social celebrations, and corporate events is a major milestone involving substantial financial investment. The Indian wedding and event industry is estimated to exceed INR 4,00,000+ Crore ($50 Billion USD) annually. Despite its immense size, the sector remains largely unorganized, fragmented, and dominated by offline brokers and word-of-mouth recommendations.'
);
drawParagraph(
  'Hall Khoj Finder is an enterprise-grade, full-stack web application designed to digitize and democratize the event venue and allied services ecosystem across India. The platform provides end-to-end event planning solutions—enabling users to discover verified venues, inspect hall dimensions via interactive 3D WebGL virtual tours, verify real-time calendar availability, and secure advance bookings through transparent payment processing.'
);

// ==========================================
// PAGE 3: PROJECT OVERVIEW & PROBLEM STATEMENT
// ==========================================
addPage();
drawSectionHeading(3, 'Project Overview');
drawParagraph(
  'Hall Khoj Finder operates as a multi-sided digital marketplace connecting three distinct stakeholders:'
);
drawBullet('1. Event Seekers (Customers):', 'Individuals and families searching for marriage halls, banquet halls, open lawns, catering, and event vendors with complete price and spatial transparency.');
drawBullet('2. Venue Owners & Event Vendors:', 'Business operators seeking digital visibility, automated calendar management to avoid double-bookings, and verified partner credibility.');
drawBullet('3. Platform Administrators (Superadmin):', 'Regulators overseeing platform health, vendor KYC verifications, financial settlements, and content moderation.');
drawParagraph(
  'The application is built on a Mobile-First architectural philosophy, specifically tailored for the Indian demographic where over 85% of internet traffic originates from smartphones. It eliminates common digital onboarding friction by utilizing mobile phone numbers (+91) as primary identifiers instead of mandatory email addresses for customers, while enforcing strict email and document verification for commercial venue owners.'
);

drawSectionHeading(4, 'Problem Statement');
drawParagraph('The traditional venue booking and event planning ecosystem in India suffers from severe structural bottlenecks:');
drawBullet('Problem 1 (Opaque Pricing):', 'Customers routinely pay 10% to 20% inflated pricing because local unverified agents and brokers gatekeep contact details.');
drawBullet('Problem 2 (High Digital Friction):', 'Mainstream western event portals enforce strict email-based signups. In Indian regional markets, forcing email verification leads to over 65% drop-off during onboarding.');
drawBullet('Problem 3 (Misleading Imagery):', 'Two-dimensional, heavily filtered photos uploaded to social media do not reveal pillar obstructions, ceiling heights, stage elevations, or dining partitions, causing disappointment on the event day.');
drawBullet('Problem 4 (Catastrophic Double-Booking):', 'Venue owners relying on traditional paper diaries and verbal promises frequently double-book venues during peak auspicious wedding dates (Muhurat).');
drawBullet('Problem 5 (Fragmented Allied Services):', 'Finding a venue is only one part of the event; hiring reliable caterers, tent houses, photographers, and decorators requires separate, uncoordinated negotiation.');

// ==========================================
// PAGE 4: PURPOSE, OBJECTIVES & SCOPE
// ==========================================
addPage();
drawSectionHeading(5, 'Purpose of the Project');
drawParagraph('The primary purpose of Hall Khoj Finder is to build a trusted, transparent, and technology-driven marketplace that:');
drawBullet('Direct Connection:', 'Eliminates unauthorized middlemen and connects consumers directly with venue owners.');
drawBullet('Spatial Clarity:', 'Delivers complete spatial and visual clarity through browser-based 3D virtual walkthroughs before physical site visits.');
drawBullet('Zero Double-Booking:', 'Guarantees zero double-booking through synchronized real-time availability calendars.');
drawBullet('Zero-Friction Access:', 'Minimizes user onboarding friction by replacing email dependencies with high-trust mobile phone authentication for consumers.');
drawBullet('Vendor Storefronts:', 'Equips venue owners and micro-entrepreneurs across 11 service categories with professional digital storefronts.');

drawSectionHeading(6, 'Objectives');
drawBullet('Zero-Friction Authentication:', 'Implement a mobile phone-first authentication system for customers and a KYC-verified onboarding pipeline for venue owners.');
drawBullet('Interactive 3D Virtual Tour:', 'Implement GPU-accelerated 3D WebGL rendering using Three.js to provide panoramic spatial visualization of banquet layouts.');
drawBullet('Geospatial Proximity Discovery:', 'Integrate interactive mapping (Leaflet.js / OpenStreetMap) to allow users to discover venues within defined distance radii.');
drawBullet('Automated Availability & Booking Engine:', 'Provide real-time date availability checking with one-click date blockers for venue owners to prevent schedule clashes.');
drawBullet('Multi-Category Breadth:', 'Support 11 distinct event domains ranging from Marriage Halls and Resorts to Catering, Photography, and Decorators.');
drawBullet('Dynamic Invoicing Pipeline:', 'Automatically generate official PDF invoices and booking receipts on the server using vector graphics engines.');
drawBullet('High-Performance Architecture:', 'Maintain sub-600ms load times and high Lighthouse performance on mobile devices over 3G/4G networks.');

drawSectionHeading(7, 'Scope of the Project');
drawSubHeading('A. In-Scope (Implemented & Fully Operational)');
drawBullet('Responsive Web App:', 'Mobile-first PWA-ready responsive web application.');
drawBullet('Dual Auth Engine:', 'Mobile phone for customers; Business email & password for venue owners.');
drawBullet('11 Categories:', 'Full-spectrum catalog support across 11 verified business categories.');
drawBullet('3D Walkthrough:', 'Interactive 3D WebGL venue walkthrough viewer powered by Three.js.');
drawBullet('GPS Discovery:', 'Leaflet GPS venue discovery with geolocation radius filtering.');
drawBullet('Real-Time Calendar:', 'Date availability checker and owner offline date-blocker tool.');
drawBullet('Payment Checkout:', 'Advance token calculation and Razorpay payment gateway integration.');
drawBullet('Server-Side PDF:', 'Automated server-side PDF booking receipt generation using PDFKit.');
drawBullet('Dual Database:', 'MongoDB Atlas Cloud + Local Resilient JSON cache failover.');

drawSubHeading('B. Out-of-Scope (Future Enhancements)');
drawBullet('Native App Store Packages:', 'Dedicated iOS and Android binaries (currently operates via mobile web).');
drawBullet('Multi-Stage Escrow Automated Payouts:', 'Instant bank virtual account disbursements (currently advance token verification).');

// ==========================================
// PAGE 5: EXISTING VS PROPOSED & TECHNOLOGIES
// ==========================================
addPage();
drawSectionHeading(8, 'Existing System vs. Proposed System');

const compData = [
  ['Primary Identifier', 'Email address mandatory (Causes high drop-off)', 'Mobile Phone (+91) with instant login'],
  ['Pricing Transparency', 'Hidden; negotiable via middlemen brokers', 'Clear per-plate (Veg/Non-Veg) & rental rates'],
  ['Venue Visualization', 'Static, misleading, heavily edited 2D photos', 'Interactive 3D WebGL walkthrough + High-res gallery'],
  ['Availability Check', 'Manual phone calls or physical diary check', 'Live real-time green/red calendar with 1-click blocker'],
  ['Middleman Commission', '10% - 20% unorganized broker cuts', 'Direct customer-to-vendor connection (0% broker cut)'],
  ['Vendor Credibility', 'Unverified word-of-mouth claims', 'Shield Verified Partner badge with GST/PAN KYC'],
  ['Receipt / Invoicing', 'Handwritten paper slips or verbal agreements', 'Instant server-generated PDF booking invoice'],
  ['Device Optimization', 'Heavy desktop-oriented web frameworks', 'Lightweight Vanilla JS/CSS (<180 KB page weight)']
];

drawTable(['PARAMETER', 'EXISTING TRADITIONAL SYSTEM', 'PROPOSED (HALL KHOJ FINDER)'], compData, [120, 185, 200]);

drawSectionHeading(9, 'Technologies Used & Architecture Stack');

const techData = [
  ['Programming Language', 'JavaScript (ES6+ / Node.js v24.x)', 'Full-stack language for frontend and backend logic.'],
  ['Frontend Core', 'HTML5, Vanilla CSS3, Modern ES6+', 'Semantic structure, custom design system, fast DOM.'],
  ['3D Graphics Engine', 'Three.js (WebGL r128 CDN)', 'GPU-accelerated 3D panoramic virtual hall tour.'],
  ['Mapping Engine', 'Leaflet.js (v1.9.4 CDN)', 'Vector map pins, proximity radius, OpenStreetMap.'],
  ['Backend Framework', 'Express.js (^5.2.1)', 'Asynchronous RESTful API server and routing engine.'],
  ['Database (Primary)', 'MongoDB & Mongoose (^9.10.2)', 'Document database for entity schemas and geo-queries.'],
  ['Database (Fallback)', 'Atomic JSON File Store (Native fs)', 'Local storage engine for zero-downtime failover.'],
  ['Authentication', 'JSON Web Token (JWT ^9.0.3)', 'Stateless HS256-signed Bearer tokens for API auth.'],
  ['Password Encryption', 'Bcryptjs (^3.0.3)', '10-round salted Blowfish cryptographic password hashing.'],
  ['File Upload Engine', 'Multer (^2.4.0)', 'Multipart form-data parser for cover and gallery photos.'],
  ['PDF Generator', 'PDFKit (^0.20.2)', 'Programmatic vector PDF generator for receipts & synopsis.'],
  ['Payment Gateway', 'Razorpay / Cashfree REST SDK', 'UPI, Net Banking, and Card checkout with HMAC-SHA256.'],
  ['AI Matchmaker', 'Google Gemini AI REST API', 'Natural language event query parsing & recommendations.']
];

drawTable(['TECHNOLOGY LAYER', 'LIBRARY / VERSION', 'PURPOSE IN PROJECT'], techData, [110, 150, 245]);

// ==========================================
// PAGE 6: HARDWARE & SOFTWARE REQUIREMENTS
// ==========================================
addPage();
drawSectionHeading(10, 'System Requirements');

drawSubHeading('A. Hardware Requirements');
const hwData = [
  ['Processor', 'Dual-Core 1.5 GHz (Mobile or PC)', 'Quad-Core 2.4 GHz (x86_64 / ARM64 Cloud CPU)'],
  ['System RAM', '2 GB RAM (Capable of WebGL execution)', '4 GB to 8 GB DDR4 RAM'],
  ['Hard Disk Space', '100 MB free space (Browser cache)', '20 GB SSD Cloud Storage'],
  ['Display Resolution', '360 x 640 px (Smartphone viewports)', '1920 x 1080 px (Superadmin Workstations)'],
  ['Network Bandwidth', '3G / 4G / Wi-Fi (Minimum 512 Kbps)', 'High-speed Cloud connection (1 Gbps uplink)']
];
drawTable(['COMPONENT', 'MINIMUM CLIENT REQUIREMENTS', 'RECOMMENDED SERVER SPECIFICATIONS'], hwData, [120, 185, 200]);

drawSubHeading('B. Software Requirements');
const swData = [
  ['Operating System (Development)', 'Windows 10/11, macOS Sequoia, or Linux Ubuntu 22.04 LTS'],
  ['Backend Runtime Environment', 'Node.js (v18.x to v24.x LTS) with npm package manager'],
  ['Database Server', 'MongoDB Community Server (v6.0+) or MongoDB Atlas Cloud Cluster'],
  ['Supported Web Browsers', 'Google Chrome (v90+), Mozilla Firefox, Apple Safari, Microsoft Edge'],
  ['API Architecture & Standards', 'RESTful JSON over HTTP/1.1 and secure HTTPS (TLS 1.3 encryption)']
];
drawTable(['SOFTWARE COMPONENT', 'SPECIFICATION / REQUIREMENT'], swData, [165, 340]);

drawSubHeading('C. Architecture Justification for Viva');
drawParagraph(
  'Viva Note: Unlike standard academic projects that rely on heavy frontend frameworks like React or Angular, Hall Khoj Finder intentionally uses pure Vanilla JavaScript and custom CSS custom properties (variables) paired with Three.js WebGL. This reduces the base page payload to under 180 KB, enabling sub-600ms load times on Indian mobile 3G/4G networks where heavy single-page application (SPA) bundles cause severe latency. Furthermore, the backend implements an autonomous dual-engine failover mechanism between MongoDB Atlas and a local atomic JSON store to prevent system halting during network outages.'
);

// ==========================================
// PAGE 7: MODULES OF THE PROJECT
// ==========================================
addPage();
drawSectionHeading(11, 'Modules of the Project');

drawSubHeading('Module 1: Customer Discovery & Booking Portal');
drawBullet('Mobile-First Phone Auth:', 'Users authenticate directly through their 10-digit Indian mobile number (+91) and instant OTP verification without entering an email address.');
drawBullet('Geospatial Proximity Discovery:', 'Users locate nearby marriage halls, lawns, and banquet venues filtered by city, pincode, and distance radius via Leaflet map integration.');
drawBullet('3D Spatial Virtual Tour:', 'Users can pan, rotate, and navigate inside a 3D simulated banquet hall to inspect stage dimensions, lighting fixtures, and seating arrangements using Three.js.');
drawBullet('Lightbox Photo Gallery:', 'High-resolution multi-image viewer with thumbnail navigation and full-screen preview.');
drawBullet('Real-Time Calendar Availability:', 'Immediate visual status of dates: Green indicates available dates, while Red indicates dates already reserved or blocked.');
drawBullet('Advance Token Payment:', 'Calculation of advance booking token (typically 10%–20%) with direct payment checkout and server-generated PDF confirmation.');

drawSubHeading('Module 2: Venue Owner & Vendor Management Suite');
drawBullet('Multi-Category Onboarding:', 'Venue owners register under one of 11 distinct event categories with domain-specific input fields.');
drawBullet('Dynamic Profile & Pricing:', 'Owners update per-plate vegetarian/non-vegetarian rates, full-day lawn rental fees, seating capacities, and included amenities.');
drawBullet('Multi-Photo Gallery Manager:', 'Powered by Multer, owners can upload and organize primary cover thumbnails and multiple interior/exterior gallery photos.');
drawBullet('Offline Date Blocker Engine:', 'Venue owners can block specific calendar dates booked through offline channels in one click, preventing double-bookings.');
drawBullet('Business Email Verification:', 'Owners submit corporate emails and GST/PAN numbers to obtain the trusted "Shield Verified Partner" badge.');

drawSubHeading('Module 3: Superadmin Master Control Center');
drawBullet('Executive KPI Dashboard:', 'Real-time metrics tracking Gross Booking Volume (GBV), total registered venues, active users, and platform revenue.');
drawBullet('Vendor KYC Document Audit:', 'Administrators inspect uploaded business certificates and verify or suspend vendor accounts.');
drawBullet('Commission Settlement Engine:', 'Configures platform service commission rates (ranging from 3% to 10%) on advance booking transactions.');
drawBullet('Review Moderation:', 'Tools to audit customer ratings and filter out inappropriate or fraudulent reviews.');
drawBullet('System Telemetry & Audit Logs:', 'Live monitoring of database connection state, API response latencies, and critical system events.');

// ==========================================
// PAGE 8: THE 11 BUSINESS CATEGORIES
// ==========================================
addPage();
drawSectionHeading(12, 'The 11 Supported Business Categories Deep-Dive');

const catTable = [
  ['1', 'Marriage Hall / Venue', 'Traditional weddings, mandap rituals, baraat receptions.', 'Full Day Rental + Plate Charges'],
  ['2', 'Banquet Hall', 'Engagements, sangeet, corporate seminars, parties.', 'Time Slot / Per Plate'],
  ['3', 'Marriage Garden / Lawn', 'Large outdoor weddings (1,000–5,000+ guests), tenting.', 'Lawn Rental per Event Day'],
  ['4', 'Party Hall', 'Birthdays, anniversaries, kitty parties, reunions.', 'Hourly Package / Minimum Cover'],
  ['5', 'Event Venue', 'Trade exhibitions, cultural conventions, public expos.', 'Daily Commercial Lease'],
  ['6', 'Hotel & Resort', 'Destination weddings, residential stays, pool lawns.', 'Room Inventory + Venue Package'],
  ['7', 'Restaurant & Dining', 'Family get-togethers, roka ceremonies, business dinners.', 'Per-Head Buffet / Set Menu'],
  ['8', 'Catering Service', 'Live food counters (North/South Indian, Chinese).', 'Per Plate (Veg & Non-Veg Matrix)'],
  ['9', 'Decoration & Planner', 'Stage floral styling, LED entrance arches, haldi themes.', 'Theme Package + Custom Add-ons'],
  ['10', 'Photography / Film', 'Cinematic 4K films, pre-wedding shoots, drone captures.', 'Per Event Day / Full Package'],
  ['11', 'Other Event Businesses', 'DJ sound systems, vintage bridal cars, dhol tasha.', 'Fixed Service Token Booking']
];

drawTable(['#', 'CATEGORY NAME', 'EVENT SCOPE & APPLICATION', 'PRIMARY PRICING MODEL'], catTable, [25, 125, 215, 140]);

drawSectionHeading(13, 'Database Description & Mongoose Schemas');
drawParagraph('The platform utilizes MongoDB Atlas with Mongoose ODM (v9.10.2) paired with a resilient atomic JSON storage failover engine in backend/data/. Below are the primary collections:');

const colTable = [
  ['users', 'Customer accounts & authentication', 'id, name, mobile (Unique), role, isVerified, savedHalls'],
  ['owners', 'Vendor commercial profiles & KYC', 'id, userId, businessName, businessCategory, email, gstNumber'],
  ['halls', 'Venues, pricing, capacity, media', 'id, ownerId, name, startingPrice, capacityMax, coverImg, images, blockedDates'],
  ['bookings', 'Reservations & payment status', 'id, bookingCode, customerId, serviceId, eventDate, advanceAmount, status'],
  ['reviews', 'Customer star ratings & feedback', 'id, bookingId, serviceId, customerId, rating (1-5), comment, photos'],
  ['transactions', 'Razorpay payment verification', 'id, bookingId, customerId, amount, razorpayPaymentId, razorpayOrderId'],
  ['categories', '11 Supported event categories', 'id, slug (Unique), name, icon, description, count']
];
drawTable(['COLLECTION', 'FUNCTIONAL PURPOSE', 'IMPORTANT FIELDS'], colTable, [80, 185, 240]);

// ==========================================
// PAGE 9: ARCHITECTURE & SYSTEM DESIGN
// ==========================================
addPage();
drawSectionHeading(14, 'Frontend & Backend System Architecture');

drawSubHeading('A. Frontend System Architecture');
drawBullet('Rendering Engine:', 'Semantic HTML5 structure coupled with component-driven Vanilla CSS and modular ES6 JavaScript.');
drawBullet('Virtual Walkthrough Subsystem:', 'Three.js renders a 3D procedural banquet hall utilizing standard PerspectiveCamera, WebGLRenderer, directional lighting, and touch/mouse orbit controls.');
drawBullet('Session State:', 'Client sessions are maintained via JWT tokens stored in localStorage, accompanied by HTTP request interceptors for Authorization Bearer headers.');
drawBullet('Responsive Grid:', 'CSS Grid and Flexbox with responsive breakpoints ensuring smooth rendering across screens from 320px smartphones to 4K displays.');

drawSubHeading('B. Backend System Architecture');
drawBullet('Routing Pipeline:', 'Modular Express router controllers mounted under /api/* endpoints with dedicated middleware chains.');
drawBullet('Security Middleware:', 'Deep request payload sanitization (sanitizeInput), Cross-Origin Resource Sharing (cors), and rate limiters.');
drawBullet('Media Ingestion:', 'Multer disk storage pipeline validates file MIME types (JPEG, PNG, WebP) and persists images to frontend/assets/uploads/.');
drawBullet('Dynamic PDF Pipeline:', 'Server-side PDFKit stream engine programmatically renders multi-page vector invoices with exact bounding box constraints.');
drawBullet('Failover Persistence:', 'Database connectors check live MongoDB connectivity; if disconnected, calls gracefully redirect to localized atomic JSON stores without crashing.');

drawSectionHeading(15, 'System Workflow & Lifecycle');
drawParagraph('The complete operational sequence follows 7 well-defined transitions:');
drawBullet('Step 1 (Discover Venue):', 'Customer enters City/Category and filters listings by plate budget and capacity.');
drawBullet('Step 2 (Inspect Venue):', 'Customer launches Three.js 3D Virtual Tour and browses high-res multi-image gallery.');
drawBullet('Step 3 (Check Availability):', 'System queries database blockedDates array; displays Green (Available) or Red (Blocked).');
drawBullet('Step 4 (Frictionless Auth):', 'Customer enters 10-digit mobile number (+91); receives instant 6-digit SMS OTP.');
drawBullet('Step 5 (Advance Payment):', 'Razorpay UPI checkout initialized; server verifies HMAC-SHA256 signature.');
drawBullet('Step 6 (Confirm Booking):', 'Booking record created; calendar date automatically locked to prevent schedule clashes.');
drawBullet('Step 7 (Invoice & Alert):', 'PDFKit generates vector digital receipt; SMS alert dispatched to venue owner.');

// ==========================================
// PAGE 10: SECURITY, ADVANTAGES & LIMITATIONS
// ==========================================
addPage();
drawSectionHeading(16, 'Security Hardening & Data Privacy');
drawBullet('Stateless JWT Auth:', 'API endpoints verify incoming Authorization: Bearer <token> headers signed using strong 64-character server secrets.');
drawBullet('Bcrypt Cryptographic Hashing:', 'Vendor and administrative passwords undergo 10 rounds of salted Blowfish encryption via bcryptjs. No plain-text passwords ever exist in memory or database records.');
drawBullet('NoSQL & XSS Sanitization:', 'Custom recursive sanitization middleware strips hazardous operators ($gt, $where, $regex) and escapes HTML entities from incoming payloads.');
drawBullet('HMAC-SHA256 Webhook Verification:', 'Razorpay payment callbacks mathematically verify cryptographic signatures before confirming any booking.');
drawBullet('Rate Limiting Shield:', 'Sensitive endpoints (OTP generation and login attempts) enforce strict IP-based rate limiting to prevent brute-force attacks and SMS quota depletion.');
drawBullet('Enterprise Security Headers:', 'Implements standard security headers including X-Content-Type-Options: nosniff and X-Frame-Options: SAMEORIGIN.');

drawSectionHeading(17, 'Advantages of the Proposed System');
drawBullet('Tailored for India:', 'Pure mobile-phone authentication removes email friction and drives conversion rates.');
drawBullet('Substantial Cost Savings:', 'Eliminates 10%–20% broker commission fees by fostering direct customer-to-vendor transactions.');
drawBullet('Zero Scheduling Clashes:', 'The synchronized real-time availability calendar prevents double-bookings.');
drawBullet('Informed Customer Decisions:', '3D virtual walkthroughs enable families to inspect hall setups without spending hours traveling to physical sites.');
drawBullet('High Operational Speed:', 'Vanilla JS frontend delivers high performance, low data consumption, and fast load times on mobile devices.');
drawBullet('Fault-Tolerant Persistence:', 'Dual-engine architecture guarantees zero downtime even if remote cloud database links experience latency.');

drawSectionHeading(18, 'System Limitations');
drawBullet('3D Model Procedural Nature:', 'The current 3D WebGL viewer renders standardized interactive architectural floor templates rather than photogrammetric real-world 3D scans of every individual hall.');
drawBullet('SMS Gateway Dependency:', 'SMS OTP delivery requires an active paid SMS gateway subscription (e.g., Twilio/Fast2SMS) in production environments; in local development, it operates in simulated console mode.');
drawBullet('Offline Balance Settlement:', 'While advance token reservation is handled digitally via Razorpay UPI, remaining event balances are settled directly between owner and customer on-site.');

// ==========================================
// PAGE 11: FUTURE SCOPE, CONCLUSION & VIVA SHEET
// ==========================================
addPage();
drawSectionHeading(19, 'Future Scope & Technological Enhancements');
drawBullet('Photogrammetric Drone Scans:', 'Transitioning from procedural 3D models to real drone-scanned 3D point-cloud environments of actual marriage gardens.');
drawBullet('Cross-Platform Mobile Apps:', 'Packaging the mobile web architecture into native Android and iOS applications using Flutter or React Native.');
drawBullet('AI Event Budget Planner:', 'Integrating Google Gemini AI to automatically generate itemized event budget estimates and vendor bundles based on guest count.');
drawBullet('Full Escrow Milestone Payments:', 'Introducing a multi-stage digital escrow payment system where funds are released to vendors upon milestone completions (e.g., Stage Setup Complete, Dinner Commenced).');

drawSectionHeading(20, 'Conclusion');
drawParagraph(
  'Hall Khoj Finder provides a practical, full-stack engineering solution to address the longstanding inefficiencies of the Indian event venue booking market. By thoughtfully combining a mobile-first customer journey (phone-only authentication) with advanced technical capabilities like Three.js 3D WebGL spatial exploration, real-time calendar synchronization, automated PDF generation, and a fault-tolerant dual-database architecture, the project establishes a robust, highly scalable, and user-centric platform. The implementation strictly adheres to modern web engineering principles and is fully prepared for academic project evaluation and real-world commercial deployment.'
);

drawSectionHeading(21, 'Project Summary (Viva Quick-Reference Sheet)');
const vivaData = [
  ['Project Name', 'Hall Khoj Finder'],
  ['Domain', 'Web Engineering, E-Commerce Marketplace, 3D WebGL Computer Graphics'],
  ['Architecture Pattern', 'Client-Server 3-Tier RESTful Architecture with Mobile-First Responsive PWA'],
  ['Frontend Technologies', 'HTML5, Vanilla CSS3, Modern ES6+ JavaScript, Three.js (3D), Leaflet.js (Maps)'],
  ['Backend Framework', 'Node.js Runtime (v24.x) with Express.js (v5.x REST API Engine)'],
  ['Database Layer', 'MongoDB Cloud Atlas + Mongoose ODM (with Local Atomic JSON Failover)'],
  ['Security & Cryptography', 'JWT (HS256), Bcrypt (10 Salt Rounds), HMAC-SHA256 Webhook Verification'],
  ['Key Innovations', '1. Phone-only OTP login  2. Three.js 3D Virtual Tour  3. 1-Click Date Blocker  4. Dynamic PDFKit Invoicing  5. 11 Supported Categories'],
  ['Target User Roles', 'Event Seekers (Customers), Venue Owners (Vendors), System Administrators']
];
drawTable(['PROJECT PARAMETER', 'ACADEMIC VIVA SUMMARY SPECIFICATION'], vivaData, [140, 365]);

// ==========================================
// APPLY RUNNING HEADERS, FOOTERS & PAGE NUMBERS
// ==========================================
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);

  // Skip cover page
  if (i === 0) continue;

  // Running Header
  doc.fontSize(7.5).fillColor(NAVY).font('Helvetica-Bold').text('HALL KHOJ FINDER — ACADEMIC PROJECT SYNOPSIS', MARGIN, 24);
  doc.fontSize(7.5).fillColor(GOLD).font('Helvetica').text('DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING', PAGE_W - MARGIN - 230, 24, { width: 230, align: 'right' });
  doc.moveTo(MARGIN, 35).lineTo(PAGE_W - MARGIN, 35).strokeColor(BORDER).lineWidth(0.8).stroke();

  // Running Footer
  doc.moveTo(MARGIN, PAGE_H - 32).lineTo(PAGE_W - MARGIN, PAGE_H - 32).strokeColor(BORDER).lineWidth(0.8).stroke();
  doc.fontSize(7.5).fillColor(MUTED).font('Helvetica').text('Bachelor of Technology (B.Tech) / BCA / MCA Project Submission', MARGIN, PAGE_H - 24);
  doc.fontSize(8).fillColor(NAVY).font('Helvetica-Bold').text(`Page ${i + 1} of ${range.count}`, PAGE_W - MARGIN - 70, PAGE_H - 24, { width: 70, align: 'right' });
}

// Finalize Document
doc.end();

writeStream.on('finish', () => {
  const stat = fs.statSync(outputPath);
  console.log(`[SUCCESS] Academic Synopsis PDF generated successfully!`);
  console.log(`[FILE PATH] ${outputPath}`);
  console.log(`[PAGE COUNT] ${range.count} Pages`);
  console.log(`[FILE SIZE] ${(stat.size / 1024).toFixed(2)} KB`);
});

writeStream.on('error', (err) => {
  console.error('[ERROR] Failed to write Academic PDF:', err);
});
