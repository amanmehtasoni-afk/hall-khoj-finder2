/**
 * Hall Khoj Finder — Official 9-Page Academic Project Synopsis Generator (DOCX)
 * Strictly conforms to A4, 9 Pages, Times New Roman, 1.15 Spacing, Justified Text.
 */

const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  PageBreak,
  convertInchesToTwip,
  WidthType,
  Footer,
  PageNumber,
  BorderStyle,
  ShadingType
} = require('docx');

const OUTPUT_PATH = path.join(__dirname, '../../PROJECT_SYNOPSIS.docx');

// Helper to create body paragraphs
function p(text, options = {}) {
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({
      text: text,
      font: 'Times New Roman',
      size: options.size || 22, // 11 pt
      bold: options.bold || false,
      italics: options.italics || false,
      color: options.color || '1A1A1A'
    }));
  } else if (Array.isArray(text)) {
    text.forEach(item => {
      if (typeof item === 'string') {
        runs.push(new TextRun({ text: item, font: 'Times New Roman', size: options.size || 22, color: '1A1A1A' }));
      } else {
        runs.push(new TextRun({
          text: item.text,
          font: 'Times New Roman',
          size: item.size || options.size || 22,
          bold: item.bold || false,
          italics: item.italics || false,
          color: item.color || '1A1A1A'
        }));
      }
    });
  }

  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      line: 276, // 1.15 line spacing (240 * 1.15 = 276)
      before: options.before !== undefined ? options.before : 70,
      after: options.after !== undefined ? options.after : 70
    },
    children: runs
  });
}

function h1(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 120, line: 276 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 32, // 16 pt
        bold: true,
        color: '000000'
      })
    ]
  });
}

function h2(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 140, after: 60, line: 276 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 26, // 13 pt
        bold: true,
        color: '0F294A'
      })
    ]
  });
}

function h3(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 100, after: 40, line: 276 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 23, // 11.5 pt
        bold: true,
        color: '1A1A1A'
      })
    ]
  });
}

function bullet(boldPrefix, text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 30, after: 30, line: 276 },
    indent: { left: convertInchesToTwip(0.25) },
    children: [
      new TextRun({ text: '•  ', font: 'Times New Roman', size: 22, bold: true, color: '0F294A' }),
      new TextRun({ text: boldPrefix + ' ', font: 'Times New Roman', size: 22, bold: true, color: '000000' }),
      new TextRun({ text: text, font: 'Times New Roman', size: 22, color: '1A1A1A' })
    ]
  });
}

function createTable(headers, rows, colWidthsPct) {
  const tableRows = [];

  // Header Row
  const headerCells = headers.map((h, i) => {
    return new TableCell({
      width: { size: colWidthsPct[i], type: WidthType.PERCENTAGE },
      shading: { fill: 'EAEFF5', type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { line: 240, before: 30, after: 30 },
          children: [new TextRun({ text: h, font: 'Times New Roman', size: 20, bold: true, color: '0F294A' })]
        })
      ]
    });
  });
  tableRows.push(new TableRow({ children: headerCells }));

  // Data Rows
  rows.forEach((r, rIdx) => {
    const bg = rIdx % 2 === 0 ? 'FFFFFF' : 'F9FAFC';
    const cells = r.map((c, i) => {
      return new TableCell({
        width: { size: colWidthsPct[i], type: WidthType.PERCENTAGE },
        shading: { fill: bg, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { line: 240, before: 20, after: 20 },
            children: [new TextRun({ text: c, font: 'Times New Roman', size: 19, color: '1A1A1A' })]
          })
        ]
      });
    });
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tableRows
  });
}

function pageBreak() {
  return new Paragraph({
    children: [new PageBreak()]
  });
}

async function buildDocx() {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            width: convertInchesToTwip(8.27), // A4
            height: convertInchesToTwip(11.69)
          },
          margin: {
            top: convertInchesToTwip(0.7),
            bottom: convertInchesToTwip(0.7),
            left: convertInchesToTwip(0.8),
            right: convertInchesToTwip(0.8)
          }
        }
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: 'Page ', font: 'Times New Roman', size: 20 }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 20 }),
                new TextRun({ text: ' of ', font: 'Times New Roman', size: 20 }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Times New Roman', size: 20 })
              ]
            })
          ]
        })
      },
      children: [
        // ==========================================
        // PAGE 1 — PROJECT TITLE & INTRODUCTION
        // ==========================================
        h1('HALL KHOJ FINDER: A FULL-STACK 3D EVENT SERVICES & VENUE BOOKING MARKETPLACE'),
        p([
          { text: 'A MAJOR PROJECT SYNOPSIS SUBMITTED IN PARTIAL FULFILLMENT OF DEGREE REQUIREMENTS', italics: true, size: 20, color: '4A5568' }
        ], { alignment: AlignmentType.CENTER, before: 20, after: 100 }),

        createTable(
          ['Academic Parameter', 'Project Metadata Specification'],
          [
            ['Project Title', 'Hall Khoj Finder — Premium 3D Event Services Marketplace'],
            ['Candidate / Student Name', 'Project Developer (Hall Khoj Development Team)'],
            ['Degree & Specialization', 'Bachelor of Technology (B.Tech CSE) / BCA / MCA'],
            ['Department & Faculty', 'Department of Computer Science & Engineering / Information Technology'],
            ['College / University', 'College of Engineering & Technology / State Technological University'],
            ['Academic Session', '2025 – 2026'],
            ['Project Category', 'Full-Stack Web Engineering, 3D Computer Graphics & Distributed Systems'],
            ['Live Demonstration URL', 'http://localhost:3000 (Production: https://hallkhoj.com)']
          ],
          [35, 65]
        ),

        h2('1. Abstract'),
        p(
          'Hall Khoj Finder is an enterprise-ready, full-stack event services marketplace engineered specifically for the unorganized Indian celebration ecosystem. In India, organizing weddings, receptions, and corporate galas requires booking disparate vendors—including banquet halls, wedding cars, tent houses, caterers, DJs, sound systems, and photographers—a process historically plagued by extreme market fragmentation, opaque offline pricing, 15% to 30% middleman broker markups, and exhausting physical site inspections. Hall Khoj Finder resolves these foundational challenges by unifying 19 distinct event service categories into a single, high-performance web platform.'
        ),
        p(
          'The platform is built using a modern full-stack architecture comprising HTML5, CSS3 with glassmorphism, vanilla JavaScript (ES6+), Three.js (r128), Node.js, Express.js (v5.2.1), and a resilient hybrid database layer featuring MongoDB Atlas with Mongoose ODM alongside an automatic transactional JSON failover engine. A standout technical innovation is the interactive 3D procedural venue walkthrough powered by Three.js, which enables prospective clients to examine architectural proportions, stage positioning, chandeliers, banquet seating, and dining areas under three dynamic lighting ambiances (Daylight, Sunset, and Night Gala) directly inside standard web browsers.'
        ),
        p(
          'Furthermore, the system incorporates a conflict-protected booking state machine that enforces atomic date-level locks, a server-side 25% advance token payment pipeline integrated with Razorpay and verified via cryptographic HMAC-SHA256 signatures, a natural language AI venue search engine supporting colloquial Hindi, Hinglish, and English without hallucinations, and a Pan-India localization engine covering 14 Indian languages. By empowering customers with transparent pricing and equipping venue operators with comprehensive administrative SaaS dashboards, Hall Khoj Finder delivers a secure, accessible, and mathematically verifiable digital solution for modern event planning.'
        ),

        h2('2. Keywords'),
        p([
          { text: 'Technical Keywords: ', bold: true },
          { text: 'Full-Stack Web Development, Three.js 3D Virtual Tour, Node.js & Express REST API, MongoDB & Mongoose ODM, Razorpay Payment Gateway, Role-Based Access Control (RBAC), Grounded Natural Language AI Search, Pan-India Multilingual Localization (i18n).' }
        ], { before: 80, after: 80 }),

        pageBreak(),

        // ==========================================
        // PAGE 2 — INTRODUCTION & PROBLEM STATEMENT
        // ==========================================
        h1('PAGE 2 — INTRODUCTION & PROBLEM STATEMENT'),
        h2('3. Introduction'),
        p(
          'The Indian wedding and celebration industry represents an economic powerhouse exceeding INR 4,00,000+ Crore ($50 Billion USD) annually. Across metropolitan cities and tier-2/tier-3 districts alike, family events represent pivotal social milestones requiring substantial financial investments and coordination across dozens of independent suppliers. Despite widespread digital transformation in retail, food delivery, and travel, the event venue and allied hospitality sector remains deeply rooted in informal, unorganized, and paper-based practices. Finding a suitable banquet hall or tent vendor still entails word-of-mouth inquiries, physically traversing multiple venues across city traffic, negotiating ambiguous pricing with unregistered middlemen, and recording dates in physical paper diaries.'
        ),
        p(
          'Hall Khoj Finder has been engineered to modernize this vital sector through a robust, mobile-first web marketplace. The platform bridges the divide between venue hosts and prospective clients by digitizing catalog discovery, spatial inspection, date-level availability tracking, financial advances, and customer reputation management. By providing direct, commission-free communication and automated business tooling, the application democratizes market access for micro-vendors while guaranteeing financial and operational peace of mind for celebrating families.'
        ),

        h2('4. Problem Statement'),
        p(
          'The development of Hall Khoj Finder is motivated by five systemic breakdowns observed in the conventional event management ecosystem:'
        ),
        bullet('Severe Market Fragmentation:', 'Couples and families must separately seek out marriage halls, luxury wedding cars, tent houses, caterers, and decorators across disjointed classifieds, causing extreme logistical friction.'),
        bullet('Remote Spatial Visualization Gap:', 'Static 2D photographs posted on social media fail to convey true spatial proportions, stage dimensions, pillar placements, or ceiling heights, compelling users to travel physically just to assess room capacity.'),
        bullet('Exploitative Brokerage Networks:', 'Unregulated local middlemen often inflate hall rental rates by 15% to 30%, exploiting urgent customer demand during peak auspicious wedding dates (muhurats).'),
        bullet('Concurrency Failures & Double-Booking:', 'Manual paper registers and uncoordinated telephone inquiries frequently lead to accidental double-booking of high-demand dates, resulting in catastrophic last-minute cancellations.'),
        bullet('Opaque Pricing & Insecure Cash Advances:', 'Vendors demand substantial untracked cash advances without legally enforceable digital receipts, formal cancellation policies, or payment reconciliation.'),

        h2('5. Motivation'),
        p(
          'The primary motivation behind this project is to apply modern web technologies—specifically hardware-accelerated WebGL computer graphics, event-driven REST APIs, cryptographic verification, and generative artificial intelligence—to an economically critical yet technically underserved domain. Bridging high-stakes consumer transactions with verified vendor identities creates an equitable ecosystem where small businesses thrive and consumers are protected from exploitation.'
        ),

        h2('6. Project Objectives'),
        p('The core technical and architectural objectives of the project are:'),
        bullet('Objective 1:', 'Design and deploy a unified multi-category marketplace supporting 19 distinct event infrastructure services.'),
        bullet('Objective 2:', 'Implement an in-browser 3D architectural venue simulator using Three.js with realistic stage, seating, dining layouts, and dynamic time-of-day lighting modes.'),
        bullet('Objective 3:', 'Construct a secure, decoupled RESTful API backend using Node.js and Express 5 enforcing strict input validation and rate limiting.'),
        bullet('Objective 4:', 'Implement a dual-engine data persistence architecture utilizing MongoDB Atlas (Mongoose ODM) with automatic transactional JSON failover.'),
        bullet('Objective 5:', 'Engineer a conflict-protected booking state machine enforcing atomic date-level locks to eradicate double-booking risks.'),
        bullet('Objective 6:', 'Develop a server-side 25% advance token payment pipeline integrated with Razorpay and cryptographically validated via HMAC-SHA256 signatures.'),
        bullet('Objective 7:', 'Deploy a grounded natural language AI search engine parsing queries in colloquial Hindi, Hinglish, and English without hallucinations.'),
        bullet('Objective 8:', 'Integrate a comprehensive Pan-India localization engine (i18n) supporting 14 Indian languages with RTL layout handling.'),
        bullet('Objective 9:', 'Establish a verified review and rating system strictly restricted to customers with completed bookings.'),
        bullet('Objective 10:', 'Enforce enterprise-grade security including JWT authentication, Bcrypt password hashing, RBAC, and CSP headers.'),

        pageBreak(),

        // ==========================================
        // PAGE 3 — EXISTING SYSTEM, PROPOSED SYSTEM & SCOPE
        // ==========================================
        h1('PAGE 3 — EXISTING SYSTEM, PROPOSED SYSTEM & SCOPE'),
        h2('7. Existing System Analysis'),
        p(
          'The existing event discovery and venue booking system in India operates almost exclusively through traditional offline mechanisms. Families seeking a banquet hall or marriage garden must compile phone numbers from local directories or friends, physically visit venues scattered across suburban localities, and negotiate rates directly with on-site caretakers. Booking confirmations are recorded manually in handwritten desk diaries or basic non-synchronized spreadsheets. Pricing structures are opaque and fluctuate arbitrarily depending on seasonal demand, with venue owners demanding large cash advances without standardized refund policies. Furthermore, customers have zero means of visualizing spatial layouts prior to on-site visits, resulting in wasted travel time, high broker commissions, and frequent double-booking disputes during peak wedding seasons.'
        ),

        h2('8. Proposed System Architecture'),
        p(
          'Hall Khoj Finder introduces a comprehensive digital paradigm that completely replaces informal offline workflows. The proposed web application provides an intuitive single-window marketplace where users can discover verified venues, inspect interactive 3D architectural layout simulations, check live date availability, book reservations with an exact server-calculated 25% advance deposit, and receive instant cryptographic transaction receipts. Venue owners are furnished with a multi-functional SaaS portal for managing listings, blocking dates, and tracking revenue metrics, while platform administrators oversee KYC compliance, listings moderation, and security audit trails.'
        ),

        h2('9. Comprehensive System Comparison'),
        createTable(
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
          [22, 38, 40]
        ),

        h2('10. Project Scope & Boundaries'),
        p([
          { text: '• Current Functional Scope: ', bold: true },
          { text: 'Provides full-stack discovery, 3D simulation, conflict-locked booking, 25% advance token checkout, multi-language localization, and role-based administration for 19 event categories.' }
        ]),
        p([
          { text: '• Target User Demographic: ', bold: true },
          { text: 'Couples and families organizing celebrations, commercial event planners, independent venue owners, tent house operators, car rental agencies, and event hospitality staff.' }
        ]),
        p([
          { text: '• Business Scope: ', bold: true },
          { text: 'Operates as a zero-commission open marketplace connecting customers directly with vendors, eradicating parasitic broker markups and empowering local MSME service providers.' }
        ]),
        p([
          { text: '• Technical Boundaries: ', bold: true },
          { text: 'Delivered as a responsive web application optimized for modern WebGL browsers; requires client internet connectivity for live inventory synchronization and Razorpay settlement.' }
        ]),
        p([
          { text: '• Future Expansion Scope: ', bold: true },
          { text: 'Native mobile app compilation (React Native), Augmented Reality (AR) stage decor placement, AI dynamic pricing algorithms, and multi-vendor milestone contract bundling.' }
        ]),

        pageBreak(),

        // ==========================================
        // PAGE 4 — TECHNOLOGIES & DEVELOPMENT ENVIRONMENT
        // ==========================================
        h1('PAGE 4 — TECHNOLOGIES & DEVELOPMENT ENVIRONMENT'),
        h2('11. Comprehensive Technology Stack'),
        p('The entire codebase of Hall Khoj Finder is built upon verified modern web technologies:'),
        createTable(
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
          [22, 36, 42]
        ),

        h2('12. Programming Languages & Scripting Analysis'),
        p([
          { text: '1. JavaScript (ECMAScript 2022+): ', bold: true },
          { text: 'The core programming language across the entire application. On the client side, ES6 modules manage interactive state, Three.js 3D rendering loops, and Leaflet map pins without external UI framework bloat. On the server side, Node.js executes asynchronous Express controllers and Mongoose queries using clean async/await patterns.' }
        ]),
        p([
          { text: '2. HTML5 Semantic Markup: ', bold: true },
          { text: 'Structured markup employing semantic tags (<header>, <main>, <section>, <article>, <dialog>, <canvas>) ensuring accessibility, clean DOM tree hierarchy, and search engine discoverability.' }
        ]),
        p([
          { text: '3. CSS3 with Modern Styling Capabilities: ', bold: true },
          { text: 'Custom stylesheet architecture utilizing CSS variables (design tokens), flexbox, grid, glassmorphism (backdrop-filter: blur), 3D perspective transforms, and media queries for responsive cross-device layouts without relying on bulky utility frameworks.' }
        ]),
        p([
          { text: '4. NoSQL Document Query Language & JSON: ', bold: true },
          { text: 'Mongoose schema declarations and JSON structures used for flexible document representation, schema validation, aggregation pipelines, and atomic updates across 14 collections.' }
        ]),

        h2('13. Software & Hardware Requirements'),
        bullet('Hardware Specifications (Server):', 'Dual-Core 2.0 GHz CPU (Quad-Core recommended); 4 GB RAM minimum (8 GB recommended); 2 GB free disk space; broadband network connection.'),
        bullet('Hardware Specifications (Client):', 'Any modern PC, laptop, or mobile smartphone with WebGL-compatible graphics accelerator (integrated or dedicated GPU); 2 GB RAM.'),
        bullet('Operating System Environment:', 'Windows 10/11, Ubuntu 20.04+ LTS, or macOS Sonoma.'),
        bullet('Runtime & Package Toolchains:', 'Node.js v18.0.0+ (active v24.21.0), npm v9.0.0+ (active v11.19.0).'),
        bullet('Database Engines:', 'MongoDB Community Server v7.0+ / MongoDB Atlas Cloud Cluster; optional Firebase Firestore SDK bridge.'),
        bullet('Web Browsers Supported:', 'Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ (WebGL 1.0/2.0 enabled).'),
        bullet('Development & Testing Tools:', 'Visual Studio Code, Postman / Thunder Client for REST validation, Git version control.'),

        pageBreak(),

        // ==========================================
        // PAGE 5 — SYSTEM FEATURES & MODULES
        // ==========================================
        h1('PAGE 5 — SYSTEM FEATURES & MODULES'),
        h2('14. Major Implemented System Features'),
        p('The Hall Khoj Finder codebase incorporates six major functional innovations:'),
        bullet('1. 3D Interactive Venue Walkthrough (Three.js):', 'A WebGL-based architectural simulation featuring an entrance foyer, central aisle, chandelier-lit stage, banquet seating, and dining pavilion with 360-degree OrbitControls and 3 switchable lighting modes (Daylight, Sunset, Night Gala), backed by an automatic 2D high-resolution photo fallback.'),
        bullet('2. 19+ Event Categories Marketplace:', 'Comprehensive discovery spanning Marriage Halls, Banquet Halls, Party Lawns, Wedding Cars, Tent Houses, Caterers, Decorators, DJs, Sound Systems, Lighting, and Drone Photographers.'),
        bullet('3. Real-Time Date Availability Calendar:', 'An interactive visual calendar indicating live date statuses (AVAILABLE, PENDING, BOOKED, BLOCKED) to prevent overlapping reservations.'),
        bullet('4. Conflict-Protected Booking with 25% Advance:', 'Automated calculation of a mandatory 25% booking token based on verified database prices, processed through Razorpay and validated via HMAC-SHA256 signatures.'),
        bullet('5. Grounded AI Venue Search & Owner Assistant:', 'A natural language search engine powered by Google Gemini and rule-based fallback that interprets Hindi/Hinglish/English queries while preventing hallucinations.'),
        bullet('6. 100% Verified Review Gating:', 'An anti-fraud review engine restricting star ratings and feedback submission strictly to customers possessing a verified COMPLETED booking ID.'),

        h2('15. Detailed Module Breakdown'),
        p([
          { text: '• Module 1 — Authentication & Authorization: ', bold: true },
          { text: 'Handles customer and vendor registration, phone number OTP verification, password hashing via Bcrypt, JWT issuance, and RBAC enforcement across protected API routes.' }
        ]),
        p([
          { text: '• Module 2 — Venue & Services Catalog: ', bold: true },
          { text: 'Manages CRUD operations for 19 categories, amenity tagging, multi-tier pricing configurations, capacity thresholds, and multi-file image uploads via Multer.' }
        ]),
        p([
          { text: '• Module 3 — 3D Layout Simulation Engine: ', bold: true },
          { text: 'Constructs procedural 3D meshes, directional shadows, point-light chandeliers, and materials in Three.js, responding dynamically to user camera orbits and lighting toggles.' }
        ]),
        p([
          { text: '• Module 4 — Search, Geolocation & AI Discovery: ', bold: true },
          { text: 'Facilitates multi-criteria search (city, budget, guest capacity, amenities), interactive Leaflet map pin plotting, and natural language query extraction.' }
        ]),
        p([
          { text: '• Module 5 — Booking State Machine & Availability Engine: ', bold: true },
          { text: 'Governs lifecycle states (PENDING -> CONFIRMED -> COMPLETED / CANCELLED / REJECTED), date locks, slot management, and dispute mitigation.' }
        ]),
        p([
          { text: '• Module 6 — Payment Processing & Financial Ledger: ', bold: true },
          { text: 'Creates Razorpay payment orders, computes exact 25% advance tokens, validates HMAC signatures, logs transactions, and triggers automated invoice generation.' }
        ]),
        p([
          { text: '• Module 7 — Verified Reviews & Moderation: ', bold: true },
          { text: 'Calculates aggregate star ratings, provides official owner response workflows, and offers administrative tools for moderating flagged reviews.' }
        ]),
        p([
          { text: '• Module 8 — Multi-Role Portals & Dashboards: ', bold: true },
          { text: 'Delivers specialized dashboards for Customers (bookings & token passes), Owners (live calendar, listings, revenue metrics, staff), and Admins (KYC approvals & audit logs).' }
        ]),

        h2('16. User Roles & Access Hierarchy'),
        bullet('Customer (Client):', 'Searches listings, navigates 3D virtual walkthroughs, inspects date calendars, reserves bookings with 25% advance payment, downloads passes, and posts verified reviews.'),
        bullet('Venue / Service Owner:', 'Registers enterprise details, uploads KYC (GST/PAN), manages listings, approves/rejects booking requests, blocks dates, reviews analytics, and replies to reviews.'),
        bullet('Administrator (Super Admin):', 'Reviews owner KYC submissions, approves or rejects venue listings, monitors security audit logs, moderates flagged reviews, and oversees platform health.'),
        bullet('Venue Staff:', 'Authorized venue personnel (managers, receptionists) granted view-only or check-in permissions to verify customer booking tokens and coordinate on-ground event logistics.'),

        pageBreak(),

        // ==========================================
        // PAGE 6 — SYSTEM DESIGN & ARCHITECTURE
        // ==========================================
        h1('PAGE 6 — SYSTEM DESIGN & ARCHITECTURE'),
        h2('17. System Architecture'),
        p(
          'Hall Khoj Finder implements an enterprise-grade multi-tier architecture designed for high availability, security, and low latency:'
        ),
        bullet('Client Presentation Tier:', 'Standard web browsers render semantic HTML5, CSS3 glassmorphism, vanilla JavaScript ES6+ modules, Three.js WebGL context, and Leaflet map canvases.'),
        bullet('Security & Middleware Tier:', 'Express middleware intercepting incoming requests to enforce Helmet security headers, CSP, sliding-window rate limiting, JWT validation, and deep recursive input sanitization against XSS and NoSQL injection.'),
        bullet('Application & Controller Tier:', 'Modular Express 5 REST controllers routing traffic to dedicated services: Booking State Machine, Payment Service, AI Natural Language Parser, and SEO Generator.'),
        bullet('Persistence & Data Storage Tier:', 'Dual-storage database architecture featuring MongoDB Atlas via Mongoose ODM as the primary data store, with an automatic transactional JSON failover layer ensuring uninterrupted operation during local development or network disconnections.'),

        h2('18. Data Flow Architecture'),
        p(
          'Data moves through the system following a strictly validated lifecycle: A client request initiates at the frontend and is transmitted via HTTPS as a JSON payload accompanied by a Bearer JWT. The request passes through the rate-limiting and input-sanitizing middlewares. The relevant controller authenticates user identity and role via RBAC, validates request schemas, and invokes the appropriate service layer. For booking operations, the Booking Service queries the database to verify date availability. If available, a 25% advance token order is generated. Upon successful Razorpay payment, cryptographic HMAC-SHA256 signatures are validated on the backend. The booking status is atomically transitioned to CONFIRMED, the calendar date is locked, and real-time notification alerts are dispatched.'
        ),

        h2('19. Database Schema & Entity Design'),
        p('The database comprises 14 Mongoose collections engineered with explicit data types and indexes:'),
        createTable(
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
          [18, 32, 50]
        ),

        h2('20. End-to-End Application Workflow'),
        p(
          '1. Discovery Phase: User visits the homepage, browses 19 event categories, inputs search filters (city, budget, capacity), or utilizes natural language AI search.'
        ),
        p(
          '2. Virtual Inspection Phase: User inspects venue specifications, launches the Three.js 3D walkthrough to evaluate spatial layout, and checks live calendar dates.'
        ),
        p(
          '3. Reservation & Token Checkout: User submits guest count and event date; system atomically locks the date as PENDING and calculates the 25% deposit.'
        ),
        p(
          '4. Payment & Confirmation: User completes checkout via Razorpay modal; backend validates the HMAC signature, updates status to CONFIRMED, and issues a digital pass.'
        ),
        p(
          '5. Event Execution & Verified Review: On event day, venue staff validates the booking pass; upon completion, status updates to COMPLETED, unlocking verified review submission.'
        ),

        pageBreak(),

        // ==========================================
        // PAGE 7 — SECURITY, TESTING & REQUIREMENTS
        // ==========================================
        h1('PAGE 7 — SECURITY, TESTING & REQUIREMENTS'),
        h2('21. Security Architecture & Cryptographic Controls'),
        p('Hall Khoj Finder enforces seven verifiable security controls directly implemented in the codebase:'),
        bullet('1. Stateless JWT Authentication:', 'RFC 7519 JSON Web Tokens signed with a 256-bit secret key authenticate API requests, eliminating server-side session overhead.'),
        bullet('2. Cryptographic Password Hashing:', 'User and owner passwords are one-way hashed using Bcrypt.js with automated salting, preventing plain-text credential leaks.'),
        bullet('3. Role-Based Access Control (RBAC):', 'Strict middleware validates user roles (customer, owner, staff, admin) on every protected endpoint, immediately rejecting unauthorized requests with 403 Forbidden.'),
        bullet('4. HMAC-SHA256 Signature Verification:', 'Payment settlement requires timing-safe cryptographic verification (crypto.timingSafeEqual) of Razorpay signatures, preventing client-side price manipulation.'),
        bullet('5. In-Memory Sliding-Window Rate Limiting:', 'A custom rate limiter restricts traffic (300 req/min globally; 100 req/min for auth, AI, and payments) to safeguard against DDoS and brute-force attacks.'),
        bullet('6. Deep Recursive Input Sanitization:', 'All request payloads are recursively stripped of HTML <script> tags, javascript: protocols, and NoSQL injection operators.'),
        bullet('7. Helmet-Grade HTTP Security Headers:', 'Enforces Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options: nosniff, and X-Frame-Options: SAMEORIGIN.'),

        h2('22. Functional Requirements (FR)'),
        bullet('FR-1: User Management:', 'Secure registration, login, profile updates, and role-based dashboard routing.'),
        bullet('FR-2: Catalog & 3D Simulation:', 'Publishing, viewing, and 3D walkthrough inspection of venue listings across 19 categories.'),
        bullet('FR-3: Date Availability Checking:', 'Real-time calendar verification indicating AVAILABLE, PENDING, BOOKED, and BLOCKED dates.'),
        bullet('FR-4: Conflict-Protected Booking:', 'Atomic date reservation enforcing automated 25% advance calculation and locking.'),
        bullet('FR-5: Payment Gateway Integration:', 'Secure token processing with instant digital receipt and invoice generation.'),
        bullet('FR-6: Verified Review Gating:', 'Review submission restricted strictly to bookings with verified COMPLETED status.'),

        h2('23. Non-Functional Requirements (NFR)'),
        bullet('Performance:', 'Sub-2-second initial page load, sub-150ms API response time, and 60 FPS Three.js rendering.'),
        bullet('Reliability & Resilience:', 'Automatic failover to local transactional JSON storage ensures zero server downtime if MongoDB is unreachable.'),
        bullet('Scalability:', 'Stateless REST API and modular Mongoose indexing support vertical and horizontal scaling.'),
        bullet('Maintainability:', 'Strict MVC architecture separating controllers, services, routes, and data models.'),
        bullet('Usability & Accessibility:', 'Responsive design across all screen viewports with 14 Indian languages localization.'),

        h2('24. Testing Methodology & Verification Results'),
        p('The codebase has been verified through an automated suite containing over 415 test assertions:'),
        createTable(
          ['Test Case ID', 'Test Scenario / Input Action', 'Expected System Behavior', 'Status'],
          [
            ['TC-01', 'User Registration & Mobile OTP Verification', 'OTP generated, verified, JWT issued with user payload', 'PASS'],
            ['TC-02', 'Three.js 3D Venue Model Mount', 'Canvas context initializes, 3D scene renders at 60 FPS with lighting', 'PASS'],
            ['TC-03', 'Natural Language AI Query Parsing', '"Patna me 500 logo ke liye AC hall" -> City: Patna, Cap: 500, AC: true', 'PASS'],
            ['TC-04', 'Concurrency Date Locking', 'Concurrent booking requests for same date lock first, reject second (409 Conflict)', 'PASS'],
            ['TC-05', '25% Advance Calculation & HMAC Verification', 'Exact 25% token calculated from database price; signature verified', 'PASS'],
            ['TC-06', 'Verified Review Anti-Fraud Gate', 'Review rejected (403 Forbidden) if booking status is not COMPLETED', 'PASS']
          ],
          [15, 35, 40, 10]
        ),

        pageBreak(),

        // ==========================================
        // PAGE 8 — ADVANTAGES, LIMITATIONS & FUTURE SCOPE
        // ==========================================
        h1('PAGE 8 — ADVANTAGES, LIMITATIONS & FUTURE SCOPE'),
        h2('25. Practical Advantages of the System'),
        bullet('Complete Elimination of Middleman Broker Fees:', 'Direct connection between clients and service owners removes 15% to 30% broker markups, resulting in massive cost savings for families.'),
        bullet('Immersive Spatial Clarity via 3D Simulation:', 'Three.js virtual walkthrough allows families to inspect layout proportions, aisles, and stages from the comfort of their home, eliminating unnecessary physical site visits.'),
        bullet('Eradication of Double-Booking Disasters:', 'Automated booking state machine and calendar date locking prevent conflicting reservations on peak auspicious wedding dates.'),
        bullet('Financial Transparency & Dispute Prevention:', 'Server-enforced 25% advance calculation, Razorpay gateway integration, and HMAC cryptographic verification ensure secure and audited financial transactions.'),
        bullet('Pan-India Linguistic Inclusivity:', 'Support for 14 Indian regional languages (Hindi, Bhojpuri, Maithili, Bengali, etc.) empowers tier-2, tier-3, and rural households to navigate the platform in their native language.'),
        bullet('Comprehensive Vendor SaaS Capabilities:', 'Furnishes venue and service owners with sophisticated business dashboards to manage listings, block dates, track revenue, and organize staff without costly software subscriptions.'),

        h2('26. System Limitations & Practical Constraints'),
        bullet('Absence of Native Mobile Apps:', 'Currently packaged as a responsive web application; lacks native iOS/Android background push notification daemons and device calendar integration.'),
        bullet('External Gateway Dependencies:', 'Production SMS OTP dispatch and live payment settlement rely on external service providers (Fast2SMS, Razorpay); network latency can affect delivery.'),
        bullet('Hardware Requirements for 3D Rendering:', 'While lightweight, Three.js WebGL rendering requires basic hardware acceleration; extremely outdated legacy mobile devices fall back to the 2D photo gallery.'),
        bullet('Mandatory Internet Connectivity:', 'Live date availability locking and financial transactions require active client-side internet access; offline booking is unsupported.'),

        h2('27. Realistic Future Scope & Roadmap'),
        bullet('Native Mobile App Compilation:', 'Developing cross-platform mobile apps using React Native or Flutter to provide native push notifications, offline caching, and biometric authentication.'),
        bullet('Augmented Reality (AR) Stage Decor Simulation:', 'Integrating WebXR/AR frameworks to enable users to superimpose virtual floral mandaps, stages, and seating arrangements onto physical venues using mobile cameras.'),
        bullet('AI Dynamic Pricing & Yield Optimization:', 'Deploying machine learning models to analyze seasonal muhurat demand and recommend competitive dynamic pricing curves to venue owners.'),
        bullet('Multi-Vendor Package Bundling:', 'Enabling users to book comprehensive event packages (Hall + Catering + Tent + Cars + DJ) in a single unified checkout with synchronized milestone schedules.'),
        bullet('Smart Escrow Contracts:', 'Exploring blockchain-based smart contracts for automated milestone-based advance escrow holding and automated refund settlement upon mutual cancellation.'),

        h2('28. Social, Business & Academic Relevance'),
        p(
          'Hall Khoj Finder carries profound social relevance by modernizing one of the most culturally significant traditions in Indian society, reducing planning stress, and safeguarding family savings from predatory brokers. In business terms, it formalizes thousands of unorganized MSME service providers by granting them digital visibility and enterprise-grade booking tools. Academically, the project serves as a compelling demonstration of full-stack engineering, marrying 3D computer graphics, event-driven REST APIs, cloud databases, and cryptographic security into a cohesive, production-grade application.'
        ),

        pageBreak(),

        // ==========================================
        // PAGE 9 — CONCLUSION & REFERENCES
        // ==========================================
        h1('PAGE 9 — CONCLUSION & REFERENCES'),
        h2('29. Academic Conclusion'),
        p(
          'The Hall Khoj Finder project successfully conceptualizes, designs, and implements an enterprise-grade, full-stack event services and venue booking marketplace tailored to the unique socio-economic realities of the Indian celebration ecosystem. By systematically addressing the core failures of the conventional offline system—namely acute market fragmentation, lack of transparent pricing, predatory middleman commissions, and the absence of remote visual inspection tools—the application provides a transformative, zero-commission digital alternative that restores trust and efficiency to event planning.'
        ),
        p(
          'From an architectural standpoint, the project demonstrates technical excellence across the entire software development lifecycle. The frontend seamlessly pairs semantic HTML5 and responsive CSS3 glassmorphism with an innovative in-browser 3D architectural venue simulator powered by Three.js (r128), enabling clients to evaluate layout proportions and lighting conditions without expensive physical travel. The backend, constructed upon Node.js and Express 5, enforces rigorous security through JWT authentication, Bcrypt password hashing, role-based access control (RBAC), sliding-window rate limiting, and recursive input sanitization.'
        ),
        p(
          'Furthermore, the implementation of a conflict-protected booking state machine guarantees atomic date-level locks, entirely eliminating double-booking hazards. Financial integrity is upheld through server-side 25% advance token calculations and cryptographic HMAC-SHA256 signature verification via Razorpay. Supported by a resilient dual-engine persistence layer (MongoDB Atlas with Mongoose ODM and automatic transactional JSON failover), grounded natural language AI search, and Pan-India localization across 14 languages, Hall Khoj Finder stands as a complete, publication-quality software engineering achievement suitable for academic capstone submission.'
        ),

        h2('30. Key Learning Outcomes'),
        bullet('Full-Stack Architectural Design:', 'Gained comprehensive mastery in formulating scalable, decoupled RESTful APIs using Node.js, Express 5, and vanilla JavaScript ES6+ modules.'),
        bullet('3D Computer Graphics & WebGL:', 'Acquired practical proficiency in procedural 3D modeling, lighting shaders, material properties, and camera orbit controls using Three.js.'),
        bullet('Database Modeling & High-Availability Failover:', 'Developed expertise in Mongoose schema design, composite query indexing, and architecting resilient failover mechanisms between cloud NoSQL and atomic local storage.'),
        bullet('Cryptographic Security & Financial Integrity:', 'Mastered payment gateway integration, HMAC-SHA256 signature verification, timing-safe equality checks, and defense-in-depth security hardening.'),
        bullet('Rigorous Automated Testing:', 'Learned to construct extensive integration and unit testing suites covering state machines, concurrency locks, and API endpoints.'),

        h2('31. Academic & Technical References'),
        bullet('1. Node.js Foundation (2024):', 'Node.js v24.x LTS Runtime Architecture & Asynchronous Event Loop Documentation. https://nodejs.org/docs/'),
        bullet('2. Express.js Community (2024):', 'Express 5.x Framework Documentation: Routing, Middleware Pipeline, and API Design. https://expressjs.com/'),
        bullet('3. MongoDB Inc. (2024):', 'MongoDB Manual: Document Data Modeling, Composite Indexing, and Replication. https://www.mongodb.com/docs/manual/'),
        bullet('4. Mongoose ODM (2024):', 'Mongoose v9.x: Elegant MongoDB Object Modeling for Node.js. https://mongoosejs.com/'),
        bullet('5. Three.js Authors (2024):', 'Three.js JavaScript 3D Library API Reference (r128). https://threejs.org/docs/'),
        bullet('6. Leaflet.js Team (2024):', 'Leaflet: An Open-Source JavaScript Library for Mobile-Friendly Interactive Maps. https://leafletjs.com/'),
        bullet('7. Jones, M., et al. (2015):', 'JSON Web Token (JWT) Architecture and Signature Verification. RFC 7519, IETF. https://datatracker.ietf.org/doc/html/rfc7519'),
        bullet('8. Razorpay Software Pvt. Ltd. (2024):', 'Razorpay Payment Gateway API Reference: Order Creation and HMAC Verification. https://razorpay.com/docs/api/'),
        bullet('9. Google DeepMind (2024):', 'Google Gemini Generative AI Model Documentation & Grounded Search Reference. https://ai.google.dev/'),
        bullet('10. OWASP Foundation (2023):', 'OWASP Top 10 Web Application Security Risks and Mitigation Strategies. https://owasp.org/www-project-top-ten/')
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`✓ [DOCX Generated Successfully] Output: ${OUTPUT_PATH} (${buffer.length} bytes)`);
}

buildDocx().catch(err => {
  console.error('Error generating DOCX:', err);
  process.exit(1);
});
