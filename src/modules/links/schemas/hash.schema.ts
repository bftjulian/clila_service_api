import * as mongoose from 'mongoose';

const HashSchema = new mongoose.Schema({
  hash: {
    type: String,
    index: true,
    trim: true,
    required: true,
    unique: true,
  },
  hash_length: {
    type: Number,
    required: true,
  },
  in_use: {
    type: Boolean,
    default: false,
  },
  permanent: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    trim: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    trim: true,
    default: Date.now,
  },
});

HashSchema.pre('save', function (next) {
  this.updated_at = new Date(Date.now());
  return next();
});

export { HashSchema };
