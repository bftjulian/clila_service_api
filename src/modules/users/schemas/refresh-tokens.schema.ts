import * as mongoose from 'mongoose';

export const RefreshTokenSchema = new mongoose.Schema({
  refresh_token: {
    type: String,
    trim: true,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  created_at: {
    type: Date,
    required: true,
    trim: true,
  },

  updated_at: {
    type: Date,
    required: false,
    trim: true,
  },
});
