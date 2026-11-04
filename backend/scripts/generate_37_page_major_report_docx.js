/**
 * Hall Khoj Finder — 37-Page Official Major Project Report Generator (DOCX)
 * Custom-crafted for Khalsa College of Engineering and Technology, Amritsar.
 * Students: Manish Kumar & Aman Kumar
 * Branch: BCA, Semester: 6th (2023-2026)
 * Generates an editable Microsoft Word (.docx) document matching the sample report.
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
  ImageRun
} = require('docx');

const OUTPUT_PATH = path.join(__dirname, '../../HALL_KHOJ_FINDER_MAJOR_PROJECT_REPORT.docx');
const LOGO_PATH = path.join(__dirname, '../../scratch/kcet_logo.png');
const SCREENSHOTS_DIR = path.join(__dirname, '../../scratch/screenshots');

function p(text, opts = {}) {
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({
      text: text,
      font: 'Times New Roman',
      size: opts.size || 24, // 12 pt
      bold: opts.bold || false,
      italics: opts.italics || false,
      underline: opts.underline ? {} : undefined,
      color: '000000'
    }));
  } else if (Array.isArray(text)) {
    text.forEach(item => {
      if (typeof item === 'string') {
        runs.push(new TextRun({ text: item, font: 'Times New Roman', size: opts.size || 24, color: '000000' }));
      } else {
        runs.push(new TextRun({
          text: item.text,
          font: 'Times New Roman',
          size: item.size || opts.size || 24,
          bold: item.bold || false,
          italics: item.italics || false,
          underline: item.underline ? {} : undefined,
          color: '000000'
        }));
      }
    });
  }

  return new Paragraph({
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
    spacing: {
      line: opts.line || 276, // 1.15 spacing
      before: opts.spaceBefore || 0,
      after: opts.spaceAfter || 120
    },
    children: runs
  });
}

function h1(title) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 200 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 28, // 14 pt
        bold: true,
        underline: {}
      })
    ]
  });
}

function h2(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 120 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 24, // 12 pt
        bold: true
      })
    ]
  });
}

function h3(title) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 140, after: 80 },
    children: [
      new TextRun({
        text: title,
        font: 'Times New Roman',
        size: 23,
        bold: true
      })
    ]
  });
}

function pb() {
  return new Paragraph({ children: [new PageBreak()] });
}

async function generateDocx() {
  console.log('Generating official 37-page Word report (.docx)...');

  const children = [];

  // ==========================================
  // PAGE 1: COVER
  // ==========================================
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 300 },
    children: [
      new TextRun({ text: 'A MAJOR PROJECT REPORT', font: 'Times New Roman', size: 32, bold: true })
    ]
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({ text: 'Khalsa College of Engineering and Technology', font: 'Times New Roman', size: 28, bold: true })
    ]
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [
      new TextRun({ text: 'Amritsar, Punjab', font: 'Times New Roman', size: 26, bold: true })
    ]
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: '2023-2026', font: 'Times New Roman', size: 26, bold: true })
    ]
  }));

  // Logo
  if (fs.existsSync(LOGO_PATH)) {
    const logoData = fs.readFileSync(LOGO_PATH);
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new ImageRun({
          data: logoData,
          transformation: { width: 170, height: 170 },
          type: 'png'
        })
      ]
    }));
  }

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 60 },
    children: [
      new TextRun({ text: 'Project name - Hall Khoj Finder – A 3D Smart Event Venues & Services', font: 'Times New Roman', size: 24, bold: true })
    ]
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({ text: 'Marketplace Web Platform', font: 'Times New Roman', size: 24, bold: true })
    ]
  }));

  children.push(p('Semester - 6th', { bold: true, spaceAfter: 60 }));
  children.push(p('Branch - BCA', { bold: true, spaceAfter: 300 }));

  // Two column table for Submitted To and Submitted By
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              p('Submitted to:', { bold: true, spaceAfter: 40 }),
              p('ER. SUKHMEET KAUR', { spaceAfter: 40 }),
              p('ER. SHIVANI MAHAJAN', { spaceAfter: 40 })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              p('Submitted by:', { bold: true, spaceAfter: 40 }),
              p('MANISH KUMAR', { spaceAfter: 40 }),
              p('AMAN KUMAR', { spaceAfter: 40 })
            ]
          })
        ]
      })
    ]
  }));

  children.push(pb());

  // ==========================================
  // PAGE 2: CERTIFICATE
  // ==========================================
  children.push(h1('CERTIFICATE'));
  children.push(p('“Hall Khoj Finder – A 3D Smart Event Venues & Services Web Platform”', { bold: true, spaceBefore: 200, spaceAfter: 200 }));
  children.push(p('This is to certify that the project titled “Hall Khoj Finder – A 3D Smart Event Venues & Services Web Platform” is a Bonafide work carried out by Manish Kumar and Aman Kumar, students of Bachelor of Computer Applications (BCA), in partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) at Khalsa College of Engineering & Technology, Amritsar.', { spaceAfter: 200 }));
  children.push(p('This project is the result of the students\' own work and has not been submitted for any other degree or diploma.', { spaceAfter: 400 }));

  // Guides & Submitted to Table
  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              p('Project Guides:', { bold: true, spaceAfter: 60 }),
              p('1.  Ms. Shobhna Sharma', { spaceAfter: 40 }),
              p('2.  Mr. Kunal Marwaha', { spaceAfter: 40 }),
              p('3.  Mr. Aman Arora', { spaceAfter: 40 }),
              p('4.  Mr. Jagdeep Singh', { spaceAfter: 40 })
            ]
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              p('Submitted To:', { bold: true, spaceAfter: 60 }),
              p('1.  Ms. Sukhmeet Kaur', { spaceAfter: 40 }),
              p('2.  Ms. Shivani Mahajan', { spaceAfter: 40 })
            ]
          })
        ]
      })
    ]
  }));

  children.push(new Paragraph({ spacing: { before: 600, after: 40 }, children: [new TextRun({ text: 'Place: Amritsar', font: 'Times New Roman', size: 24 })] }));
  children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: 'Date: _______________', font: 'Times New Roman', size: 24 })] }));
  children.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 200, after: 40 },
    children: [new TextRun({ text: '_________________________', font: 'Times New Roman', size: 24, bold: true })]
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 200 },
    children: [new TextRun({ text: 'HEAD OF DEPARTMENT', font: 'Times New Roman', size: 24, bold: true })]
  }));

  children.push(pb());

  // ==========================================
  // PAGE 3: ACKNOWLEDGEMENT
  // ==========================================
  children.push(h1('ACKNOWLEDGEMENT'));
  children.push(p('I would like to express my sincere gratitude to all those who supported and guided me throughout the development of my project, “Hall Khoj Finder – A 3D Smart Event Venues & Services Web Platform”. This project would not have been possible without their valuable contributions.', { spaceBefore: 200, spaceAfter: 140 }));
  children.push(p('First and foremost, I extend my heartfelt thanks to my project guides, Ms. Shobhna Sharma, Mr. Kunal Marwaha, Mr. Aman Arora, and Mr. Jagdeep Singh, for their invaluable guidance, constant encouragement, and technical expertise. Their insightful suggestions, patience, and constructive feedback helped me overcome challenges and successfully complete this project.', { spaceAfter: 140 }));
  children.push(p('I would also like to express my sincere thanks to Ms. Sukhmeet Kaur and Ms. Shivani Mahajan, to whom this project is submitted, for their support, motivation, and valuable suggestions during the development of this project.', { spaceAfter: 140 }));
  children.push(p('I am also deeply grateful to the Head of the Department of Computer Applications (BCA) for providing the necessary resources, infrastructure, and academic support throughout this endeavor. I would also like to thank all the faculty members of the BCA Department for their valuable teachings and continuous motivation.', { spaceAfter: 140 }));
  children.push(p('I extend my appreciation to Khalsa College of Engineering & Technology, Amritsar, for providing a conducive environment and access to the necessary facilities that enabled me to complete this project successfully.', { spaceAfter: 140 }));
  children.push(p('I am also thankful to the library staff for providing access to relevant books and resources, and to the technical staff for their assistance in maintaining the computing infrastructure.', { spaceAfter: 140 }));
  children.push(p('My sincere thanks go to my friends and classmates for their constant support, valuable discussions, and technical assistance during the development phase.', { spaceAfter: 140 }));
  children.push(p('Finally, I owe my deepest gratitude to my family for their unwavering support, patience, and encouragement throughout this journey. I am grateful to everyone who directly or indirectly contributed to the successful completion of this project.', { spaceAfter: 140 }));

  children.push(pb());

  // ==========================================
  // PAGE 4: DECLARATION
  // ==========================================
  children.push(h1('DECLARATION'));
  children.push(p('I hereby declare that the project titled “Hall Khoj Finder – A 3D Smart Event Venues & Services Web Platform” submitted by Manish Kumar and Aman Kumar in partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) to Khalsa College of Engineering & Technology, Amritsar, is an original work carried out by us under the guidance of our project guides.', { spaceBefore: 200, spaceAfter: 160 }));
  children.push(p('We further declare that this project has not been submitted previously, either in full or in part, to any other university or institution for the award of any degree or diploma. All the information and data included in this report are authentic to the best of our knowledge.', { spaceAfter: 160 }));
  children.push(p('We also declare that all sources of information used in this project have been properly acknowledged in the references section.', { spaceAfter: 300 }));

  children.push(p('Date: _______________', { spaceAfter: 40 }));
  children.push(p('Place: Amritsar', { spaceAfter: 160 }));
  children.push(p('Manish Kumar', { bold: true, spaceAfter: 30 }));
  children.push(p('Roll No: ____________', { spaceAfter: 100 }));
  children.push(p('Aman Kumar', { bold: true, spaceAfter: 30 }));
  children.push(p('Roll No: ____________', { spaceAfter: 100 }));

  children.push(pb());

  // ==========================================
  // PAGE 5: TABLE OF CONTENT
  // ==========================================
  children.push(h1('TABLE OF CONTENT'));

  const tocTableRows = [
    new TableRow({
      children: [
        new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [p('SECTION', { bold: true })] }),
        new TableCell({ width: { size: 80, type: WidthType.PERCENTAGE }, children: [p('CONTENT', { bold: true })] })
      ]
    }),
    new TableRow({ children: [new TableCell({ children: [p('1.')] }), new TableCell({ children: [p('Introduction\n1.1 Background\n1.2 Problem Statement\n1.3 Objectives\n1.4 Scope of the Project')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('2.')] }), new TableCell({ children: [p('Literature Review\n2.1 Traditional System\n2.2 Existing Digital Solutions\n2.3 Smart City And Web-Based Solutions')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('3.')] }), new TableCell({ children: [p('System Architecture\n3.1 Overall Architecture\n3.2 Data Flow Diagram\n3.3 System Components')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('4.')] }), new TableCell({ children: [p('Frontend Implementation\n4.1 Web Application Structure\n4.2 User Interface Components\n4.3 Venue & Seat Selection Interface\n4.4 Booking And Payment Interface')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('5.')] }), new TableCell({ children: [p('Backend Implementation\n5.1 Node.Js Server\n5.2 Booking Management')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('6.')] }), new TableCell({ children: [p('Database (Supabase PostgreSQL & Cloud Persistence)')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('7.')] }), new TableCell({ children: [p('Implementation And Testing')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('8.')] }), new TableCell({ children: [p('Important Code Snippets')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('9.')] }), new TableCell({ children: [p('System Interface (Website Screenshots)')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('10.')] }), new TableCell({ children: [p('Benefits and Advantages')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('11.')] }), new TableCell({ children: [p('Challenges and Solutions')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('12.')] }), new TableCell({ children: [p('Future Enhancements')] })] }),
    new TableRow({ children: [new TableCell({ children: [p('13.')] }), new TableCell({ children: [p('References')] })] })
  ];

  children.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: tocTableRows
  }));

  children.push(pb());

  // Sections 1 to 13 text
  children.push(h1('1)  INTRODUCTION'));
  children.push(h2('1.1 BACKGROUND'));
  children.push(p('In recent years, rapid urbanization, changing family structures, and technological advancements have significantly transformed the event planning industry. With the expanding population across metropolitan and tier-2 cities, the demand for well-organized venues such as marriage halls, banquet lawns, and convention centers has grown substantially. Simultaneously, celebrating milestone occasions—ranging from grand Indian weddings, receptions, and engagement ceremonies to corporate conventions, exhibitions, and musical galas—now demands coordinated logistics involving specialized vendors such as luxury wedding cars, German waterproof tents, high-fidelity DJ systems, fine catering, and artistic stage decorations.'));
  children.push(p('In a typical urban environment, individuals planning an event frequently seek information regarding available marriage halls, seating capacities, rental charges, decor capabilities, and nearby vendors. However, this critical information is usually dispersed across fragmented sources, unverified social media directories, and word-of-mouth recommendations. For instance, a customer might explore one local portal to find halls, search independently for catering services, contact multiple car rental agencies for bridal transit, and physically visit tent decorators to inspect inventory.'));
  children.push(p('Moreover, many existing digital platforms operate strictly as lead-generation aggregators rather than comprehensive end-to-end event marketplaces. These legacy platforms capture customer phone numbers, sell their private inquiries to multiple competing brokers, and fail to provide transparent pricing or verified real-time dates. As a result, hosts are bombarded by unsolicited sales calls, while remaining unable to ascertain actual hall availability or inspect genuine layouts without exhaustive physical travel.'));
  children.push(p('Another significant limitation is the lack of structured, verified presentation. Traditional directories suffer from excessive advertisements, ambiguous pricing tiers, unverified reviews, and misleading photographs taken years prior. To overcome these persistent challenges, there is a pressing necessity for a centralized, unified web-based application that integrates venues and full-lifecycle event services into a single cohesive platform.'));
  children.push(p('Hall Khoj Finder is conceptualized and engineered to address this critical gap. It is a modern, responsive web application designed to serve as a comprehensive 3D marketplace for discovering, visually exploring, and booking marriage halls, banquet lawns, luxury cars, tent houses, catering, DJ, and stage decoration services. By integrating interactive 3D WebGL visualizations, real-time availability tracking, transparent advance token deposits, and zero-brokerage direct vendor communication, Hall Khoj Finder modernizes urban event management into a seamless, trusted, and efficient digital experience.'));

  children.push(pb());

  children.push(h2('1.2 PROBLEM STATEMENT'));
  children.push(p('In today\'s rapidly evolving urban lifestyle, organizing a marriage or milestone event represents one of the most resource-intensive and emotionally significant endeavors for Indian families. Despite the widespread availability of general digital directories, the process of discovering suitable venues, verifying amenities, determining authentic pricing, and reserving event dates remains fraught with inefficiency, opacity, and substantial financial risk.'));
  children.push(p('A primary issue is the fragmented nature of traditional systems. When planning an event, families must engage independently with over a dozen service categories—including marriage palaces, tent contractors, flower decorators, lighting technicians, caterers, and luxury transport providers. Because each vendor operates in isolation with manual booking records, coordinating schedules and confirming overlapping availability requires weeks of tedious phone calls and on-site visits.'));
  children.push(p('Another severe challenge is the pervasive presence of unauthorized middlemen and commission agents. In traditional venue hiring, unaccredited brokers charge hidden markups ranging between 10% and 25% on venue bookings. Furthermore, conventional commercial listing directories function on aggressive lead-arbitrage models: rather than presenting transparent pricing directly to the consumer, they sell customer contact information to dozens of third parties, resulting in spam calls, aggressive sales tactics, and inflated quotes.'));
  children.push(p('Furthermore, misleading imagery and lack of spatial transparency pose serious risks. Standard photograph galleries uploaded to social media are frequently heavily filtered, outdated, or taken with wide-angle lenses that misrepresent actual hall proportions and architectural clearances. Families often discover critical limitations—such as inadequate air conditioning, restricted pillar-free guest visibility, or cramped parking—only when arriving on the event day.'));
  children.push(p('Equally critical is the absence of real-time scheduling and secure payment mechanisms. Manual booking books kept on paper or basic spreadsheets frequently lead to double-booking disputes on auspicious wedding dates (muhurats). Customers are routinely forced to transfer substantial cash advances without formalized legal receipts or clear cancellation safeguards.'));
  children.push(p('Therefore, there is an unambiguous need for a unified, transparent, and technology-driven platform that integrates venues and event services into one reliable digital ecosystem. Hall Khoj Finder addresses these pressing pain points by offering verified listings, direct host-to-owner transactions with 0% brokerage, interactive 3D spatial previews, automated booking state machines, and secure token payment verification.'));

  children.push(pb());

  // (All subsequent pages added)
  children.push(h2('1.3 OBJECTIVES'));
  children.push(p('The primary objective of the project titled “Hall Khoj Finder – A 3D Smart Event Venues & Services Web Platform” is to design, develop, and deploy an intuitive, modern, and reliable web application that centralizes venue exploration, service coordination, and booking workflows into a single transparent digital platform.'));
  children.push(h3('Primary Objectives:'));
  children.push(p('1. To Develop a Centralized Marketplace: Create a unified web platform that integrates marriage halls, banquet lawns, luxury wedding cars, tent house rentals, sound systems, catering, and stage decor into a single searchable directory.'));
  children.push(p('2. To Eliminate Middlemen and Hidden Brokerage: Connect event hosts directly with verified venue owners and vendors with 0% commission fees, ensuring authentic rates and transparent pricing tiers.'));
  children.push(p('3. To Provide Interactive 3D Spatial Previews: Integrate Three.js WebGL technology to offer realistic 3D venue layout walkthroughs, enabling families to inspect spatial dimensions and guest capacities remotely.'));
  children.push(p('4. To Ensure Accurate Real-Time Availability: Implement a resilient scheduling and availability tracking engine to eradicate date collision risks and double-booking disputes.'));
  children.push(h3('Secondary Objectives:'));
  children.push(p('5. To Implement Modern Web Technologies: Utilize Vanilla JavaScript (ES6+), HTML5, and CSS3 Glassmorphism paired with an Express.js REST API for ultra-fast, zero-compilation performance.'));
  children.push(p('6. To Provide Built-in Interactive Event Planning Tools: Incorporate smart wedding budget calculators, guest seating estimators, and event timeline checklists to guide family planning.'));
  children.push(p('7. To Implement Secure Advance Token Payments: Integrate the Razorpay payment gateway with cryptographic HMAC-SHA256 signature verification and automated vector PDF invoice generation.'));
  children.push(p('8. To Ensure Enterprise Role-Based Access Control (RBAC): Build dedicated, authenticated dashboards for Customers, Venue Owners, and System Administrators powered by Supabase PostgreSQL.'));
  children.push(p('9. To Support Multilingual Accessibility: Implement a 3D language switcher offering full localized navigation in English and Hindi to serve regional users across North India.'));

  children.push(pb());

  children.push(h2('1.4 SCOPE OF THE PROJECT'));
  children.push(p('The scope of the project “Hall Khoj Finder – A 3D Smart Event Venues & Services Web Platform” encompasses the complete conceptualization, architectural design, full-stack implementation, testing, and deployment of a responsive, mobile-first marketplace for urban and suburban event management.'));
  children.push(h3('Scope of the System:'));
  children.push(p('The application is structured around a comprehensive catalog of 19 specialized service categories. Users can browse and filter verified marriage palaces, air-conditioned banquet halls, outdoor wedding lawns, vintage bridal cars, German pagoda tents, 15,000W sound arrays, royal catering banquets, and revolving stage decor. The platform features an intelligent 8-parameter multi-criteria search engine complemented by GPS-based proximity search calculating venue distances within 1 to 50 km radii.'));
  children.push(h3('Technical Scope:'));
  children.push(p('From a software engineering perspective, the system implements a modern three-tier web application architecture: Presentation Tier (HTML5, CSS3 Glassmorphism, Vanilla JS, Three.js 3D WebGL, Leaflet maps), Application Tier (Node.js, Express.js REST API, Helmet security, rate limiting), and Data Persistence Tier (Supabase Cloud PostgreSQL with Row Level Security, synchronized with atomic local JSON files).'));

  children.push(pb());

  children.push(h1('2)  LITERATURE REVIEW'));
  children.push(h2('2.1 TRADITIONAL SYSTEM'));
  children.push(p('Before the emergence of advanced digital technologies, accessing information related to marriage halls, event services, and festive vendors was primarily dependent on traditional methods such as physical visits, printed pamphlets, regional newspaper classifieds, and word-of-mouth communication. These legacy methods suffered from lack of real-time availability, geographical friction, price opacity, and vulnerability to human scheduling errors resulting in double-booked wedding dates.'));

  children.push(pb());

  children.push(h2('2.2 EXISTING DIGITAL SOLUTIONS'));
  children.push(p('With the widespread use of smartphones, platforms such as Justdial, Sulekha, WedMeGood, and WeddingWire entered the market. However, horizontal directories focus on selling customer contact numbers to competing brokers rather than enabling direct booking. Wedding portals charge high vendor subscription fees and lack real-time date locking, automated advance token payment gates, and 3D spatial previews.'));

  children.push(pb());

  children.push(h2('2.3 SMART CITY AND WEB-BASED SOLUTIONS'));
  children.push(p('Smart cities utilize modern web technologies, spatial analytics, and cloud databases to consolidate fragmented urban services into unified digital platforms. Three.js WebGL enables browser-based 3D spatial inspections; asynchronous RESTful architectures provide instant response times; and cloud PostgreSQL databases like Supabase deliver relational integrity and cryptographic authentication.'));

  children.push(pb());

  children.push(h1('3)  SYSTEM ARCHITECTURE'));
  children.push(h2('3.1 OVERALL ARCHITECTURE'));
  children.push(p('The Hall Khoj Finder system follows an enterprise three-tier web application architecture: the Presentation Layer (HTML5, CSS3 Glassmorphism, Three.js WebGL, Vanilla JS), the Application Layer (Node.js and Express.js REST API server), and the Data Persistence Layer (Supabase PostgreSQL Cloud with Row Level Security and local atomic JSON fallback).'));

  children.push(pb());

  children.push(h2('3.2 DATA FLOW DIAGRAM'));
  children.push(p('The Level 0 Context Diagram represents interactions between Event Hosts (Customers), Venue & Vendor Owners, the Razorpay Payment Gateway, and the Supabase Cloud PostgreSQL Database. The Level 1 Data Flow partitions the system into User Interaction & Search Discovery, Booking State Evaluation, Payment Gateway Verification, and Database Transaction Persistence.'));

  children.push(pb());

  children.push(h2('3.3 SYSTEM COMPONENTS'));
  children.push(p('The platform is composed of decoupled modular components: Navigation Bar with 3D language switcher, 3D Hero WebGL Canvas, 8-Parameter Search Filter, Venue Cards, Interactive Planning Tools (Budget Planner, Guest Calculator), Booking Engine, Razorpay Payment Gateway, PDFKit Invoicing, and Supabase PostgreSQL relational tables.'));

  children.push(pb());

  children.push(h1('4)  FRONTEND IMPLEMENTATION'));
  children.push(h2('4.1 WEB APPLICATION STRUCTURE & THREE.JS 3D ENGINE'));
  children.push(p('The frontend is built using pure modern Vanilla JavaScript (ES6+), HTML5, and CSS3, eliminating heavy SPA framework bundles for instantaneous sub-second page loads. The Three.js WebGL engine renders realistic 3D venue models directly inside standard browser viewports with dynamic lighting, orbital camera projection, and touch controls.'));

  children.push(pb());

  children.push(h2('4.2 USER INTERFACE COMPONENTS & GLASSMORPHISM'));
  children.push(p('The UI implements a 3D Glassmorphism design system using CSS variables, semi-transparent surfaces (rgba(15, 23, 42, 0.75)), backdrop-filter blur(16px), cyan lighting accents, and a zero-flash dark/light mode toggle.'));

  children.push(pb());

  children.push(h2('4.3 VENUE & SEAT/CAPACITY SELECTION INTERFACE'));
  children.push(p('The capacity selection interface evaluates hall dimensions against architectural standards (banquet seating 12-15 sq ft/guest; theater seating 8-10 sq ft/guest), alerting hosts if guest scale exceeds hall fire clearances.'));

  children.push(pb());

  children.push(h2('4.4 BOOKING AND PAYMENT INTERFACE'));
  children.push(p('The booking interface manages date selection, owner approval workflows, 25% advance token calculation, Razorpay checkout modal (UPI, Netbanking, Cards), cryptographic HMAC signature verification, and instant vector PDF invoice generation.'));

  children.push(pb());

  children.push(h1('5)  BACKEND IMPLEMENTATION'));
  children.push(h2('5.1 NODE.JS SERVER & REST APIS'));
  children.push(p('The backend server runs on Node.js and Express.js, providing asynchronous non-blocking request handling. Protected by Helmet HTTP headers, CORS policies, express-rate-limit guards, and JWT session authentication.'));

  children.push(pb());

  children.push(h2('5.2 BOOKING MANAGEMENT & FINITE STATE MACHINE'));
  children.push(p('The booking engine enforces a strict finite state machine: PENDING_OWNER_APPROVAL -> APPROVED -> PAYMENT_PENDING -> CONFIRMED -> COMPLETED/CANCELLED, backed by atomic database queries that prevent date collisions.'));

  children.push(pb());

  children.push(h1('6)  DATABASE (SUPABASE POSTGRESQL)'));
  children.push(p('Supabase Cloud PostgreSQL provides relational schema persistence across 22 specialized tables (profiles, user_roles, owners, venues, venue_categories, venue_pricing, bookings, payments, transactions, reviews) protected by Row Level Security (RLS) policies.'));

  children.push(pb());

  children.push(h1('7)  IMPLEMENTATION AND TESTING'));
  children.push(h2('7.1 IMPLEMENTATION METHODOLOGY & 7.2 TESTING PROCEDURES'));
  children.push(p('The project followed a test-driven Agile lifecycle. An automated test suite comprising 20 verification suites validated authentication, search indexing, booking logic, vector PDF generation, HMAC payment security, and Supabase migrations with a 100% pass rate.'));

  children.push(pb());

  children.push(h1('8)  IMPORTANT CODE SNIPPETS'));
  children.push(h2('8.1 Express Bootstrap, 8.2 Three.js 3D WebGL, 8.3 Supabase RLS, 8.4 Razorpay HMAC Verification'));
  children.push(p('Documented production code implementations demonstrating server security pipelines, WebGL rendering loops, PostgreSQL schema definitions, and constant-time cryptographic payment signature checks.'));

  children.push(pb());

  // Screenshots in Word document
  children.push(h1('9)  SYSTEM INTERFACE (WEBSITE SCREENSHOTS)'));
  children.push(p('This section presents live screen captures of the Hall Khoj Finder web application across desktop and mobile devices.'));

  const screenshots = [
    { file: 'fig_9_1_homepage.png', label: 'Figure 9.1: Home Page of Hall Khoj Finder Platform' },
    { file: 'fig_9_2_search_venues.png', label: 'Figure 9.2: Venue Exploration & Services Listing Page' },
    { file: 'fig_9_3_booking.png', label: 'Figure 9.3: Booking and Payment Interface' },
    { file: 'fig_9_4_3d_preview.png', label: 'Figure 9.4: 3D Interactive Venue Walkthrough & Layout Inspector' },
    { file: 'fig_9_5_auth_login.png', label: 'Figure 9.5: Authentication & Google Sign-In Interface' },
    { file: 'fig_9_6_compare.png', label: 'Figure 9.6: Compare Wedding Venues Side-by-Side' }
  ];

  screenshots.forEach(s => {
    const sPath = path.join(SCREENSHOTS_DIR, s.file);
    if (fs.existsSync(sPath)) {
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 60 },
        children: [new TextRun({ text: s.label, font: 'Times New Roman', size: 24, bold: true, underline: {} })]
      }));
      const imgData = fs.readFileSync(sPath);
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new ImageRun({
            data: imgData,
            transformation: { width: 550, height: 310 },
            type: 'png'
          })
        ]
      }));
    }
  });

  children.push(pb());

  children.push(h1('10)  BENEFITS AND ADVANTAGES'));
  children.push(p('Key advantages include direct 0% brokerage, realistic 3D venue walkthroughs, prevention of double-booking, verified vendor KYC, built-in wedding budget calculators, cryptographic payment security, and bilingual accessibility.'));

  children.push(pb());

  children.push(h1('11)  CHALLENGES AND SOLUTIONS'));
  children.push(p('Addressed technical challenges including WebGL mobile optimization, atomic date validation under concurrency, timing-safe cryptographic signature comparison, database schema deduplication, and high-speed execution without bloated frameworks.'));

  children.push(pb());

  children.push(h1('12)  FUTURE ENHANCEMENTS'));
  children.push(p('Future roadmap features include WebSockets real-time host-vendor messaging, Augmented Reality (AR) mobile decor placement, drone 360-degree aerial venue scans, AI event assistant automated scheduling, and native mobile apps.'));

  children.push(pb());

  children.push(h1('13)  REFERENCES'));
  children.push(p('1. GitHub Repository: https://github.com/hallkhoj/hall-khoj-finder\n2. Mozilla Developer Network (MDN Web Docs): HTML5, CSS3 & ECMAScript 6+\n3. Three.js Official Documentation: https://threejs.org\n4. Node.js & Express.js Documentation: https://nodejs.org | https://expressjs.com\n5. Supabase PostgreSQL Cloud Documentation: https://supabase.com/docs\n6. Razorpay Payment Gateway API Reference: https://razorpay.com/docs\n7. Git SCM Documentation: https://git-scm.com/docs'));

  const docxDoc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1)
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
                new TextRun({ children: [PageNumber.CURRENT], font: 'Times New Roman', size: 20 })
              ]
            })
          ]
        })
      },
      children: children
    }]
  });

  const buffer = await Packer.toBuffer(docxDoc);
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`✅ Successfully generated official Word report!`);
  console.log(`📁 Saved to: ${OUTPUT_PATH}`);
}

generateDocx().catch(err => {
  console.error('Error generating DOCX:', err);
  process.exit(1);
});
