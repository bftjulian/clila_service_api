import * as mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: null,
  },
  surname: {
    type: String,
    trim: true,
    default: null,
  },
  original_link: {
    type: String,
    required: true,
    trim: true,
  },
  isMalicious: {
    type: Boolean,
    default: false,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: false,
  },
  group_ref: {
    type: Boolean,
    default: false,
    required: true,
  },
  short_link: {
    type: String,
    required: false,
    trim: false,
  },
  hash_link: {
    type: String,
    required: false,
    trim: true,
  },
  numbers_clicks: {
    type: Number,
    trim: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  active: {
    type: Boolean,
    trim: true,
    default: true,
  },
  permanent_link: {
    type: Boolean,
    trim: true,
    default: false,
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
    default: 'ACTIVE',
  },
  expired_at: {
    type: Date,
    trim: true,
    default: null,
    required: false,
  },
  create_at: {
    type: Date,
    trim: true,
    default: Date.now(),
  },
  update_at: {
    type: Date,
    trim: true,
    default: Date.now(),
  },
});

LinkSchema.pre('save', function (next) {
  this.update_at = new Date(Date.now());
  return next();
});

export { LinkSchema };
