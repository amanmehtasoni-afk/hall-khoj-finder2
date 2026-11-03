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
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  ImageRun,
  PageBreak,
  Footer,
  PageNumber,
  ShadingType
} = require('docx');

const FONT_FAMILY = 'Times New Roman';
const PRIMARY_COLOR = '1E3A8A'; // Deep Navy Blue for clean headings
const TEXT_COLOR = '111827'; // Dark charcoal for high contrast
const HEADER_BG = 'F1F5F9'; // Soft slate gray for table headers
const BORDER_COLOR = '94A3B8';

const tableBorder = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: BORDER_COLOR,
};

const cellBorders = {
  top: tableBorder,
  bottom: tableBorder,
  left: tableBorder,
  right: tableBorder,
};

function p(text = '', opts = {}) {
  const {
    bold = false,
    italic = false,
    size = 24, // 12pt (docx size is half-points)
    color = TEXT_COLOR,
    align = AlignmentType.LEFT,
    spaceBefore = 100,
    spaceAfter = 100,
    lineSpacing = 280,
    bullet = false,
    underline = false,
  } = opts;

  const runOpts = {
    font: FONT_FAMILY,
    text,
    bold,
    italic,
    size,
    color,
    underline: underline ? {} : undefined,
  };

  const pOpts = {
    alignment: align,
    spacing: {
      before: spaceBefore,
      after: spaceAfter,
      line: lineSpacing,
    },
    children: [new TextRun(runOpts)],
  };

  if (bullet) {
    pOpts.bullet = { level: 0 };
  }

  return new Paragraph(pOpts);
}

function multiRunP(runs = [], opts = {}) {
  const {
    align = AlignmentType.LEFT,
    spaceBefore = 100,
    spaceAfter = 100,
    lineSpacing = 280,
    bullet = false,
  } = opts;

  const children = runs.map(r => new TextRun({
    font: FONT_FAMILY,
    text: r.text || '',
    bold: !!r.bold,
    italic: !!r.italic,
    size: r.size || 24,
    color: r.color || TEXT_COLOR,
    underline: r.underline ? {} : undefined,
  }));

  const pOpts = {
    alignment: align,
    spacing: {
      before: spaceBefore,
      after: spaceAfter,
      line: lineSpacing,
    },
    children,
  };

  if (bullet) {
    pOpts.bullet = { level: 0 };
  }

  return new Paragraph(pOpts);
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 280, after: 180, line: 300 },
    children: [
      new TextRun({
        font: FONT_FAMILY,
        text,
        bold: true,
        size: 32, // 16pt
        color: PRIMARY_COLOR,
        underline: {},
      }),
    ],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 240, after: 120, line: 280 },
    children: [
      new TextRun({
        font: FONT_FAMILY,
        text,
        bold: true,
        size: 28, // 14pt
        color: PRIMARY_COLOR,
      }),
    ],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 80, line: 260 },
    children: [
      new TextRun({
        font: FONT_FAMILY,
        text,
        bold: true,
        size: 26, // 13pt
        color: '0F172A',
      }),
    ],
  });
}

function createTable(headers, rows, colWidths = []) {
  const tableRows = [];

  // Header row
  const headerCells = headers.map((h, i) => new TableCell({
    width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
    borders: cellBorders,
    shading: { fill: HEADER_BG, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            font: FONT_FAMILY,
            text: h,
            bold: true,
            size: 22,
            color: '0F172A',
          }),
        ],
      }),
    ],
  }));

  tableRows.push(new TableRow({ children: headerCells }));

  // Data rows
  rows.forEach((row, rIdx) => {
    const dataCells = row.map((cellText, i) => new TableCell({
      width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
      borders: cellBorders,
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { line: 240 },
          children: [
            new TextRun({
              font: FONT_FAMILY,
              text: cellText,
              size: 22,
              color: TEXT_COLOR,
            }),
          ],
        }),
      ],
    }));

    tableRows.push(new TableRow({ children: dataCells }));
  });

  return new Table({
    width: { size: 9360, type: WidthType.DXA }, // 6.5 inches (printable area with 1-inch margins)
    rows: tableRows,
  });
}

async function buildDoc() {
  const logoPath = path.resolve('scratch/kcet_logo.png');
  let logoData = null;
  if (fs.existsSync(logoPath)) {
    logoData = fs.readFileSync(logoPath);
  }

  const docChildren = [];

  // ==========================================
  // PAGE 1: TITLE / COVER PAGE
  // ==========================================
  docChildren.push(
    p('Khalsa College Of Engineering & Technology, Amritsar', {
      bold: true,
      size: 32, // 16pt
      align: AlignmentType.CENTER,
      spaceBefore: 100,
      spaceAfter: 160,
    })
  );

  if (logoData) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 180 },
        children: [
          new ImageRun({
            data: logoData,
            transformation: {
              width: 140,
              height: 140,
            },
          }),
        ],
      })
    );
  } else {
    docChildren.push(p('[College Emblem]', { align: AlignmentType.CENTER, italic: true }));
  }

  docChildren.push(
    p('Department of Computer Applications', {
      bold: true,
      size: 28, // 14pt
      align: AlignmentType.CENTER,
      underline: true,
      spaceBefore: 120,
      spaceAfter: 200,
    }),
    p('PROJECT SYNOPSIS', {
      bold: true,
      size: 30, // 15pt
      align: AlignmentType.CENTER,
      spaceBefore: 100,
      spaceAfter: 120,
    }),
    p('“Hall Khoj Finder”', {
      bold: true,
      size: 36, // 18pt
      align: AlignmentType.CENTER,
      color: PRIMARY_COLOR,
      spaceBefore: 100,
      spaceAfter: 80,
    }),
    p('(Online 3D Event Services & Venue Booking Web Application)', {
      italic: true,
      size: 24, // 12pt
      align: AlignmentType.CENTER,
      spaceBefore: 0,
      spaceAfter: 360,
    })
  );

  // Two-column layout for Submitted To / Submitted By
  const submissionTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('Submitted To:', { bold: true, size: 26, spaceBefore: 0, spaceAfter: 100, underline: true }),
              p('Er. Sukhmeet Kaur', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 40 }),
              p('Mr. Jagdeep Singh', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 40 }),
              p('Ms. Shobhna Sharma', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 40 }),
              p('Ms. Krishma Mahajan', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 40 }),
            ],
          }),
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('Submitted By:', { bold: true, size: 26, spaceBefore: 0, spaceAfter: 100, underline: true }),
              p('Aman Kumar', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 20 }),
              p('Roll No. : ________', { size: 22, spaceBefore: 0, spaceAfter: 80 }),
              p('Manish Kumar', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 20 }),
              p('Roll No. : ________', { size: 22, spaceBefore: 0, spaceAfter: 80 }),
              p('Branch : BCA', { bold: true, size: 24, spaceBefore: 40, spaceAfter: 20 }),
              p('Sem : 5TH', { bold: true, size: 24, spaceBefore: 20, spaceAfter: 20 }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(submissionTable);
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PAGE 2: CERTIFICATE
  // ==========================================
  docChildren.push(
    h1('CERTIFICATE'),
    p('“Hall Khoj Finder”', {
      bold: true,
      size: 28,
      align: AlignmentType.CENTER,
      spaceBefore: 120,
      spaceAfter: 260,
    }),
    p(
      'This is to certify that the project titled “Hall Khoj Finder” is a Bonafide work carried out by Aman Kumar (Roll No : ________) and Manish Kumar (Roll No : ________) students of Bachelor of Computer Applications (BCA), in partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) at Khalsa College of Engineering & Technology, Amritsar.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 100, spaceAfter: 180, lineSpacing: 340 }
    ),
    p(
      'This project is the result of the students’ own work and has not been submitted for any other degree or diploma.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 100, spaceAfter: 360, lineSpacing: 340 }
    )
  );

  const certGuidesTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('Project Guides:', { bold: true, size: 24, spaceBefore: 0, spaceAfter: 80, underline: true }),
              p('1. Mr. Jagdeep Singh', { size: 24, spaceBefore: 40, spaceAfter: 40 }),
              p('2. Ms. Shobhna Sharma', { size: 24, spaceBefore: 40, spaceAfter: 40 }),
              p('3. Ms. Krishma Mahajan', { size: 24, spaceBefore: 40, spaceAfter: 40 }),
            ],
          }),
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('Submitted To:', { bold: true, size: 24, spaceBefore: 0, spaceAfter: 80, underline: true }),
              p('1. Er. Sukhmeet Kaur', { size: 24, spaceBefore: 40, spaceAfter: 40 }),
              p('2. Er. Shivani Mahajan', { size: 24, spaceBefore: 40, spaceAfter: 40 }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(certGuidesTable);
  docChildren.push(p('', { spaceBefore: 300, spaceAfter: 100 }));

  const certFooterTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('Place: Amritsar', { size: 24, spaceBefore: 0, spaceAfter: 40 }),
              p('Date: ____________', { size: 24, spaceBefore: 40, spaceAfter: 0 }),
            ],
          }),
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('______________________', { align: AlignmentType.RIGHT, size: 24, spaceBefore: 0, spaceAfter: 40 }),
              p('HEAD OF DEPARTMENT', { bold: true, align: AlignmentType.RIGHT, size: 24, spaceBefore: 40, spaceAfter: 0 }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(certFooterTable);
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PAGE 3: ACKNOWLEDGEMENT
  // ==========================================
  docChildren.push(
    h1('Acknowledgement'),
    p(
      'It gives us immense pleasure to present our major project on “Hall Khoj Finder” (Online 3D Event Services & Venue Booking Web Application). It has been a rewarding process of extensive learning, architectural design, and dedicated software development.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 160, spaceAfter: 160, lineSpacing: 340 }
    ),
    p(
      'We express our deep gratitude and heartfelt thanks to our respected teachers, who served as an enduring source of inspiration and guidance, helping us surmount every technical obstacle on our way to the successful completion of this challenging work.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 120, spaceAfter: 160, lineSpacing: 340 }
    ),
    p(
      'We express our sincere thanks and profound gratitude to our project coordinators Mr. Jagdeep Singh, Ms. Shobhna Sharma, and Ms. Krishma Mahajan for their continuous advice, constructive feedback, and valuable technical guidance throughout the project lifecycle.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 120, spaceAfter: 160, lineSpacing: 340 }
    ),
    p(
      'We express our sincere thanks and gratitude to the Head of Department (Computer Applications) Er. Sukhmeet Kaur for her constant encouragement, problem-solving mentorship, and supportive environment. Without her kind support, this project would not have been possible.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 120, spaceAfter: 160, lineSpacing: 340 }
    ),
    p(
      'Lastly, we warmly thank our classmates and families for their unwavering encouragement, enthusiasm, and timely support during this academic year 2025–26.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 120, spaceAfter: 300, lineSpacing: 340 }
    )
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PAGE 4: DECLARATION
  // ==========================================
  docChildren.push(
    h1('Declaration'),
    p(
      'We hereby declare that the project work entitled “Hall Khoj Finder” is based on our original work carried out during the course of our study under the esteemed supervision of Mr. Jagdeep Singh, Ms. Shobhna Sharma, and Ms. Krishma Mahajan.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 160, spaceAfter: 160, lineSpacing: 340 }
    ),
    p(
      'We assert that the statements made, technical implementations described, and conclusions drawn are the genuine outcome of our project development work. We further declare that to the best of our knowledge and belief, this report contains our original work and all ideas, algorithms, packages, and technical references have been duly acknowledged.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 120, spaceAfter: 360, lineSpacing: 340 }
    )
  );

  const declSignTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('Place : Amritsar', { size: 24, spaceBefore: 0, spaceAfter: 40 }),
              p('Date : ____________', { size: 24, spaceBefore: 40, spaceAfter: 0 }),
            ],
          }),
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            children: [
              p('_____________________________', { align: AlignmentType.RIGHT, size: 24, spaceBefore: 0, spaceAfter: 40 }),
              p('(Signatures of Candidates)', { italic: true, align: AlignmentType.RIGHT, size: 22, spaceBefore: 0, spaceAfter: 80 }),
              p('1. Aman Kumar', { bold: true, align: AlignmentType.RIGHT, size: 24, spaceBefore: 20, spaceAfter: 10 }),
              p('Roll No. : ________', { align: AlignmentType.RIGHT, size: 22, spaceBefore: 0, spaceAfter: 60 }),
              p('2. Manish Kumar', { bold: true, align: AlignmentType.RIGHT, size: 24, spaceBefore: 20, spaceAfter: 10 }),
              p('Roll No. : ________', { align: AlignmentType.RIGHT, size: 22, spaceBefore: 0, spaceAfter: 0 }),
            ],
          }),
        ],
      }),
    ],
  });

  docChildren.push(declSignTable);
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // PAGE 5: INDEX / TABLE OF CONTENTS
  // ==========================================
  docChildren.push(
    h1('Index'),
    p('(Table of Contents)', {
      italic: true,
      size: 22,
      align: AlignmentType.CENTER,
      spaceBefore: 40,
      spaceAfter: 180,
    })
  );

  const indexHeaders = ['Sr. No.', 'Title', 'Page Numbers'];
  const indexRows = [
    ['1', 'Introduction', '6'],
    ['2', 'Objective of the Project', '7'],
    ['3', 'Problem Statement', '8'],
    ['4', 'Proposed System / Scope', '9'],
    ['5', 'Technology Stack', '12'],
    ['6', 'System Requirements', '14'],
    ['7', 'Future Scope', '17'],
    ['8', 'References', '18'],
  ];

  docChildren.push(createTable(indexHeaders, indexRows, [1400, 6360, 1600]));
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 1: INTRODUCTION
  // ==========================================
  docChildren.push(
    h1('1. Introduction'),
    h2('Hall Khoj Finder — 3D Event Services & Venue Booking Platform'),
    p(
      'In Indian culture, weddings, receptions, anniversaries, and corporate celebrations represent momentous social and family milestones. Planning an event in India typically requires coordinating dozens of independent service providers: discovering an auspicious marriage palace or banquet hall, securing luxury wedding cars, engaging tent house fabricators for German hangars, hiring professional caterers, contracting theme decorators, and booking sound systems, DJs, and drone photographers. Historically, this INR 4,00,000+ Crore ($50 Billion) celebration ecosystem has remained deeply fragmented, unorganized, and heavily dependent on informal word-of-mouth recommendations, physical travel, and paper desk registers.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 120, lineSpacing: 300 }
    ),
    p(
      'Customers face severe pain points in the offline paradigm: spending days travelling through dense urban traffic to inspect venues, dealing with unregulated middleman brokers who inflate pricing by 15% to 30%, and confronting recurring double-booking hazards on peak auspicious wedding dates (muhurats). On the other side, local MSME venue and service owners struggle with seasonal revenue fluctuations, manual paper-based scheduling, and the lack of digital tools to showcase their facilities directly to prospective clients.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 120, lineSpacing: 300 }
    ),
    p(
      'Hall Khoj Finder is an enterprise-ready, full-stack event services marketplace engineered specifically to solve these foundational challenges. The platform presents itself under the slogan: “Apne Paas Ka Hall, Tent, Car Aur Event Services Ek Jagah Khojiye”. It establishes a transparent, commission-free digital bridge where celebrating families can discover verified service providers across 19 categories, inspect venues through interactive 3D virtual walkthroughs, verify date availability on live synchronized calendars, and complete reservations with a server-enforced 25% advance token payment.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    h2('Architecture & Core Technological Pillars'),
    p(
      'Hall Khoj Finder is built on a modern, decoupled multi-tier architecture:',
      { size: 24, spaceBefore: 60, spaceAfter: 80 }
    ),
    p('• Presentation Tier (Frontend): A mobile-responsive web client constructed using semantic HTML5, modern CSS3 glassmorphism (custom backdrop-blur styling), modular vanilla JavaScript (ES6+), and Three.js (r128 WebGL) for real-time 3D spatial simulation.', { size: 24, spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    p('• Application Tier (Backend): A robust RESTful API built on Node.js and Express.js (v5.2.1) enforcing modular controller-service separation, JWT authentication, Bcrypt password hashing, sliding-window rate limiting, and HMAC-SHA256 signature verification.', { size: 24, spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    p('• Data Persistence Tier: A hybrid dual-storage architecture featuring MongoDB Atlas with Mongoose ODM as the primary high-concurrency database, backed by an automated local transactional JSON failover engine ensuring 100% server uptime even in offline or disconnected states.', { size: 24, spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    p('• Pan-India Localization (i18n): Native multilingual translation engine supporting 14 Indian languages (Hindi, English, Bhojpuri, Maithili, Punjabi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu RTL, Kannada, Odia, and Malayalam).', { size: 24, spaceBefore: 40, spaceAfter: 160, lineSpacing: 280, bullet: true }),
    h2('Supported Stakeholder Roles'),
    p('The system delivers specialized interfaces tailored to four key user roles:', { size: 24, spaceBefore: 60, spaceAfter: 80 }),
    p('1. Customers: Browse 19 categories, explore 3D venue layouts, query live calendar dates, reserve bookings with a 25% deposit, and submit verified reviews upon event completion.', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('2. Venue & Service Owners: Access the Owner Portal to register businesses, upload KYC (GST/PAN), manage listings, block calendar dates, approve/reject bookings, and track analytics.', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('3. Administrators (Super Admin): Access the Admin Dashboard to verify owner KYC, audit listings, monitor platform transactions, and inspect security audit logs.', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('4. Venue Staff: Authorized operational staff (managers, receptionists) who scan and validate digital customer booking passes on the day of the celebration.', { size: 24, spaceBefore: 40, spaceAfter: 140, bullet: true })
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 2: OBJECTIVE OF THE PROJECT
  // ==========================================
  docChildren.push(
    h1('2. Objective of the Project'),
    p(
      'The overarching objective of the Hall Khoj Finder project is to design, implement, and deploy an enterprise-grade, full-stack 3D event marketplace that digitizes and unifies the disorganized Indian wedding and celebration sector. The platform replaces opaque paper-based workflows with a transparent, visually rich, and cryptographically verified digital alternative.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    h2('General Objectives'),
    p('• Unified Marketplace Discovery: To engineer a single-window marketplace aggregating 19 distinct event service domains (marriage palaces, banquet halls, tent houses, wedding cars, catering, floral decor, DJ systems, and photography).', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('• Remote Spatial Inspection via 3D Simulation: To develop an in-browser 3D architectural simulator using Three.js (WebGL), allowing families to examine venue layouts, aisles, chandeliers, stages, and dining areas without physical travel.', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('• Eradication of Double-Booking: To build a conflict-protected booking state machine enforcing atomic date-level locks, eliminating double-booking hazards on peak wedding dates (muhurats).', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('• Financial Transparency & Advance Security: To implement a server-side 25% advance token payment pipeline integrated with Razorpay and verified via HMAC-SHA256 cryptographic signatures.', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('• Eradication of Parasitic Brokerage: To connect celebrating families directly with verified venue owners, cutting out 15% to 30% middleman commissions.', { size: 24, spaceBefore: 40, spaceAfter: 60, bullet: true }),
    p('• Multilingual Inclusivity: To support 14 Indian languages with persistent storage and RTL layout support, democratizing access for regional and rural users.', { size: 24, spaceBefore: 40, spaceAfter: 140, bullet: true }),
    h2('Key Features & Functionalities'),
    p('• 3D Interactive Venue Walkthrough: Three.js WebGL scene with 360° OrbitControls and 3 dynamic lighting modes: Daylight, Sunset, and Night Gala, backed by an automated 2D photo gallery fallback.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Real-Time Date Availability Calendar: Interactive calendar showing live day-by-day availability statuses: AVAILABLE (Green), PENDING (Yellow), BOOKED (Red), and BLOCKED (Black).', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Server-Calculated 25% Advance Booking: Mandatory 25% deposit computed strictly from database prices on the backend to prevent client-side price tampering.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Razorpay Payment Integration: Seamless multi-channel payment gateway supporting UPI (GPay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking with cryptographic signature verification.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Grounded AI Natural Language Search: Intelligent query parser interpreting colloquial Hindi, Hinglish, and English queries (e.g. “Patna me 500 logo ke liye AC hall”) strictly grounded in verified database listings.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• 100% Anti-Fraud Verified Reviews: Star ratings and reviews strictly restricted to customers possessing a verified COMPLETED booking ID.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Role-Based Access Control (RBAC): Distinct role dashboards for Customers, Venue Owners, Venue Staff, and System Administrators.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Digital PDF Booking Pass Generation: Programmatic generation of branded booking passes and invoices using PDFKit.', { size: 24, spaceBefore: 40, spaceAfter: 120, bullet: true })
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 3: PROBLEM STATEMENT
  // ==========================================
  docChildren.push(
    h1('3. Problem Statement'),
    p(
      'The Indian celebration and event hospitality sector is heavily plagued by systemic inefficiencies, lack of technical infrastructure, and extreme market fragmentation. In the absence of a modern centralized platform, event organizers and celebrating families face severe operational hurdles:',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    h2('Key Identified Problems in Existing System'),
    multiRunP([
      { text: '1. Severe Market Fragmentation: ', bold: true },
      { text: 'Organizing a wedding requires coordinating between separate vendors—banquet halls, caterers, tent houses, flower decorators, luxury cars, and DJs. Each vendor operates as an isolated entity without centralized directory listings, forcing families to make dozens of disjointed phone calls and visits.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
    multiRunP([
      { text: '2. Remote Spatial Visualization Gap: ', bold: true },
      { text: 'Conventional classifieds and social media pages display static, edited 2D photographs with artificial wide-angle lenses. These photos fail to communicate actual room depth, stage height, chandelier placements, or dining capacity. As a result, families must physically travel across cities just to evaluate spatial dimensions.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
    multiRunP([
      { text: '3. Predatory Brokerage & Price Inflation: ', bold: true },
      { text: 'Local middleman brokers and unverified touts control local venue inquiries, routinely adding hidden markups of 15% to 30% on venue rentals, severely exploiting families during urgent auspicious dates (muhurats).' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
    multiRunP([
      { text: '4. Concurrency Failures & Double-Booking Disasters: ', bold: true },
      { text: 'Because dates are tracked in handwritten paper desk diaries or non-synchronized offline spreadsheets, venue staff frequently promise the same date to multiple clients. This leads to disastrous last-minute cancellations and financial disputes.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
    multiRunP([
      { text: '5. Insecure Cash Advances & Lack of Receipts: ', bold: true },
      { text: 'Traditional bookings require large, non-standardized cash advances paid without tamper-proof digital receipts, formal cancellation policies, or financial audit trails.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280 }),
    multiRunP([
      { text: '6. Language and Communication Barriers: ', bold: true },
      { text: 'Most existing platforms operate strictly in English, alienating millions of tier-2, tier-3, and rural Indian families who communicate predominantly in Hindi, Bhojpuri, Maithili, Punjabi, or regional languages.' },
    ], { spaceBefore: 60, spaceAfter: 160, lineSpacing: 280 }),
    h2('Problem Comparison Matrix'),
    p('A direct contrast between the existing manual workflow and the modern digital solution:', { size: 24, spaceBefore: 40, spaceAfter: 80 })
  );

  const probHeaders = ['Failure Dimension', 'Existing Traditional System', 'Hall Khoj Finder Solution'];
  const probRows = [
    ['Vendor Discovery', 'Scattered word-of-mouth & physical visits', 'Unified 19-category single-window marketplace'],
    ['Venue Inspection', 'Manual travel across cities to view halls', 'Interactive 3D Three.js walkthrough (3 lighting modes)'],
    ['Pricing & Brokerage', 'Opaque rates + 15%-30% middleman markups', '100% transparent pricing directly from owners (0% fee)'],
    ['Date Availability', 'Handwritten desk diaries prone to double-booking', 'Atomic real-time calendar locks (AVAILABLE/BOOKED)'],
    ['Payment Security', 'Untracked cash advances without receipts', 'Razorpay 25% advance with HMAC-SHA256 verification'],
    ['Linguistic Access', 'Monolingual English interfaces only', 'Pan-India localization supporting 14 Indian languages'],
  ];

  docChildren.push(createTable(probHeaders, probRows, [2400, 3480, 3480]));
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 4: PROPOSED SYSTEM / SCOPE
  // ==========================================
  docChildren.push(
    h1('4. Proposed System / Scope'),
    p(
      'Hall Khoj Finder completely transforms event planning by introducing a cohesive, high-performance web platform that consolidates discovery, spatial visualization, date-level reservation, secure token payment, and post-event reputation management into an automated digital workflow.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    h2('19 Supported Event Service Categories'),
    p(
      'Hall Khoj Finder provides end-to-end event infrastructure spanning five primary service domains:',
      { size: 24, spaceBefore: 40, spaceAfter: 80 }
    )
  );

  const catHeaders = ['Domain', 'Categories Supported in Hall Khoj Finder'];
  const catRows = [
    ['Venues', 'Marriage Halls, Banquet Halls, Party Lawns, Wedding Resorts, Community Halls'],
    ['Logistics & Structure', 'Tent Houses, German Waterproof Hangars, Luxury Furniture, Lighting & Generators'],
    ['Sound & Entertainment', 'DJ & Sound Systems, Orchestras, Live Stage Bands, Band Baaja & Shehnai'],
    ['Decor & Dining', 'Catering Services (Buffet & Sit-down), Theme Stage Decor, Fresh Flower Decoration'],
    ['Media & Hospitality', 'Drone Photography & Cinematic Videography, Luxury Wedding Cars, Bridal Makeup, Event Staff'],
  ];

  docChildren.push(createTable(catHeaders, catRows, [2600, 6760]));
  docChildren.push(p('', { spaceBefore: 120, spaceAfter: 80 }));

  docChildren.push(
    h2('Core Functional Modules of the Proposed System'),
    multiRunP([
      { text: '1. Authentication & RBAC Module: ', bold: true },
      { text: 'Handles multi-role registration and login for Customers, Venue Owners, and Admins. Implements secure password hashing via Bcrypt.js, stateless session authorization using JSON Web Tokens (JWT), and phone number OTP verification.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '2. 3D Architectural Simulation Engine: ', bold: true },
      { text: 'An interactive WebGL-powered 3D venue layout built on Three.js (r128). Features procedural architectural meshes (grand entrance foyer, central red-carpet aisle, stage with crystal chandeliers, banquet table seating, and dining pavilion). Users can orbit 360°, inspect viewpoints, and toggle between three dynamic time-of-day lighting shaders (Daylight, Sunset, and Night Gala).' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '3. Real-Time Date Availability Calendar: ', bold: true },
      { text: 'A visual day-by-day availability calendar connected directly to the database. Displays synchronized date states: AVAILABLE (open for booking), PENDING (in checkout), BOOKED (confirmed reservation), and BLOCKED (owner blocked date). Prevents concurrent double-booking disputes.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '4. Booking State Machine & 25% Advance Pipeline: ', bold: true },
      { text: 'Enforces an atomic state lifecycle (PENDING → CONFIRMED → COMPLETED / CANCELLED). Computes an exact 25% booking deposit server-side from verified database prices. Integrates with Razorpay API and validates incoming webhook signatures using crypto.timingSafeEqual to prevent client tampering.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '5. Grounded AI Venue Search & Owner Assistant: ', bold: true },
      { text: 'Natural language search engine interpreting Hindi, Hinglish, and English queries (e.g. “Patna me 500 logo ke liye AC hall chahiye 2 lakh me”). The NLP engine extracts city, budget, guest count, and amenities, returning strictly grounded database results without hallucinations.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '6. Anti-Fraud Verified Review System: ', bold: true },
      { text: 'Restricts star ratings and customer feedback strictly to accounts with verified COMPLETED booking IDs. Automatically recalculates aggregate ratings and provides an official public reply workflow for venue owners.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '7. Multi-Portal Architecture: ', bold: true },
      { text: 'Dedicated portals for Customers (discovery, bookings, digital passes), Owners (listing management, live calendar, staff assignments, revenue analytics), and Admins (KYC verification, listings audit, system audit logs).' },
    ], { spaceBefore: 40, spaceAfter: 140, lineSpacing: 280, bullet: true }),
    h2('Project Scope & Boundaries'),
    p('• Functional Scope: End-to-end venue discovery, 3D spatial simulation, date availability tracking, 25% token payment processing, multilingual localization, and role-based administration.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Target Demographic: Celebrating families, wedding couples, corporate event managers, venue hosts, tent operators, decorators, and car fleet agencies across India.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Business Boundaries: Zero-commission direct-to-owner marketplace eliminating broker markups. Vendors pay flat listing subscriptions or retain 100% of their earnings.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('• Technical Boundaries: WebGL-enabled desktop and mobile web browsers. Requires active client internet connection for real-time calendar synchronization and Razorpay transaction authorization.', { size: 24, spaceBefore: 40, spaceAfter: 120, bullet: true })
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 5: TECHNOLOGY STACK
  // ==========================================
  docChildren.push(
    h1('5. Technology Stack'),
    p(
      'Hall Khoj Finder is built using verified, production-grade web technologies that guarantee speed, high concurrency, security, and exceptional user experience across all devices.',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    h2('Technology Stack Summary Table'),
    p('The multi-tier architectural stack employed across the application:', { size: 24, spaceBefore: 40, spaceAfter: 80 })
  );

  const techHeaders = ['Layer', 'Technology / Tool', 'Specific Role in Hall Khoj Finder'];
  const techRows = [
    ['Frontend Markup', 'HTML5 Semantic Elements', 'Accessible document structure (<main>, <section>, <canvas>, <dialog>)'],
    ['Styling & Theme', 'CSS3 Custom Properties', 'Dark luxury slate theme, glassmorphism (backdrop-filter: blur), responsive grid'],
    ['Client Logic', 'Vanilla JavaScript (ES6+)', 'Modular client architecture, API communications, async/await DOM rendering'],
    ['3D Graphics', 'Three.js (r128) + WebGL', 'Procedural 3D venue layout model, OrbitControls, 3 lighting modes'],
    ['Mapping', 'Leaflet.js & OpenStreetMap', 'Interactive venue location mapping, pin rendering, and directions'],
    ['Localization', 'Custom i18n Engine (14 Lang)', 'Dynamic client-side translation across 14 Indian languages with RTL support'],
    ['Server Runtime', 'Node.js (v24.x LTS)', 'Asynchronous non-blocking event-driven runtime powering the backend'],
    ['Web Framework', 'Express.js (v5.2.1)', 'RESTful API routing, middleware pipeline, input validation, and controllers'],
    ['Database (Primary)', 'MongoDB Atlas + Mongoose 9.x', 'Document-oriented database with strict schema validation and composite indexes'],
    ['Database (Failover)', 'Local Transactional JSON Engine', 'Automatic zero-downtime local JSON storage failover and automatic seed engine'],
    ['Authentication', 'JWT + Bcrypt.js', 'Stateless session tokens (256-bit secret) and salted one-way password hashing'],
    ['Payment Gateway', 'Razorpay API & Crypto', '25% advance token orders and HMAC-SHA256 cryptographic signature validation'],
    ['Document Generator', 'PDFKit (v0.20.2)', 'Automated server-side generation of branded PDF booking passes and invoices'],
    ['File Uploads', 'Multer (v2.4.0)', 'Multi-part form image upload processing for venue galleries and KYC docs'],
  ];

  docChildren.push(createTable(techHeaders, techRows, [2000, 3160, 4200]));
  docChildren.push(p('', { spaceBefore: 120, spaceAfter: 80 }));

  docChildren.push(
    h2('Architectural Highlights of Key Technologies'),
    multiRunP([
      { text: '1. Three.js (r128 WebGL Engine): ', bold: true },
      { text: 'Enables high-performance 3D graphics rendering directly inside standard web browsers without requiring external plugins or app installations. It renders architectural geometries, realistic directional shadows, point-light chandeliers, and material shaders at a smooth 60 frames per second.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '2. Express 5.x & RESTful API Pipeline: ', bold: true },
      { text: 'Provides high-throughput routing with modular controllers (/api/v1/auth, /api/v1/halls, /api/v1/bookings, /api/v1/reviews). It incorporates sliding-window rate limiting (300 req/min globally; 100 req/min for auth and payments) and recursive input sanitization against XSS and NoSQL injection.' },
    ], { spaceBefore: 40, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '3. Dual-Storage Hybrid Database Architecture: ', bold: true },
      { text: 'Combines the elasticity of MongoDB Atlas (via Mongoose ODM) with an automated local transactional JSON failover engine. If MongoDB is disconnected or undergoing maintenance, the application seamlessly redirects operations to atomic JSON stores, ensuring 100% operational resilience.' },
    ], { spaceBefore: 40, spaceAfter: 120, lineSpacing: 280, bullet: true })
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 6: SYSTEM REQUIREMENTS
  // ==========================================
  docChildren.push(
    h1('6. System Requirements'),
    h2('1. Hardware Requirements'),
    p(
      'The hardware requirements for running and demonstrating the Hall Khoj Finder system across server and client environments are detailed below:',
      { size: 24, spaceBefore: 40, spaceAfter: 80 }
    )
  );

  const hwHeaders = ['Hardware Component', 'Minimum Specification', 'Recommended Specification'];
  const hwRows = [
    ['Processor (Server)', '2.0 GHz Dual-Core (Intel i3 / AMD equivalent)', '2.5 GHz Quad-Core (Intel i5 / AMD Ryzen 5 or higher)'],
    ['System RAM (Server)', '4 GB RAM', '8 GB to 16 GB DDR4 RAM'],
    ['Storage Capacity', '20 GB free disk space', '50 GB SSD storage (for database growth, logs & uploads)'],
    ['Graphics Card (Client)', 'WebGL 1.0 compatible GPU (Integrated Intel HD)', 'Dedicated GPU (NVIDIA / AMD) with WebGL 2.0 support'],
    ['Network Connectivity', 'Broadband connection of 1 Mbps', 'High-speed broadband of 10 Mbps or higher'],
    ['Display Resolution', '1366 × 768 pixels', '1920 × 1080 (Full HD) resolution or higher'],
  ];

  docChildren.push(createTable(hwHeaders, hwRows, [2400, 3480, 3480]));
  docChildren.push(p('', { spaceBefore: 120, spaceAfter: 80 }));

  docChildren.push(
    h2('2. Software Requirements'),
    p(
      'The software ecosystem required for running and developing the Hall Khoj Finder application:',
      { size: 24, spaceBefore: 40, spaceAfter: 80 }
    )
  );

  const swHeaders = ['Software Category', 'Specification / Tool Utilized'];
  const swRows = [
    ['Operating System', 'Windows 10/11 (64-bit), macOS Monterey or later, or Linux (Ubuntu 20.04 LTS+)'],
    ['Runtime Environment', 'Node.js v18.0.0 or later (active v24.21.0) with npm v11.x'],
    ['Database Engines', 'MongoDB Community Server v7.x / MongoDB Atlas Cloud; fallback JSON storage'],
    ['Web Browsers', 'Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ (WebGL enabled)'],
    ['Code Editor & IDE', 'Visual Studio Code (recommended) with ESLint & Prettier extensions'],
    ['API Testing Tools', 'Postman, Thunder Client, or cURL for testing RESTful API endpoints'],
    ['Database GUI Client', 'MongoDB Compass (recommended) for viewing collections, documents, and indexes'],
  ];

  docChildren.push(createTable(swHeaders, swRows, [2800, 6560]));
  docChildren.push(p('', { spaceBefore: 120, spaceAfter: 80 }));

  docChildren.push(
    h2('3. Backend Dependencies (package.json)'),
    p(
      'The production packages declared in the project backend and installed via npm:',
      { size: 24, spaceBefore: 40, spaceAfter: 80 }
    )
  );

  const pkgHeaders = ['Package Name', 'Version', 'Purpose & Architectural Role in Project'];
  const pkgRows = [
    ['express', '^5.2.1', 'Core web framework used to define RESTful API endpoints, routing, and JSON middleware'],
    ['mongoose', '^9.10.2', 'Object Data Modeling (ODM) library for MongoDB schema validation and indexing'],
    ['bcryptjs', '^3.0.3', 'Cryptographic library used for salted one-way hashing of user and owner passwords'],
    ['jsonwebtoken', '^9.0.3', 'RFC 7519 implementation used for generating and verifying signed JWT session tokens'],
    ['cors', '^2.8.6', 'Cross-Origin Resource Sharing middleware enabling secure API requests from web frontends'],
    ['dotenv', '^18.0.1', 'Loads environment variables from .env files into process.env to protect credentials'],
    ['multer', '^2.4.0', 'Multipart/form-data handler for uploading venue gallery images and owner KYC documents'],
    ['pdfkit', '^0.20.2', 'Server-side PDF generation engine for creating booking passes and payment receipts'],
  ];

  docChildren.push(createTable(pkgHeaders, pkgRows, [2000, 1600, 5760]));
  docChildren.push(p('', { spaceBefore: 120, spaceAfter: 80 }));

  docChildren.push(
    h2('4. Environment Configuration (.env)'),
    p(
      'The backend reads system configuration from an isolated .env file to ensure credentials are never hard-coded in the source code:',
      { size: 24, spaceBefore: 40, spaceAfter: 80 }
    ),
    p('• PORT — Port number on which the Express API server listens (default: 3000).', { size: 24, spaceBefore: 30, spaceAfter: 30, bullet: true }),
    p('• MONGO_URI — Connection string for MongoDB Atlas / Local MongoDB (e.g. mongodb://localhost:27017/hallkhoj).', { size: 24, spaceBefore: 30, spaceAfter: 30, bullet: true }),
    p('• JWT_SECRET — High-entropy 256-bit cryptographic key used for signing JSON Web Tokens.', { size: 24, spaceBefore: 30, spaceAfter: 30, bullet: true }),
    p('• RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET — Authentication keys for Razorpay API and HMAC-SHA256 signature checks.', { size: 24, spaceBefore: 30, spaceAfter: 30, bullet: true }),
    p('• NODE_ENV — Application environment mode (development or production).', { size: 24, spaceBefore: 30, spaceAfter: 120, bullet: true }),
    h2('5. Steps to Run the Project'),
    p('1. Clone the repository and ensure Node.js (v18+) and MongoDB are installed on the system.', { size: 24, spaceBefore: 40, spaceAfter: 40, bullet: true }),
    p('2. Open the project root directory in a terminal and execute npm install to install all dependencies.', { size: 24, spaceBefore: 40, spaceAfter: 40, bullet: true }),
    p('3. Configure the .env file with appropriate PORT, MONGO_URI, and JWT_SECRET values.', { size: 24, spaceBefore: 40, spaceAfter: 40, bullet: true }),
    p('4. (Optional) Run npm run seed to populate MongoDB collections with verified demo venues, tent houses, and luxury cars.', { size: 24, spaceBefore: 40, spaceAfter: 40, bullet: true }),
    p('5. Start the backend server by executing npm start (which executes node backend/server.js). The terminal displays: “Hall Khoj Server running on port 3000”.', { size: 24, spaceBefore: 40, spaceAfter: 40, bullet: true }),
    p('6. Open frontend/index.html in any modern web browser or launch via VS Code Live Server at http://localhost:3000 to interact with the live application.', { size: 24, spaceBefore: 40, spaceAfter: 120, bullet: true })
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 7: FUTURE SCOPE
  // ==========================================
  docChildren.push(
    h1('7. Future Scope'),
    p(
      'Hall Khoj Finder provides an enterprise-ready foundation for modernizing event services and venue discovery. The following technical and business enhancements are planned for future development milestones to further expand platform capabilities:',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    h2('Planned Future Enhancements'),
    multiRunP([
      { text: '1. Native Cross-Platform Mobile Applications: ', bold: true },
      { text: 'Developing native mobile applications for Android and iOS using React Native or Flutter. This will provide device-level hardware acceleration for 3D walkthroughs, push notification daemons for instant booking alerts, biometric login, and offline itinerary caching.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '2. Augmented Reality (AR) Stage & Mandap Decor Simulator: ', bold: true },
      { text: 'Integrating WebXR and smartphone LiDAR sensors to allow couples to superimpose 3D virtual wedding mandaps, floral backdrops, and dining table arrangements directly onto physical empty venues using their mobile cameras.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '3. Machine Learning Dynamic Pricing & Muhurat Yield Optimization: ', bold: true },
      { text: 'Deploying machine learning models that analyze regional Hindu Panchang auspicious wedding dates (muhurats), historical inquiry velocity, and competitor pricing to offer automated dynamic pricing suggestions to venue owners, maximizing occupancy and revenue.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '4. Multi-Vendor Unified Package Bundling: ', bold: true },
      { text: 'Allowing customers to bundle complementary services (e.g. Hall + Catering + Tent + DJ + Luxury Cars) into a single master event package with coordinated multi-vendor milestone schedules and bundled discounts.' },
    ], { spaceBefore: 60, spaceAfter: 80, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '5. Automated Smart Escrow Contracts & Mutual Cancellation: ', bold: true },
      { text: 'Implementing smart escrow accounts that hold booking deposits securely until event milestone verification, automating fair refund disbursements in cases of mutual cancellation or force majeure events.' },
    ], { spaceBefore: 60, spaceAfter: 60, lineSpacing: 280, bullet: true }),
    multiRunP([
      { text: '6. Multi-Channel WhatsApp Business & SMS Order Automation: ', bold: true },
      { text: 'Integrating WhatsApp Business Cloud API to dispatch interactive booking passes, payment reminders, directions, and gate passes directly to guests and family members.' },
    ], { spaceBefore: 60, spaceAfter: 140, lineSpacing: 280, bullet: true })
  );
  docChildren.push(new Paragraph({ children: [new PageBreak()] }));

  // ==========================================
  // SECTION 8: REFERENCES
  // ==========================================
  docChildren.push(
    h1('8. References'),
    p(
      'The following standard technical documentation, academic textbooks, specifications, and research resources were consulted in the architectural design, security analysis, and implementation of Hall Khoj Finder:',
      { size: 24, align: AlignmentType.JUSTIFY, spaceBefore: 80, spaceAfter: 140, lineSpacing: 300 }
    ),
    p('1. Node.js Foundation (2024). Node.js v24.x LTS Runtime Documentation & Event Loop Architecture. https://nodejs.org/docs/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('2. Express.js Community (2024). Express 5.x Framework Documentation: Routing, Middleware Pipeline, and REST API Best Practices. https://expressjs.com/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('3. MongoDB Inc. (2024). MongoDB Manual: Document Data Modeling, Composite Indexing, and High-Availability Clustering. https://www.mongodb.com/docs/manual/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('4. Mongoose ODM (2024). Mongoose v9.x: Elegant MongoDB Object Modeling for Node.js Applications. https://mongoosejs.com/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('5. Three.js Authors (2024). Three.js JavaScript 3D Library API Reference (r128): WebGL Shaders, OrbitControls, and Geometries. https://threejs.org/docs/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('6. Leaflet.js Team (2024). Leaflet: An Open-Source JavaScript Library for Mobile-Friendly Interactive Maps and Geolocation. https://leafletjs.com/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('7. Razorpay Software Pvt. Ltd. (2024). Razorpay Payment Gateway API Reference: Orders, Payments, and Webhook HMAC Verification. https://razorpay.com/docs/api/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('8. Mozilla Developer Network (MDN) (2024). Web APIs: WebGL, Fetch API, Web Storage (localStorage), and CSS3 Glassmorphism. https://developer.mozilla.org/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('9. Jones, M., Bradley, J., & Sakimura, N. (2015). JSON Web Token (JWT) Architecture and Signature Verification. IETF RFC 7519. https://datatracker.ietf.org/doc/html/rfc7519', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('10. Open Web Application Security Project (OWASP) (2023). OWASP Top 10 Web Application Security Risks and Mitigation Guidelines. https://owasp.org/www-project-top-ten/', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('11. Pressman, R. S., & Maxim, B. R. Software Engineering: A Practitioner’s Approach (8th Edition), McGraw-Hill Education.', { size: 24, spaceBefore: 40, spaceAfter: 50, bullet: true }),
    p('12. Kendall, K. E., & Kendall, J. E. Systems Analysis and Design (10th Edition), Pearson Education.', { size: 24, spaceBefore: 40, spaceAfter: 80, bullet: true })
  );

  // Document setup with footer page numbering
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    font: FONT_FAMILY,
                    size: 20,
                    children: [PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('PROJECT_SYNOPSIS.docx', buffer);
  console.log('PROJECT_SYNOPSIS.docx successfully generated! Size:', buffer.length);
}

buildDoc().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
