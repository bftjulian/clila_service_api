import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true,
    },
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },

  api_token: {
    type: String,
    required: true,
    trim: true,
  },

  refresh_token: {
    type: String,
    trim: true,
    default: null,
  },

  recover_password_token: {
    type: String,
    trim: true,
    default: null,
  },

  date_generate_recover_password_token: {
    type: Date,
    trim: true,
    default: null,
  },

  code_validation_email: {
    type: String,
    trim: true,
    default: null,
  },

  created_at: {
    type: Date,
    trim: true,
    default: Date.now(),
  },

  updated_at: {
    type: Date,
    trim: true,
    default: null,
  },

  date_validation_code_email: {
    type: Date,
    trim: true,
    default: null,
  },
});
