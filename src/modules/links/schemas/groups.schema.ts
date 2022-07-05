import * as mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    original_link: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      default: 'ONE_ORIGINAL_LINK',
      enum: ['ONE_ORIGINAL_LINK', 'MULTIPLE_ORIGINAL_LINKS'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    links: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    total_clicks: {
      type: Number,
      default: 0,
      trim: true,
    },
    created_at: {
      type: Date,
      trim: true,
    },
    updated_at: {
      type: Date,
      trim: true,
    },
  },
  { timestamps: true },
);

GroupSchema.pre('save', function (next) {
  this.updated_at = new Date(Date.now());
  return next();
});

export { GroupSchema };
