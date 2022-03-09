import * as mongoose from 'mongoose';

export const LinkInfosSchema = new mongoose.Schema({
  ip: {
    type: String,
    trim: true,
    default: null,
  },
  create_at: {
    type: Date,
    trim: true,
  },
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true,
  },
});
