/**
 * Hall Khoj Finder — Mongoose Models Index
 * Defines schemas and registers models for all marketplace entities.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commonOptions = {
  timestamps: true,
  strict: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret.__v;
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret.id || ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
};

// 1. User Schema (Phone / Mobile-First Architecture)
const UserSchema = new Schema({
  id: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true, index: true, trim: true },
  email: { type: String, default: '', lowercase: true, trim: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
  businessCategory: { type: String, trim: true, default: '' },
  businessName: { type: String, trim: true, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  village: { type: String, default: '' },
  pinCode: { type: String, default: '' },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  favorites: [{ type: String }],
  locations: [Schema.Types.Mixed]
}, commonOptions);

// 2. Owner Schema
const OwnerSchema = new Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, index: true },
  businessName: { type: String, required: true },
  businessCategory: { type: String, required: true },
  businessType: { type: String },
  ownerName: { type: String },
  email: { type: String, lowercase: true },
  mobile: { type: String },
  city: { type: String },
  state: { type: String },
  address: { type: String },
  village: { type: String },
  pinCode: { type: String },
  gstNumber: { type: String },
  panNumber: { type: String },
  verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
  payoutDetails: Schema.Types.Mixed,
  stats: Schema.Types.Mixed
}, commonOptions);

// 3. Hall Schema
const HallSchema = new Schema({
  id: { type: String, unique: true, index: true },
  ownerId: { type: String, index: true },
  name: { type: String, required: true, index: true },
  type: { type: String, default: 'Marriage Hall' },
  category: { type: String, default: 'Marriage Halls' },
  status: { type: String, enum: ['APPROVED', 'PENDING', 'REJECTED'], default: 'APPROVED' },
  city: { type: String, index: true },
  district: { type: String },
  state: { type: String },
  area: { type: String },
  pin: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  startingPrice: { type: Number, index: true },
  capacityMin: { type: Number },
  capacityMax: { type: Number },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: true },
  has3DModel: { type: Boolean, default: true },
  coverImg: { type: String },
  images: [{ type: String }],
  facilities: [{ type: String }],
  pricing: Schema.Types.Mixed,
  availability: Schema.Types.Mixed,
  amenities: Schema.Types.Mixed
}, commonOptions);

HallSchema.index({ city: 1, category: 1, startingPrice: 1 });
HallSchema.index({ status: 1, verified: 1 });
HallSchema.index({ name: 'text', city: 'text', area: 'text', district: 'text' });


// 4. Car Schema
const CarSchema = new Schema({
  id: { type: String, unique: true, index: true },
  ownerId: { type: String, index: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Car' },
  category: { type: String, default: 'Cars' },
  status: { type: String, default: 'APPROVED' },
  brand: { type: String },
  model: { type: String },
  year: { type: Number },
  color: { type: String },
  seating: { type: Number },
  fuel: { type: String },
  transmission: { type: String },
  driverAvailable: { type: Boolean, default: true },
  city: { type: String, index: true },
  startingPrice: { type: Number },
  priceUnit: { type: String, default: 'per event' },
  rating: { type: Number, default: 5.0 },
  verified: { type: Boolean, default: true },
  coverImg: { type: String },
  images: [{ type: String }]
}, commonOptions);

// 5. Tent House Schema
const TentHouseSchema = new Schema({
  id: { type: String, unique: true, index: true },
  ownerId: { type: String, index: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Tent House' },
  category: { type: String, default: 'Tent Houses' },
  status: { type: String, default: 'APPROVED' },
  city: { type: String, index: true },
  state: { type: String },
  area: { type: String },
  pin: { type: String },
  startingPrice: { type: Number },
  rating: { type: Number, default: 5.0 },
  verified: { type: Boolean, default: true },
  services: [{ type: String }],
  coverImg: { type: String },
  images: [{ type: String }]
}, commonOptions);

// 6. Generic Service Schema
const ServiceSchema = new Schema({
  id: { type: String, unique: true, index: true },
  ownerId: { type: String, index: true },
  name: { type: String, required: true },
  type: { type: String },
  category: { type: String },
  status: { type: String, default: 'APPROVED' },
  city: { type: String, index: true },
  startingPrice: { type: Number },
  rating: { type: Number, default: 5.0 },
  verified: { type: Boolean, default: true },
  coverImg: { type: String }
}, commonOptions);

// 7. Booking Schema
const BookingSchema = new Schema({
  id: { type: String, unique: true, index: true },
  customerId: { type: String, index: true },
  customerName: { type: String },
  customerMobile: { type: String },
  customerEmail: { type: String },
  serviceId: { type: String, index: true },
  serviceName: { type: String },
  serviceCategory: { type: String },
  serviceCity: { type: String },
  ownerId: { type: String, index: true },
  eventDate: { type: String, index: true },
  guestCount: { type: Number },
  totalAmount: { type: Number },
  advanceAmount: { type: Number },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'], 
    default: 'PENDING',
    index: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED'], 
    default: 'UNPAID' 
  },
  specialRequests: { type: String },
  cancellationReason: { type: String }
}, commonOptions);

BookingSchema.index({ serviceId: 1, eventDate: 1 });
BookingSchema.index({ customerId: 1, createdAt: -1 });
BookingSchema.index({ ownerId: 1, createdAt: -1 });
BookingSchema.index({ status: 1, eventDate: 1 });


// 8. Review Schema
const ReviewSchema = new Schema({
  id: { type: String, unique: true, index: true },
  bookingId: { type: String, index: true },
  serviceId: { type: String, index: true },
  serviceName: { type: String },
  customerId: { type: String, index: true },
  customerName: { type: String },
  customerCity: { type: String },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String },
  comment: { type: String },
  photos: [{ type: String }],
  status: { type: String, enum: ['APPROVED', 'FLAGGED', 'HIDDEN'], default: 'APPROVED' },
  ownerReply: {
    text: { type: String },
    repliedAt: { type: String }
  }
}, commonOptions);

// 9. Category Schema
const CategorySchema = new Schema({
  id: { type: String, unique: true, index: true },
  slug: { type: String, unique: true, index: true },
  name: { type: String, required: true },
  icon: { type: String },
  description: { type: String },
  count: { type: Number, default: 0 }
}, commonOptions);

// 10. Notification Schema
const NotificationSchema = new Schema({
  id: { type: String, unique: true, index: true },
  userId: { type: String, index: true },
  type: { type: String },
  title: { type: String },
  message: { type: String },
  read: { type: Boolean, default: false },
  data: Schema.Types.Mixed
}, commonOptions);

// 11. Message Schema
const MessageSchema = new Schema({
  id: { type: String, unique: true, index: true },
  conversationId: { type: String, index: true },
  senderId: { type: String },
  receiverId: { type: String },
  text: { type: String },
  read: { type: Boolean, default: false }
}, commonOptions);

// 12. Staff Schema
const StaffSchema = new Schema({
  id: { type: String, unique: true, index: true },
  ownerId: { type: String, index: true },
  name: { type: String, required: true },
  mobile: { type: String },
  role: { type: String },
  experience: { type: String },
  description: { type: String }
}, commonOptions);

// 13. Audit Log Schema
const AuditLogSchema = new Schema({
  id: { type: String, unique: true, index: true },
  actorId: { type: String },
  actorRole: { type: String },
  action: { type: String },
  target: { type: String },
  details: Schema.Types.Mixed
}, commonOptions);

// 14. Transaction Schema
const TransactionSchema = new Schema({
  id: { type: String, unique: true, index: true },
  bookingId: { type: String, index: true },
  customerId: { type: String },
  ownerId: { type: String },
  amount: { type: Number },
  currency: { type: String, default: 'INR' },
  razorpayPaymentId: { type: String },
  razorpayOrderId: { type: String },
  status: { type: String }
}, commonOptions);

// Model Registry
const models = {
  users: mongoose.models.User || mongoose.model('User', UserSchema),
  owners: mongoose.models.Owner || mongoose.model('Owner', OwnerSchema),
  halls: mongoose.models.Hall || mongoose.model('Hall', HallSchema),
  cars: mongoose.models.Car || mongoose.model('Car', CarSchema),
  tent_houses: mongoose.models.TentHouse || mongoose.model('TentHouse', TentHouseSchema),
  services: mongoose.models.Service || mongoose.model('Service', ServiceSchema),
  bookings: mongoose.models.Booking || mongoose.model('Booking', BookingSchema),
  reviews: mongoose.models.Review || mongoose.model('Review', ReviewSchema),
  categories: mongoose.models.Category || mongoose.model('Category', CategorySchema),
  notifications: mongoose.models.Notification || mongoose.model('Notification', NotificationSchema),
  messages: mongoose.models.Message || mongoose.model('Message', MessageSchema),
  staff: mongoose.models.Staff || mongoose.model('Staff', StaffSchema),
  audit_logs: mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema),
  transactions: mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)
};

function getModelForCollection(collectionName) {
  return models[collectionName] || null;
}

module.exports = {
  models,
  getModelForCollection
};
