import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  tokenNumber: {
    type: String,
    required: true,
    unique: true
  },
  eventType: {
    type: String,
    required: true,
    default: 'garba'
  },
  bookingDate: {
    type: Date,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  specialRequests: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['booked', 'checked-in', 'cancelled'],
    default: 'booked'
  },
  checkedInAt: {
    type: Date
  },
  checkedInBy: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique token number
BookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    let tokenNumber;
    let isUnique = false;
    
    while (!isUnique) {
      // Generate token in format: GB + 6 digits
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      tokenNumber = `GB${randomNum}`;
      
      // Check if token already exists
      const existingBooking = await this.constructor.findOne({ tokenNumber });
      if (!existingBooking) {
        isUnique = true;
      }
    }
    
    this.tokenNumber = tokenNumber;
  }
  
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
