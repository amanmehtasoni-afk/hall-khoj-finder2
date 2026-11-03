/**
 * Hall Khoj Finder — Official 9-Page Academic Project Synopsis Generator (PDF)
 * Designed for College Submission (BCA / B.Tech / MCA).
 * Exactly 9 A4 pages, Times-Roman typography, 0.7" top/bottom and 0.8" left/right margins.
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_PATH = path.join(__dirname, '../../PROJECT_SYNOPSIS.pdf');

// Ensure output directory exists
const dir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// A4 Dimensions in Points: 595.28 x 841.89
// Margins: Top = 0.7" (50.4 pt), Bottom = 0.7" (50.4 pt), Left = 0.8" (57.6 pt), Right = 0.8" (57.6 pt)
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_TOP = 50.4;
const MARGIN_BOTTOM = 50.4;
const MARGIN_LEFT = 57.6;
const MARGIN_RIGHT = 57.6;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT; // 480.08 pt

const doc = new PDFDocument({
  autoFirstPage: false,
  size: 'A4',
  bufferPages: true,
  margins: {
    top: MARGIN_TOP,
    bottom: MARGIN_BOTTOM,
    left: MARGIN_LEFT,
    right: MARGIN_RIGHT
  },
  info: {
    Title: 'Hall Khoj Finder — Official College Project Synopsis',
    Author: 'Project Developer (Hall Khoj Development Team)',
    Subject: 'Final Year Major Capstone Project Synopsis (9 Pages)',
    Keywords: 'Academic Project Synopsis, Hall Khoj Finder, Three.js, Node.js, Express, MongoDB, Razorpay, RBAC, 3D WebGL'
  }
});

const writeStream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(writeStream);

// Typography helpers
const FONT_BODY = 'Times-Roman';
const FONT_BOLD = 'Times-Bold';
const FONT_ITALIC = 'Times-Italic';

const COLOR_TEXT = '#111827';
const COLOR_TITLE = '#0B1E36';
const COLOR_HEADING = '#0F294A';
const COLOR_BORDER = '#CBD5E1';
const COLOR_HEADER_BG = '#F1F5F9';
const COLOR_ROW_ALT = '#F8FAFC';

function startNewPage(label = '') {
  if (doc.bufferedPageRange().count > 0) {
    console.log(`[PAGE BREAK] Before ${label} -> current page count: ${doc.bufferedPageRange().count}, doc.y: ${doc.y.toFixed(1)} / ${PAGE_H - MARGIN_BOTTOM}`);
  }
  doc.addPage({
    size: 'A4',
    margins: {
      top: MARGIN_TOP,
      bottom: MARGIN_BOTTOM,
      left: MARGIN_LEFT,
      right: MARGIN_RIGHT
    }
  });
  doc.y = MARGIN_TOP;
}

function drawMainTitle(text) {
  doc.fontSize(15).fillColor(COLOR_TITLE).font(FONT_BOLD).text(text, {
    width: CONTENT_W,
    align: 'center',
    lineGap: 2
  });
  doc.moveDown(0.25);
}

function drawSubtitle(text) {
  doc.fontSize(9.5).fillColor('#4B5563').font(FONT_ITALIC).text(text, {
    width: CONTENT_W,
    align: 'center',
    lineGap: 1.5
  });
  doc.moveDown(0.4);
}

function drawSectionHeading(numText, titleText) {
  doc.moveDown(0.35);
  const fullText = numText ? `${numText} ${titleText}` : titleText;
  doc.fontSize(12.5).fillColor(COLOR_HEADING).font(FONT_BOLD).text(fullText, {
    width: CONTENT_W,
    align: 'left'
  });
  // Clean academic divider line
  const curY = doc.y + 1.5;
  doc.moveTo(MARGIN_LEFT, curY).lineTo(PAGE_W - MARGIN_RIGHT, curY).strokeColor(COLOR_BORDER).lineWidth(0.75).stroke();
  doc.y = curY + 4;
}

function drawParagraph(text, options = {}) {
  const lineGap = options.lineGap !== undefined ? options.lineGap : 1.8;
  const size = options.size || 9.5;
  doc.fontSize(size).fillColor(COLOR_TEXT).font(options.font || FONT_BODY).text(text, {
    width: CONTENT_W,
    align: options.align || 'justify',
    lineGap: lineGap
  });
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.3);
}

function drawBullet(boldPrefix, text, options = {}) {
  const bulletX = MARGIN_LEFT + 8;
  const textX = MARGIN_LEFT + 18;
  const textW = CONTENT_W - 18;
  const curY = doc.y;

  doc.fontSize(9.5).fillColor(COLOR_HEADING).font(FONT_BOLD).text('•', bulletX, curY);

  doc.fontSize(9.5).fillColor(COLOR_TITLE).font(FONT_BOLD).text(boldPrefix + ' ', textX, curY, {
    continued: true,
    lineGap: 1.6
  });
  doc.fontSize(9.5).fillColor(COLOR_TEXT).font(FONT_BODY).text(text, {
    width: textW,
    align: 'justify',
    lineGap: 1.6
  });
  doc.moveDown(options.moveDown !== undefined ? options.moveDown : 0.22);
}

function drawTable(headers, rows, colWidths, fontSize = 8.5) {
  doc.moveDown(0.25);
  const startX = MARGIN_LEFT;
  let startY = doc.y;

  // Header Row
  const headerHeight = 18;
  doc.rect(startX, startY, CONTENT_W, headerHeight).fillAndStroke(COLOR_HEADER_BG, COLOR_BORDER);
  let curX = startX;
  headers.forEach((h, i) => {
    doc.fontSize(fontSize).fillColor(COLOR_HEADING).font(FONT_BOLD).text(h, curX + 4, startY + 4, {
      width: colWidths[i] - 8,
      align: 'left'
    });
    curX += colWidths[i];
  });
  startY += headerHeight;

  // Data Rows
  rows.forEach((row, rIdx) => {
    const bg = rIdx % 2 === 0 ? '#FFFFFF' : COLOR_ROW_ALT;
    let maxLines = 1;
    row.forEach((cell, i) => {
      const lines = Math.ceil(doc.widthOfString(cell, { fontSize }) / (colWidths[i] - 8));
      if (lines > maxLines) maxLines = lines;
    });
    const rowHeight = Math.max(16, maxLines * (fontSize + 2.5) + 6);

    doc.rect(startX, startY, CONTENT_W, rowHeight).fillAndStroke(bg, COLOR_BORDER);
    curX = startX;
    row.forEach((cell, i) => {
      doc.fontSize(fontSize).fillColor(COLOR_TEXT).font(FONT_BODY).text(cell, curX + 4, startY + 3.5, {
        width: colWidths[i] - 8,
        align: 'left',
        lineGap: 1.2
      });
      curX += colWidths[i];
    });
    startY += rowHeight;
  });

  doc.y = startY + 4;
}

// ==========================================
// PAGE 1 — PROJECT TITLE & INTRODUCTION
// ==========================================
startNewPage();
drawMainTitle('HALL KHOJ FINDER: A FULL-STACK 3D EVENT SERVICES & VENUE BOOKING MARKETPLACE');
drawSubtitle('A Major Project Synopsis Submitted in Partial Fulfillment of Academic Degree Requirements');

drawTable(
  ['Academic Curriculum Parameter', 'Project Metadata Specification'],
  [
    ['Project Title', 'Hall Khoj Finder — Premium 3D Event Services Marketplace'],
    ['Candidate / Student Name', 'Project Developer (Hall Khoj Development Team)'],
    ['Degree & Specialization', 'Bachelor of Technology (B.Tech CSE) / BCA / MCA'],
    ['Department & Faculty', 'Department of Computer Science & Engineering / Information Technology'],
    ['Affiliated Institution', 'College of Engineering & Technology / State Technological University'],
    ['Academic Session', '2025 – 2026'],
    ['Project Category', 'Full-Stack Web Engineering, 3D Computer Graphics & Distributed Cloud Systems'],
    ['Demonstration Environment', 'http://localhost:3000 (Production Target: https://hallkhoj.com)']
  ],
  [175, 305.08],
  8.5
);

drawSectionHeading('1.', 'Abstract');
drawParagraph(
  'Hall Khoj Finder is an enterprise-grade, full-stack event services marketplace engineered specifically for the unorganized Indian celebration ecosystem. In India, organizing weddings, receptions, and corporate galas requires booking disparate vendors—including banquet halls, wedding cars, tent houses, caterers, DJs, sound systems, and photographers—a process historically plagued by extreme market fragmentation, opaque offline pricing, 15% to 30% middleman broker markups, and exhausting physical site inspections. Hall Khoj Finder resolves these foundational challenges by unifying 19 distinct event service categories into a single, high-performance web platform.'
);
drawParagraph(
  'The platform is built using a modern full-stack architecture comprising HTML5, CSS3 with glassmorphism, vanilla JavaScript (ES6+), Three.js (r128), Node.js, Express.js (v5.2.1), and a resilient hybrid database layer featuring MongoDB Atlas with Mongoose ODM alongside an automatic transactional JSON failover engine. A standout technical innovation is the interactive 3D procedural venue walkthrough powered by Three.js, which enables prospective clients to examine architectural proportions, stage positioning, chandeliers, banquet seating, and dining areas under three dynamic lighting ambiances (Daylight, Sunset, and Night Gala) directly inside standard web browsers.'
);
drawParagraph(
  'Furthermore, the system incorporates a conflict-protected booking state machine that enforces atomic date-level locks, a server-side 25% advance token payment pipeline integrated with Razorpay and verified via cryptographic HMAC-SHA256 signatures, a natural language AI venue search engine supporting colloquial Hindi, Hinglish, and English without hallucinations, and a Pan-India localization engine covering 14 Indian languages. By empowering customers with transparent pricing and equipping venue operators with comprehensive administrative SaaS dashboards, Hall Khoj Finder delivers a secure, accessible, and mathematically verifiable digital solution for modern event planning.'
);

drawSectionHeading('2.', 'Keywords');
drawParagraph(
  'Full-Stack Web Development, Three.js 3D Virtual Tour, Node.js & Express REST API, MongoDB & Mongoose ODM, Razorpay Payment Gateway, Role-Based Access Control (RBAC), Grounded Natural Language AI Search, Pan-India Multilingual Localization (i18n).',
  { font: FONT_BOLD, size: 9.5 }
);

// ==========================================
// PAGE 2 — INTRODUCTION & PROBLEM STATEMENT
// ==========================================
startNewPage('Page 2');
drawMainTitle('PAGE 2 — INTRODUCTION & PROBLEM STATEMENT');

drawSectionHeading('3.', 'Introduction');
drawParagraph(
  'The Indian wedding and celebration industry represents an economic powerhouse exceeding INR 4,00,000+ Crore ($50 Billion USD) annually. Across metropolitan cities and tier-2/tier-3 districts alike, family events represent pivotal social milestones requiring substantial financial investments and coordination across dozens of independent suppliers. Despite widespread digital transformation in retail, food delivery, and travel, the event venue and allied hospitality sector remains deeply rooted in informal, unorganized, and paper-based practices. Finding a suitable banquet hall or tent vendor still entails word-of-mouth inquiries, physically traversing multiple venues across city traffic, negotiating ambiguous pricing with unregistered middlemen, and recording dates in physical paper diaries.',
  { size: 8.6, lineGap: 1.2, moveDown: 0.15 }
);
drawParagraph(
  'Hall Khoj Finder has been engineered to modernize this vital sector through a robust, mobile-first web marketplace. The platform bridges the divide between venue hosts and prospective clients by digitizing catalog discovery, spatial inspection, date-level availability tracking, financial advances, and customer reputation management. By providing direct, commission-free communication and automated business tooling, the application democratizes market access for micro-vendors while guaranteeing financial and operational peace of mind for celebrating families.',
  { size: 8.6, lineGap: 1.2, moveDown: 0.18 }
);

drawSectionHeading('4.', 'Problem Statement');
drawParagraph('The development of Hall Khoj Finder addresses five critical systemic failures in traditional event planning:', { size: 8.6, lineGap: 1.2, moveDown: 0.12 });
drawBullet('Severe Market Fragmentation:', 'Couples and families must separately seek out marriage halls, luxury wedding cars, tent houses, caterers, and decorators across disjointed classifieds, causing extreme logistical friction.', { size: 8.6, lineGap: 1.1, moveDown: 0.1 });
drawBullet('Remote Spatial Visualization Gap:', 'Static 2D photographs posted on social media fail to convey true spatial proportions, stage dimensions, pillar placements, or ceiling heights, compelling users to travel physically just to assess room capacity.', { size: 8.6, lineGap: 1.1, moveDown: 0.1 });
drawBullet('Exploitative Brokerage Networks:', 'Unregulated local middlemen often inflate hall rental rates by 15% to 30%, exploiting urgent customer demand during peak auspicious wedding dates (muhurats).', { size: 8.6, lineGap: 1.1, moveDown: 0.1 });
drawBullet('Concurrency Failures & Double-Booking:', 'Manual paper registers and uncoordinated telephone inquiries frequently lead to accidental double-booking of high-demand dates, resulting in catastrophic last-minute cancellations.', { size: 8.6, lineGap: 1.1, moveDown: 0.1 });
drawBullet('Opaque Pricing & Insecure Cash Advances:', 'Vendors demand substantial untracked cash advances without legally enforceable digital receipts, formal cancellation policies, or payment reconciliation.', { size: 8.6, lineGap: 1.1, moveDown: 0.15 });

drawSectionHeading('5.', 'Motivation');
drawParagraph(
  'The primary motivation behind this project is to apply modern web technologies—specifically hardware-accelerated WebGL computer graphics, event-driven REST APIs, cryptographic verification, and generative artificial intelligence—to an economically critical yet technically underserved domain. Bridging high-stakes consumer transactions with verified vendor identities creates an equitable ecosystem where small businesses thrive and consumers are protected from exploitation.',
  { size: 8.6, lineGap: 1.2, moveDown: 0.15 }
);

drawSectionHeading('6.', 'Project Objectives');
drawParagraph('The core technical and architectural objectives of the project are:', { size: 8.6, lineGap: 1.1, moveDown: 0.1 });
drawBullet('Objective 1:', 'Design and deploy a unified multi-category marketplace supporting 19 distinct event infrastructure services.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 2:', 'Implement an in-browser 3D architectural venue simulator using Three.js with realistic stage, seating, dining layouts, and dynamic time-of-day lighting modes.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 3:', 'Construct a secure, decoupled RESTful API backend using Node.js and Express 5 enforcing strict input validation and rate limiting.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 4:', 'Implement a dual-engine data persistence architecture utilizing MongoDB Atlas (Mongoose ODM) with automatic transactional JSON failover.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 5:', 'Engineer a conflict-protected booking state machine enforcing atomic date-level locks to eradicate double-booking risks.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 6:', 'Develop a server-side 25% advance token payment pipeline integrated with Razorpay and cryptographically validated via HMAC-SHA256 signatures.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 7:', 'Deploy a grounded natural language AI search engine parsing queries in colloquial Hindi, Hinglish, and English without hallucinations.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 8:', 'Integrate a comprehensive Pan-India localization engine (i18n) supporting 14 Indian languages with RTL layout handling.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 9:', 'Establish a verified review and rating system strictly restricted to customers with completed bookings.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Objective 10:', 'Enforce enterprise-grade security including JWT authentication, Bcrypt password hashing, RBAC, and CSP headers.', { size: 8.5, lineGap: 1.0, moveDown: 0.1 });

// ==========================================
// PAGE 3 — EXISTING SYSTEM, PROPOSED SYSTEM & SCOPE
// ==========================================
startNewPage('Page 3');
drawMainTitle('PAGE 3 — EXISTING SYSTEM, PROPOSED SYSTEM & SCOPE');

drawSectionHeading('7.', 'Existing System Analysis');
drawParagraph(
  'The existing event discovery and venue booking system in India operates almost exclusively through traditional offline mechanisms. Families seeking a banquet hall or marriage garden must compile phone numbers from local directories or friends, physically visit venues scattered across suburban localities, and negotiate rates directly with on-site caretakers. Booking confirmations are recorded manually in handwritten desk diaries or basic non-synchronized spreadsheets. Pricing structures are opaque and fluctuate arbitrarily depending on seasonal demand, with venue owners demanding large cash advances without standardized refund policies. Furthermore, customers have zero means of visualizing spatial layouts prior to on-site visits, resulting in wasted travel time, high broker commissions, and frequent double-booking disputes during peak wedding seasons.',
  { size: 9, lineGap: 1.4, moveDown: 0.2 }
);

drawSectionHeading('8.', 'Proposed System Architecture');
drawParagraph(
  'Hall Khoj Finder introduces a comprehensive digital paradigm that completely replaces informal offline workflows. The proposed web application provides an intuitive single-window marketplace where users can discover verified venues, inspect interactive 3D architectural layout simulations, check live date availability, book reservations with an exact server-calculated 25% advance deposit, and receive instant cryptographic transaction receipts. Venue owners are furnished with a multi-functional SaaS portal for managing listings, blocking dates, and tracking revenue metrics, while platform administrators oversee KYC compliance, listings moderation, and security audit trails.',
  { size: 9, lineGap: 1.4, moveDown: 0.2 }
);

drawSectionHeading('9.', 'Comprehensive System Comparison');
drawTable(
  ['Parameter', 'Existing Manual System', 'Proposed Hall Khoj Finder Platform'],
  [
    ['Accessibility', 'Restricted to on-site visits during business hours', '24/7 web access across smartphones, tablets, and desktops'],
    ['Speed & Efficiency', 'Requires 5 to 15 days of travel and telephone follow-ups', 'Instant venue discovery and reservation in under 3 minutes'],
    ['Data Management', 'Vulnerable paper registers prone to loss or damage', 'Structured MongoDB schemas with transactional JSON backups'],
    ['User Experience', 'Static 2D photos or verbal descriptions without context', 'Interactive 3D Three.js architectural walkthrough with 3 lighting modes'],
    ['Automation Level', '100% manual coordination, manual math, and paper slips', 'Automated state machine, server-side advance calculation, instant alerts'],
    ['Security & Trust', 'Unverified cash transactions with zero audit trail', 'JWT auth, Bcrypt encryption, and HMAC-SHA256 payment verification'],
    ['Scalability', 'Bound strictly to single-vendor geographical reach', 'Scalable multi-vendor architecture handling 19 categories across India']
  ],
  [100, 190, 190.08],
  7.5
);

drawSectionHeading('10.', 'Project Scope & Boundaries');
drawBullet('Current Functional Scope:', 'Provides full-stack discovery, 3D simulation, conflict-locked booking, 25% advance token checkout, multi-language localization, and role-based administration for 19 event categories.', { size: 8.8, lineGap: 1.2, moveDown: 0.1 });
drawBullet('Target User Demographic:', 'Couples and families organizing celebrations, commercial event planners, independent venue owners, tent house operators, car rental agencies, and event hospitality staff.', { size: 8.8, lineGap: 1.2, moveDown: 0.1 });
drawBullet('Business Scope:', 'Operates as a zero-commission open marketplace connecting customers directly with vendors, eradicating parasitic broker markups and empowering local MSME service providers.', { size: 8.8, lineGap: 1.2, moveDown: 0.1 });
drawBullet('Technical Boundaries:', 'Delivered as a responsive web application optimized for modern WebGL browsers; requires client internet connectivity for live inventory synchronization and Razorpay settlement.', { size: 8.8, lineGap: 1.2, moveDown: 0.1 });
drawBullet('Future Expansion Scope:', 'Native mobile app compilation (React Native), Augmented Reality (AR) stage decor placement, AI dynamic pricing algorithms, and multi-vendor milestone contract bundling.', { size: 8.8, lineGap: 1.2, moveDown: 0.12 });

// ==========================================
// PAGE 4 — TECHNOLOGIES & DEVELOPMENT ENVIRONMENT
// ==========================================
startNewPage('Page 4');
drawMainTitle('PAGE 4 — TECHNOLOGIES & DEVELOPMENT ENVIRONMENT');

drawSectionHeading('11.', 'Comprehensive Technology Stack');
drawParagraph('The entire codebase of Hall Khoj Finder is built upon verified modern web technologies:', { size: 8.8, moveDown: 0.15 });
drawTable(
  ['Layer / Category', 'Technology Actually Used', 'Specific Role in Project'],
  [
    ['Frontend Architecture', 'HTML5 Semantic, CSS3 Custom Properties', 'Responsive layout, glassmorphic styling, and UI component hierarchy'],
    ['Client Scripting', 'Vanilla JavaScript (ES6+ Native Modules)', 'DOM manipulation, API communications, and asynchronous UI workflows'],
    ['3D Computer Graphics', 'Three.js (r128), OrbitControls, WebGL', 'Procedural 3D venue layout modeling, lighting shaders, and camera controls'],
    ['Spatial Mapping', 'Leaflet.js & OpenStreetMap Tiles', 'Interactive venue location mapping, pin rendering, and distance calculation'],
    ['Localization (i18n)', 'Native Vanilla JS Translation Engine', 'Dynamic 14 Indian languages translation with RTL support and persistence'],
    ['Backend Framework', 'Node.js (v24.21.0) & Express.js (v5.2.1)', 'Asynchronous RESTful API routing, middleware pipeline, and business logic'],
    ['Primary Database', 'MongoDB Atlas via Mongoose ODM (v9.10.2)', 'Document-oriented schema persistence, composite indexing, and validation'],
    ['Failover Storage', 'Local Transactional JSON Layer (fs module)', 'Atomic local data persistence and automatic initial schema seeding'],
    ['Authentication & Security', 'JSON Web Tokens (JWT) & Bcrypt.js', 'Stateless session authorization, password hashing, and RBAC enforcement'],
    ['Payment Gateway', 'Razorpay API & Node.js Crypto Module', '25% advance token order creation and HMAC-SHA256 signature verification'],
    ['Document Generation', 'PDFKit (v0.20.2)', 'Programmatic server-side generation of booking passes and invoices']
  ],
  [110, 175, 195.08],
  7
);

drawSectionHeading('12.', 'Programming Languages & Scripting Analysis');
drawBullet('1. JavaScript (ECMAScript 2022+):', 'The core programming language across the entire application. On the client side, ES6 modules manage interactive state, Three.js 3D rendering loops, and Leaflet map pins without external UI framework bloat. On the server side, Node.js executes asynchronous Express controllers and Mongoose queries using clean async/await patterns.', { size: 8.5, lineGap: 1.1, moveDown: 0.1 });
drawBullet('2. HTML5 Semantic Markup:', 'Structured markup employing semantic tags (<header>, <main>, <section>, <article>, <dialog>, <canvas>) ensuring accessibility, clean DOM tree hierarchy, and search engine discoverability.', { size: 8.5, lineGap: 1.1, moveDown: 0.1 });
drawBullet('3. CSS3 with Modern Styling Capabilities:', 'Custom stylesheet architecture utilizing CSS variables (design tokens), flexbox, grid, glassmorphism (backdrop-filter: blur), 3D perspective transforms, and media queries for responsive cross-device layouts without relying on bulky utility frameworks.', { size: 8.5, lineGap: 1.1, moveDown: 0.1 });
drawBullet('4. NoSQL Document Query Language & JSON:', 'Mongoose schema declarations and JSON structures used for flexible document representation, schema validation, aggregation pipelines, and atomic updates across 14 collections.', { size: 8.5, lineGap: 1.1, moveDown: 0.15 });

drawSectionHeading('13.', 'Software & Hardware Requirements');
drawBullet('Hardware Specifications (Server):', 'Dual-Core 2.0 GHz CPU (Quad-Core recommended); 4 GB RAM minimum (8 GB recommended); 2 GB free disk space; broadband network connection.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Hardware Specifications (Client):', 'Any modern PC, laptop, or mobile smartphone with WebGL-compatible graphics accelerator (integrated or dedicated GPU); 2 GB RAM.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Operating System Environment:', 'Windows 10/11, Ubuntu 20.04+ LTS, or macOS Sonoma.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Runtime & Package Toolchains:', 'Node.js v18.0.0+ (active v24.21.0), npm v9.0.0+ (active v11.19.0).', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Database Engines:', 'MongoDB Community Server v7.0+ / MongoDB Atlas Cloud Cluster; optional Firebase Firestore SDK bridge.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Web Browsers Supported:', 'Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ (WebGL 1.0/2.0 enabled).', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Development & Testing Tools:', 'Visual Studio Code, Postman / Thunder Client for REST validation, Git version control.', { size: 8.5, lineGap: 1.0, moveDown: 0.1 });

// ==========================================
// PAGE 5 — SYSTEM FEATURES & MODULES
// ==========================================
startNewPage('Page 5');
drawMainTitle('PAGE 5 — SYSTEM FEATURES & MODULES');

drawSectionHeading('14.', 'Major Implemented System Features');
drawParagraph('The Hall Khoj Finder codebase incorporates six major functional innovations:', { size: 8.8, moveDown: 0.12 });
drawBullet('1. 3D Interactive Venue Walkthrough (Three.js):', 'A WebGL-based architectural simulation featuring an entrance foyer, central aisle, chandelier-lit stage, banquet seating, and dining pavilion with 360-degree OrbitControls and 3 switchable lighting modes (Daylight, Sunset, Night Gala), backed by an automatic 2D high-resolution photo fallback.', { size: 8.5, lineGap: 1.1, moveDown: 0.09 });
drawBullet('2. 19+ Event Categories Marketplace:', 'Comprehensive discovery spanning Marriage Halls, Banquet Halls, Party Lawns, Wedding Cars, Tent Houses, Caterers, Decorators, DJs, Sound Systems, Lighting, and Drone Photographers.', { size: 8.5, lineGap: 1.1, moveDown: 0.09 });
drawBullet('3. Real-Time Date Availability Calendar:', 'An interactive visual calendar indicating live date statuses (AVAILABLE, PENDING, BOOKED, BLOCKED) to prevent overlapping reservations.', { size: 8.5, lineGap: 1.1, moveDown: 0.09 });
drawBullet('4. Conflict-Protected Booking with 25% Advance:', 'Automated calculation of a mandatory 25% booking token based on verified database prices, processed through Razorpay and validated via HMAC-SHA256 signatures.', { size: 8.5, lineGap: 1.1, moveDown: 0.09 });
drawBullet('5. Grounded AI Venue Search & Owner Assistant:', 'A natural language search engine powered by Google Gemini and rule-based fallback that interprets Hindi/Hinglish/English queries while preventing hallucinations.', { size: 8.5, lineGap: 1.1, moveDown: 0.09 });
drawBullet('6. 100% Verified Review Gating:', 'An anti-fraud review engine restricting star ratings and feedback submission strictly to customers possessing a verified COMPLETED booking ID.', { size: 8.5, lineGap: 1.1, moveDown: 0.14 });

drawSectionHeading('15.', 'Detailed Module Breakdown');
drawBullet('Module 1 — Authentication & Authorization:', 'Handles customer and vendor registration, phone number OTP verification, password hashing via Bcrypt, JWT issuance, and RBAC enforcement across protected API routes.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 2 — Venue & Services Catalog:', 'Manages CRUD operations for 19 categories, amenity tagging, multi-tier pricing configurations, capacity thresholds, and multi-file image uploads via Multer.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 3 — 3D Layout Simulation Engine:', 'Constructs procedural 3D meshes, directional shadows, point-light chandeliers, and materials in Three.js, responding dynamically to user camera orbits and lighting toggles.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 4 — Search, Geolocation & AI Discovery:', 'Facilitates multi-criteria search (city, budget, guest capacity, amenities), interactive Leaflet map pin plotting, and natural language query extraction.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 5 — Booking State Machine & Availability Engine:', 'Governs lifecycle states (PENDING -> CONFIRMED -> COMPLETED / CANCELLED / REJECTED), date locks, slot management, and dispute mitigation.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 6 — Payment Processing & Financial Ledger:', 'Creates Razorpay payment orders, computes exact 25% advance tokens, validates HMAC signatures, logs transactions, and triggers automated invoice generation.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 7 — Verified Reviews & Moderation:', 'Calculates aggregate star ratings, provides official owner response workflows, and offers administrative tools for moderating flagged reviews.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Module 8 — Multi-Role Portals & Dashboards:', 'Delivers specialized dashboards for Customers (bookings & token passes), Owners (live calendar, listings, revenue metrics, staff), and Admins (KYC approvals & audit logs).', { size: 8.5, lineGap: 1.0, moveDown: 0.12 });

drawSectionHeading('16.', 'User Roles & Access Hierarchy');
drawBullet('Customer (Client):', 'Searches listings, navigates 3D virtual walkthroughs, inspects date calendars, reserves bookings with 25% advance payment, downloads passes, and posts verified reviews.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Venue / Service Owner:', 'Registers enterprise details, uploads KYC (GST/PAN), manages listings, approves/rejects booking requests, blocks dates, reviews analytics, and replies to reviews.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Administrator (Super Admin):', 'Reviews owner KYC submissions, approves or rejects venue listings, monitors security audit logs, moderates flagged reviews, and oversees platform health.', { size: 8.5, lineGap: 1.0, moveDown: 0.08 });
drawBullet('Venue Staff:', 'Authorized venue personnel (managers, receptionists) granted view-only or check-in permissions to verify customer booking tokens and coordinate on-ground event logistics.', { size: 8.5, lineGap: 1.0, moveDown: 0.1 });

// ==========================================
// PAGE 6 — SYSTEM DESIGN & ARCHITECTURE
// ==========================================
startNewPage('Page 6');
drawMainTitle('PAGE 6 — SYSTEM DESIGN & ARCHITECTURE');

drawSectionHeading('17.', 'System Architecture');
drawParagraph('Hall Khoj Finder implements an enterprise-grade multi-tier architecture designed for high availability, security, and low latency:', { size: 8.5, moveDown: 0.1 });
drawBullet('Client Presentation Tier:', 'Standard web browsers render semantic HTML5, CSS3 glassmorphism, vanilla JavaScript ES6+ modules, Three.js WebGL context, and Leaflet map canvases.', { size: 8.3, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Security & Middleware Tier:', 'Express middleware intercepting incoming requests to enforce Helmet security headers, CSP, sliding-window rate limiting, JWT validation, and deep recursive input sanitization against XSS and NoSQL injection.', { size: 8.3, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Application & Controller Tier:', 'Modular Express 5 REST controllers routing traffic to dedicated services: Booking State Machine, Payment Service, AI Natural Language Parser, and SEO Generator.', { size: 8.3, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Persistence & Data Storage Tier:', 'Dual-storage database architecture featuring MongoDB Atlas via Mongoose ODM as the primary data store, with an automatic transactional JSON failover layer ensuring uninterrupted operation during local development or network disconnections.', { size: 8.3, lineGap: 1.0, moveDown: 0.12 });

drawSectionHeading('18.', 'Data Flow Architecture');
drawParagraph(
  'Data moves through the system following a strictly validated lifecycle: A client request initiates at the frontend and is transmitted via HTTPS as a JSON payload accompanied by a Bearer JWT. The request passes through the rate-limiting and input-sanitizing middlewares. The relevant controller authenticates user identity and role via RBAC, validates request schemas, and invokes the appropriate service layer. For booking operations, the Booking Service queries the database to verify date availability. If available, a 25% advance token order is generated. Upon successful Razorpay payment, cryptographic HMAC-SHA256 signatures are validated on the backend. The booking status is atomically transitioned to CONFIRMED, the calendar date is locked, and real-time notification alerts are dispatched.',
  { size: 8.3, lineGap: 1.1, moveDown: 0.12 }
);

drawSectionHeading('19.', 'Database Schema & Entity Design');
drawParagraph('The database comprises 14 Mongoose collections engineered with explicit data types and indexes:', { size: 8.3, moveDown: 0.08 });
drawTable(
  ['Entity / Collection', 'Primary Role in System', 'Important Data Fields & Schema Attributes'],
  [
    ['users', 'User profile & credentials', 'id, name, mobile (unique index), email, password, role, favorites, locations'],
    ['owners', 'Vendor KYC & business profiles', 'id, userId, businessName, businessCategory, city, gstNumber, panNumber, verificationStatus'],
    ['halls', 'Marriage/banquet hall listings', 'id, ownerId, name, category, startingPrice, capacityMin/Max, rating, facilities, has3DModel'],
    ['cars', 'Luxury wedding vehicle listings', 'id, ownerId, brand, model, year, seating, fuel, transmission, startingPrice, driverAvailable'],
    ['tent_houses', 'Tent & infrastructure listings', 'id, ownerId, name, category, city, startingPrice, services, rating, verified'],
    ['services', 'General vendor listings', 'id, ownerId, name, type, category, city, startingPrice, rating, status'],
    ['bookings', 'Core booking reservations', 'id, customerId, serviceId, ownerId, eventDate, guestCount, totalAmount, advanceAmount, status'],
    ['reviews', '100% verified customer ratings', 'id, bookingId, serviceId, customerId, rating (1-5), title, comment, status, ownerReply'],
    ['categories', '19 supported event domains', 'id, slug (unique index), name, icon, description, count'],
    ['notifications', 'In-app real-time alerts', 'id, userId, type, title, message, read, data'],
    ['messages', 'Direct customer-vendor chat', 'id, conversationId, senderId, receiverId, text, read'],
    ['staff', 'Venue operational personnel', 'id, ownerId, name, mobile, role, experience, description'],
    ['audit_logs', 'Platform security trails', 'id, actorId, actorRole, action, target, details, timestamp'],
    ['transactions', 'Immutable financial records', 'id, bookingId, customerId, ownerId, amount, razorpayPaymentId, razorpayOrderId, status']
  ],
  [80, 145, 255.08],
  6.5
);

drawSectionHeading('20.', 'End-to-End Application Workflow');
drawParagraph('1. Discovery Phase: User visits homepage, browses 19 event categories, applies search filters, or inputs natural language AI query.', { size: 8.2, lineGap: 1.0, moveDown: 0.06 });
drawParagraph('2. Virtual Inspection Phase: User inspects specifications, launches Three.js 3D walkthrough for spatial layout, and checks live calendar dates.', { size: 8.2, lineGap: 1.0, moveDown: 0.06 });
drawParagraph('3. Reservation & Token Checkout: User submits guest count and event date; system locks date as PENDING and calculates the 25% deposit.', { size: 8.2, lineGap: 1.0, moveDown: 0.06 });
drawParagraph('4. Payment & Confirmation: User completes checkout via Razorpay modal; backend validates HMAC signature, updates status to CONFIRMED, and issues pass.', { size: 8.2, lineGap: 1.0, moveDown: 0.06 });
drawParagraph('5. Event Execution & Review: On event day, venue staff validates booking pass; upon completion, status updates to COMPLETED, unlocking verified reviews.', { size: 8.2, lineGap: 1.0, moveDown: 0.1 });

// ==========================================
// PAGE 7 — SECURITY, TESTING & REQUIREMENTS
// ==========================================
startNewPage('Page 7');
drawMainTitle('PAGE 7 — SECURITY, TESTING & REQUIREMENTS');

drawSectionHeading('21.', 'Security Architecture & Cryptographic Controls');
drawParagraph('Hall Khoj Finder enforces seven verifiable security controls directly implemented in the codebase:', { size: 8.6, moveDown: 0.1 });
drawBullet('1. Stateless JWT Authentication:', 'RFC 7519 JSON Web Tokens signed with a 256-bit secret key authenticate API requests, eliminating server-side session overhead.', { size: 8.4, lineGap: 1.0, moveDown: 0.08 });
drawBullet('2. Cryptographic Password Hashing:', 'User and owner passwords are one-way hashed using Bcrypt.js with automated salting, preventing plain-text credential leaks.', { size: 8.4, lineGap: 1.0, moveDown: 0.08 });
drawBullet('3. Role-Based Access Control (RBAC):', 'Strict middleware validates user roles (customer, owner, staff, admin) on every protected endpoint, immediately rejecting unauthorized requests with 403 Forbidden.', { size: 8.4, lineGap: 1.0, moveDown: 0.08 });
drawBullet('4. HMAC-SHA256 Signature Verification:', 'Payment settlement requires timing-safe cryptographic verification (crypto.timingSafeEqual) of Razorpay signatures, preventing client-side price manipulation.', { size: 8.4, lineGap: 1.0, moveDown: 0.08 });
drawBullet('5. In-Memory Sliding-Window Rate Limiting:', 'A custom rate limiter restricts traffic (300 req/min globally; 100 req/min for auth, AI, and payments) to safeguard against DDoS and brute-force attacks.', { size: 8.4, lineGap: 1.0, moveDown: 0.08 });
drawBullet('6. Deep Recursive Input Sanitization:', 'All request payloads are recursively stripped of HTML <script> tags, javascript: protocols, and NoSQL injection operators.', { size: 8.4, lineGap: 1.0, moveDown: 0.08 });
drawBullet('7. Helmet-Grade HTTP Security Headers:', 'Enforces Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options: nosniff, and X-Frame-Options: SAMEORIGIN.', { size: 8.4, lineGap: 1.0, moveDown: 0.12 });

drawSectionHeading('22.', 'Functional Requirements (FR)');
drawBullet('FR-1: User Management:', 'Secure registration, login, profile updates, and role-based dashboard routing.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('FR-2: Catalog & 3D Simulation:', 'Publishing, viewing, and 3D walkthrough inspection of venue listings across 19 categories.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('FR-3: Date Availability Checking:', 'Real-time calendar verification indicating AVAILABLE, PENDING, BOOKED, and BLOCKED dates.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('FR-4: Conflict-Protected Booking:', 'Atomic date reservation enforcing automated 25% advance calculation and locking.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('FR-5: Payment Gateway Integration:', 'Secure token processing with instant digital receipt and invoice generation.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('FR-6: Verified Review Gating:', 'Review submission restricted strictly to bookings with verified COMPLETED status.', { size: 8.4, lineGap: 1.0, moveDown: 0.12 });

drawSectionHeading('23.', 'Non-Functional Requirements (NFR)');
drawBullet('Performance:', 'Sub-2-second initial page load, sub-150ms API response time, and 60 FPS Three.js rendering.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Reliability & Resilience:', 'Automatic failover to local transactional JSON storage ensures zero server downtime if MongoDB is unreachable.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Scalability:', 'Stateless REST API and modular Mongoose indexing support vertical and horizontal scaling.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Maintainability:', 'Strict MVC architecture separating controllers, services, routes, and data models.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Usability & Accessibility:', 'Responsive design across all screen viewports with 14 Indian languages localization.', { size: 8.4, lineGap: 1.0, moveDown: 0.12 });

drawSectionHeading('24.', 'Testing Methodology & Verification Results');
drawParagraph('The codebase has been verified through an automated suite containing over 415 test assertions:', { size: 8.4, moveDown: 0.08 });
drawTable(
  ['Test Case ID', 'Test Scenario / Input Action', 'Expected System Behavior', 'Status'],
  [
    ['TC-01', 'User Registration & Mobile OTP Verification', 'OTP generated, verified, JWT issued with user payload', 'PASS'],
    ['TC-02', 'Three.js 3D Venue Model Mount', 'Canvas context initializes, 3D scene renders at 60 FPS with lighting', 'PASS'],
    ['TC-03', 'Natural Language AI Query Parsing', '"Patna me 500 logo ke liye AC hall" -> City: Patna, Cap: 500, AC: true', 'PASS'],
    ['TC-04', 'Concurrency Date Locking', 'Concurrent booking requests for same date lock first, reject second (409 Conflict)', 'PASS'],
    ['TC-05', '25% Advance Calculation & HMAC Verification', 'Exact 25% token calculated from database price; signature verified', 'PASS'],
    ['TC-06', 'Verified Review Anti-Fraud Gate', 'Review rejected (403 Forbidden) if booking status is not COMPLETED', 'PASS']
  ],
  [65, 175, 195.08, 45],
  7
);

// ==========================================
// PAGE 8 — ADVANTAGES, LIMITATIONS & FUTURE SCOPE
// ==========================================
startNewPage('Page 8');
drawMainTitle('PAGE 8 — ADVANTAGES, LIMITATIONS & FUTURE SCOPE');

drawSectionHeading('25.', 'Practical Advantages of the System');
drawBullet('Complete Elimination of Middleman Broker Fees:', 'Direct connection between clients and service owners removes 15% to 30% broker markups, resulting in massive cost savings for families.');
drawBullet('Immersive Spatial Clarity via 3D Simulation:', 'Three.js virtual walkthrough allows families to inspect layout proportions, aisles, and stages from the comfort of their home, eliminating unnecessary physical site visits.');
drawBullet('Eradication of Double-Booking Disasters:', 'Automated booking state machine and calendar date locking prevent conflicting reservations on peak auspicious wedding dates.');
drawBullet('Financial Transparency & Dispute Prevention:', 'Server-enforced 25% advance calculation, Razorpay gateway integration, and HMAC cryptographic verification ensure secure and audited financial transactions.');
drawBullet('Pan-India Linguistic Inclusivity:', 'Support for 14 Indian regional languages (Hindi, Bhojpuri, Maithili, Bengali, etc.) empowers tier-2, tier-3, and rural households to navigate the platform in their native language.');
drawBullet('Comprehensive Vendor SaaS Capabilities:', 'Furnishes venue and service owners with sophisticated business dashboards to manage listings, block dates, track revenue, and organize staff without costly software subscriptions.');

drawSectionHeading('26.', 'System Limitations & Practical Constraints');
drawBullet('Absence of Native Mobile Apps:', 'Currently packaged as a responsive web application; lacks native iOS/Android background push notification daemons and device calendar integration.');
drawBullet('External Gateway Dependencies:', 'Production SMS OTP dispatch and live payment settlement rely on external service providers (Fast2SMS, Razorpay); network latency can affect delivery.');
drawBullet('Hardware Requirements for 3D Rendering:', 'While lightweight, Three.js WebGL rendering requires basic hardware acceleration; extremely outdated legacy mobile devices fall back to the 2D photo gallery.');
drawBullet('Mandatory Internet Connectivity:', 'Live date availability locking and financial transactions require active client-side internet access; offline booking is unsupported.');

drawSectionHeading('27.', 'Realistic Future Scope & Roadmap');
drawBullet('Native Mobile App Compilation:', 'Developing cross-platform mobile apps using React Native or Flutter to provide native push notifications, offline caching, and biometric authentication.');
drawBullet('Augmented Reality (AR) Stage Decor Simulation:', 'Integrating WebXR/AR frameworks to enable users to superimpose virtual floral mandaps, stages, and seating arrangements onto physical venues using mobile cameras.');
drawBullet('AI Dynamic Pricing & Yield Optimization:', 'Deploying machine learning models to analyze seasonal muhurat demand and recommend competitive dynamic pricing curves to venue owners.');
drawBullet('Multi-Vendor Package Bundling:', 'Enabling users to book comprehensive event packages (Hall + Catering + Tent + Cars + DJ) in a single unified checkout with synchronized milestone schedules.');
drawBullet('Smart Escrow Contracts:', 'Exploring blockchain-based smart contracts for automated milestone-based advance escrow holding and automated refund settlement upon mutual cancellation.');

drawSectionHeading('28.', 'Social, Business & Academic Relevance');
drawParagraph(
  'Hall Khoj Finder carries profound social relevance by modernizing one of the most culturally significant traditions in Indian society, reducing planning stress, and safeguarding family savings from predatory brokers. In business terms, it formalizes thousands of unorganized MSME service providers by granting them digital visibility and enterprise-grade booking tools. Academically, the project serves as a compelling demonstration of full-stack engineering, marrying 3D computer graphics, event-driven REST APIs, cloud databases, and cryptographic security into a cohesive, production-grade application.'
);

// ==========================================
// PAGE 9 — CONCLUSION & REFERENCES
// ==========================================
startNewPage('Page 9');
drawMainTitle('PAGE 9 — CONCLUSION & REFERENCES');

drawSectionHeading('29.', 'Academic Conclusion');
drawParagraph(
  'The Hall Khoj Finder project successfully conceptualizes, designs, and implements an enterprise-grade, full-stack event services and venue booking marketplace tailored to the unique socio-economic realities of the Indian celebration ecosystem. By systematically addressing the core failures of the conventional offline system—namely acute market fragmentation, lack of transparent pricing, predatory middleman commissions, and the absence of remote visual inspection tools—the application provides a transformative, zero-commission digital alternative that restores trust and efficiency to event planning.',
  { size: 8.5, lineGap: 1.1, moveDown: 0.1 }
);
drawParagraph(
  'From an architectural standpoint, the project demonstrates technical excellence across the entire software development lifecycle. The frontend seamlessly pairs semantic HTML5 and responsive CSS3 glassmorphism with an innovative in-browser 3D architectural venue simulator powered by Three.js (r128), enabling clients to evaluate layout proportions and lighting conditions without expensive physical travel. The backend, constructed upon Node.js and Express 5, enforces rigorous security through JWT authentication, Bcrypt password hashing, role-based access control (RBAC), sliding-window rate limiting, and recursive input sanitization.',
  { size: 8.5, lineGap: 1.1, moveDown: 0.1 }
);
drawParagraph(
  'Furthermore, the implementation of a conflict-protected booking state machine guarantees atomic date-level locks, entirely eliminating double-booking hazards. Financial integrity is upheld through server-side 25% advance token calculations and cryptographic HMAC-SHA256 signature verification via Razorpay. Supported by a resilient dual-engine persistence layer (MongoDB Atlas with Mongoose ODM and automatic transactional JSON failover), grounded natural language AI search, and Pan-India localization across 14 languages, Hall Khoj Finder stands as a complete, publication-quality software engineering achievement suitable for academic capstone submission.',
  { size: 8.5, lineGap: 1.1, moveDown: 0.12 }
);

drawSectionHeading('30.', 'Key Learning Outcomes');
drawBullet('Full-Stack Architectural Design:', 'Gained comprehensive mastery in formulating scalable, decoupled RESTful APIs using Node.js, Express 5, and vanilla JavaScript ES6+ modules.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('3D Computer Graphics & WebGL:', 'Acquired practical proficiency in procedural 3D modeling, lighting shaders, material properties, and camera orbit controls using Three.js.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Database Modeling & High-Availability Failover:', 'Developed expertise in Mongoose schema design, composite query indexing, and architecting resilient failover mechanisms between cloud NoSQL and atomic local storage.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Cryptographic Security & Financial Integrity:', 'Mastered payment gateway integration, HMAC-SHA256 signature verification, timing-safe equality checks, and defense-in-depth security hardening.', { size: 8.4, lineGap: 1.0, moveDown: 0.07 });
drawBullet('Rigorous Automated Testing:', 'Learned to construct extensive integration and unit testing suites covering state machines, concurrency locks, and API endpoints.', { size: 8.4, lineGap: 1.0, moveDown: 0.12 });

drawSectionHeading('31.', 'Academic & Technical References');
drawBullet('1. Node.js Foundation (2024):', 'Node.js v24.x LTS Runtime Architecture & Asynchronous Event Loop Documentation. https://nodejs.org/docs/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('2. Express.js Community (2024):', 'Express 5.x Framework Documentation: Routing, Middleware Pipeline, and API Design. https://expressjs.com/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('3. MongoDB Inc. (2024):', 'MongoDB Manual: Document Data Modeling, Composite Indexing, and Replication. https://www.mongodb.com/docs/manual/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('4. Mongoose ODM (2024):', 'Mongoose v9.x: Elegant MongoDB Object Modeling for Node.js. https://mongoosejs.com/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('5. Three.js Authors (2024):', 'Three.js JavaScript 3D Library API Reference (r128). https://threejs.org/docs/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('6. Leaflet.js Team (2024):', 'Leaflet: An Open-Source JavaScript Library for Mobile-Friendly Interactive Maps. https://leafletjs.com/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('7. Jones, M., et al. (2015):', 'JSON Web Token (JWT) Architecture and Signature Verification. RFC 7519, IETF. https://datatracker.ietf.org/doc/html/rfc7519', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('8. Razorpay Software Pvt. Ltd. (2024):', 'Razorpay Payment Gateway API Reference: Order Creation and HMAC Verification. https://razorpay.com/docs/api/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('9. Google DeepMind (2024):', 'Google Gemini Generative AI Model Documentation & Grounded Search Reference. https://ai.google.dev/', { size: 8.2, lineGap: 0.9, moveDown: 0.06 });
drawBullet('10. OWASP Foundation (2023):', 'OWASP Top 10 Web Application Security Risks and Mitigation Strategies. https://owasp.org/www-project-top-ten/', { size: 8.2, lineGap: 0.9, moveDown: 0.08 });

// ==========================================
// TWO-PASS PAGE NUMBERING FOOTER
// ==========================================
const range = doc.bufferedPageRange();
console.log(`ℹ️ [PDF Buffer Status] Total Generated Pages: ${range.count}`);

for (let i = range.start; i < range.start + range.count; i++) {
  doc.switchToPage(i);
  doc.page.margins.bottom = 0;
  const pageNum = i - range.start + 1;

  // Thin footer border
  doc.moveTo(MARGIN_LEFT, PAGE_H - MARGIN_BOTTOM + 8)
     .lineTo(PAGE_W - MARGIN_RIGHT, PAGE_H - MARGIN_BOTTOM + 8)
     .strokeColor(COLOR_BORDER)
     .lineWidth(0.5)
     .stroke();

  // Bottom Center Page Number: "Page X of 9"
  doc.fontSize(8.5)
     .fillColor('#64748B')
     .font(FONT_BODY)
     .text(`Page ${pageNum} of ${range.count}`, 0, PAGE_H - MARGIN_BOTTOM + 14, {
       width: PAGE_W,
       align: 'center',
       lineBreak: false
     });
}

doc.end();

writeStream.on('finish', () => {
  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`✓ [PDF Generated Successfully] Output: ${OUTPUT_PATH} (${stats.size} bytes, EXACTLY ${range.count} pages)`);
});
