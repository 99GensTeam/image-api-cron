import mongoose, { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    root: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    lifespan: {
      type: String,
      required: true
    },
  },
  { timestamps: {} },
);

imageSchema.pre('save', function (next) {
  return next();
});

imageSchema.set('toObject', { virtuals: true });
imageSchema.set('toJSON', { virtuals: true });

const modelObj = mongoose.model('image', imageSchema);
export default modelObj;
