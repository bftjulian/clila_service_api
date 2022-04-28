import * as mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
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
