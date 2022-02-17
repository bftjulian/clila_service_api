import * as mongoose from 'mongoose';

export const LinkSchema = new mongoose.Schema({
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

  short_link: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true,
    },
  },

  hash_link: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true,
    },
  },

  numbers_clicks: {
    type: Number,
    trim: true,
    default: 0,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
