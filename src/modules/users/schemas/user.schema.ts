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
});
