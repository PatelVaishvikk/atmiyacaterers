
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Pre-save middleware to ensure proper formatting
EventSchema.pre('save', function(next) {
  this.name = this.name.trim();
  this.venue = this.venue.trim();
  this.description = this.description.trim();
  next();
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);