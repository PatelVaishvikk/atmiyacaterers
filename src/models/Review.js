// src/models/Review.js
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [60, 'Name too long'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [800, 'Review is too long'],
    },
    eventType: {
      type: String,
      enum: ['Wedding', 'Birthday', 'Corporate', 'Pooja / Religious', 'Tiffin Service', 'Other', ''],
      default: '',
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
