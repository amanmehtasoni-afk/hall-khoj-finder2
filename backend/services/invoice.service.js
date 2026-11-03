/**
 * Hall Khoj Finder — Programmatic PDF Invoice Generator
 * Generates verified vector PDF booking passes and official tax invoices using PDFKit.
 */

const PDFDocument = require('pdfkit');

/**
 * Generate PDF Invoice and stream directly to Express response
 * @param {Object} booking - Booking data from database
 * @param {Object} res - Express response object
 */
function generateBookingInvoicePdf(booking, res) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `Hall Khoj Finder Invoice - ${booking.id || booking.bookingId}`,
      Author: 'Hall Khoj Finder System',
      Subject: 'Official Event Booking Invoice & Reservation Pass'
    }
  });

  // Safe filename
  const cleanId = (booking.id || booking.bookingId || 'booking').replace(/[^a-zA-Z0-9-_]/g, '');
  const filename = `HallKhoj_Invoice_${cleanId}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  // --- BRAND HEADER ---
  doc.rect(40, 40, 515, 60).fill('#0d1322');

  doc.fillColor('#fbbf24')
     .font('Helvetica-Bold')
     .fontSize(20)
     .text('HALL KHOJ FINDER', 55, 52);

  doc.fillColor('#94a3b8')
     .font('Helvetica')
     .fontSize(9)
     .text('Official Event Reservation Pass & Tax Invoice', 55, 76);

  doc.fillColor('#ffffff')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('TAX INVOICE', 450, 52, { align: 'right' });

  doc.fillColor('#a5b4fc')
     .font('Helvetica')
     .fontSize(8)
     .text(`ID: ${booking.id || booking.bookingId}`, 450, 68, { align: 'right' })
     .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 450, 80, { align: 'right' });

  doc.moveDown(3);

  // --- BOOKING & CUSTOMER DETAILS SECTION ---
  const startY = 120;
  
  // Left Box: Customer Details
  doc.rect(40, startY, 250, 110).strokeColor('#334155').stroke();
  doc.fillColor('#fbbf24').font('Helvetica-Bold').fontSize(10).text('RESERVED BY (CUSTOMER):', 50, startY + 10);
  doc.fillColor('#0f172a').font('Helvetica').fontSize(9);
  doc.fillColor('#1e293b')
     .text(`Name: ${booking.customerName || 'Valued Customer'}`, 50, startY + 30)
     .text(`Phone: +91 ${booking.customerMobile || 'N/A'}`, 50, startY + 48)
     .text(`Email: ${booking.customerEmail || 'N/A'}`, 50, startY + 66)
     .text(`Account ID: ${booking.customerId || 'guest'}`, 50, startY + 84);

  // Right Box: Venue Details
  doc.rect(305, startY, 250, 110).strokeColor('#334155').stroke();
  doc.fillColor('#6366f1').font('Helvetica-Bold').fontSize(10).text('VENUE / SERVICE DETAILS:', 315, startY + 10);
  doc.fillColor('#1e293b').font('Helvetica').fontSize(9)
     .text(`Venue: ${booking.serviceName || booking.hallName || 'Event Venue'}`, 315, startY + 30, { width: 230 })
     .text(`Category: ${booking.serviceType || booking.serviceCategory || 'Marriage Hall'}`, 315, startY + 54)
     .text(`Event Date: ${booking.eventDate || 'N/A'}`, 315, startY + 70)
     .text(`Time Slot: ${booking.timeSlot || 'Full Day'} (${booking.guestCount || 100} Guests)`, 315, startY + 86);

  // --- STATUS BADGE BAR ---
  const statusY = startY + 125;
  const isPaid = booking.paymentStatus === 'ADVANCE_PAID' || booking.paymentStatus === 'PAID';
  const statusBg = isPaid ? '#10b981' : '#f59e0b';

  doc.rect(40, statusY, 515, 24).fill('#f1f5f9');
  doc.fillColor('#475569').font('Helvetica-Bold').fontSize(9)
     .text('BOOKING STATUS:', 50, statusY + 7);
  doc.fillColor('#0f172a').font('Helvetica-Bold')
     .text(`${booking.status || 'CONFIRMED'}`, 160, statusY + 7);
  doc.fillColor('#475569')
     .text('PAYMENT STATUS:', 330, statusY + 7);
  doc.fillColor(statusBg)
     .text(`${booking.paymentStatus || 'UNPAID'}`, 440, statusY + 7);

  // --- ITEM TABLE ---
  const tableY = statusY + 40;
  doc.rect(40, tableY, 515, 24).fill('#1e293b');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
     .text('Description', 50, tableY + 7)
     .text('Qty / Duration', 300, tableY + 7)
     .text('Amount (INR)', 450, tableY + 7, { align: 'right' });

  // Calculation items
  const pricing = booking.pricing || {};
  const basePrice = pricing.basePrice || booking.totalPrice || 50000;
  const cleaningFee = pricing.cleaningFee || 2500;
  const discount = pricing.discount || 5000;
  const gstTax = pricing.gstTax || Math.round((basePrice + cleaningFee - discount) * 0.18);
  const totalAmount = pricing.totalAmount || booking.totalPrice || (basePrice + cleaningFee - discount + gstTax);
  const advanceRequired = pricing.advanceRequired || Math.round(totalAmount * 0.25);
  const balanceRemaining = isPaid ? Math.max(0, totalAmount - advanceRequired) : totalAmount;

  const rows = [
    { desc: `${booking.serviceName || 'Venue'} Reservation (${booking.timeSlot || 'Full Day'})`, qty: '1 Event', amt: basePrice },
    { desc: 'Sanitization, Cleaning & Maintenance Support', qty: 'Standard', amt: cleaningFee },
    { desc: 'Platform Festive Booking Discount', qty: 'Promo', amt: -discount },
    { desc: 'GST Applicable (18% Goods & Services Tax)', qty: '18%', amt: gstTax }
  ];

  let currentY = tableY + 28;
  rows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.rect(40, currentY - 4, 515, 20).fill('#f8fafc');
    }
    doc.fillColor('#1e293b').font('Helvetica').fontSize(9)
       .text(r.desc, 50, currentY)
       .text(r.qty, 300, currentY)
       .text(`₹${Math.abs(r.amt).toLocaleString('en-IN')}${r.amt < 0 ? ' (Dr)' : ''}`, 450, currentY, { align: 'right' });
    currentY += 20;
  });

  // --- TOTALS SUMMARY BOX ---
  currentY += 10;
  doc.rect(300, currentY, 255, 95).strokeColor('#cbd5e1').stroke();

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a')
     .text('Total Booking Amount:', 310, currentY + 12)
     .text(`₹${totalAmount.toLocaleString('en-IN')}`, 450, currentY + 12, { align: 'right' });

  doc.font('Helvetica').fontSize(9).fillColor('#64748b')
     .text('Advance Token (25%):', 310, currentY + 32)
     .text(`₹${advanceRequired.toLocaleString('en-IN')}`, 450, currentY + 32, { align: 'right' });

  doc.fillColor(isPaid ? '#10b981' : '#f59e0b')
     .text(isPaid ? 'Advance Paid:' : 'Advance Due:', 310, currentY + 50)
     .text(`₹${advanceRequired.toLocaleString('en-IN')}`, 450, currentY + 50, { align: 'right' });

  doc.font('Helvetica-Bold').fontSize(10).fillColor('#0f172a')
     .text('Balance Due at Venue:', 310, currentY + 70)
     .text(`₹${balanceRemaining.toLocaleString('en-IN')}`, 450, currentY + 70, { align: 'right' });

  // --- TERMS & SECURITY STAMP ---
  const footerY = 620;
  doc.rect(40, footerY, 515, 110).strokeColor('#e2e8f0').stroke();

  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9)
     .text('TERMS & IMPORTANT INSTRUCTIONS:', 50, footerY + 10);

  doc.fillColor('#64748b').font('Helvetica').fontSize(8)
     .text('1. Present this digital or printed pass along with a valid Government ID at the venue upon arrival.', 50, footerY + 26)
     .text('2. The date slot is locked and protected by Hall Khoj Atomic Conflict Prevention.', 50, footerY + 38)
     .text('3. Remaining 75% balance must be settled with the venue manager according to standard venue policies.', 50, footerY + 50)
     .text('4. For cancellations or emergency date shifts, please contact platform support or your venue manager.', 50, footerY + 62);

  doc.fillColor('#94a3b8').font('Helvetica-Oblique').fontSize(8)
     .text('Generated electronically by Hall Khoj Finder • 3-Server Redundant Cluster • Support: help@hallkhoj.in', 50, footerY + 86, { align: 'center', width: 495 });

  doc.end();
}

module.exports = {
  generateBookingInvoicePdf
};
