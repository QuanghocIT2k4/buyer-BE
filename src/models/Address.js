const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    homeAddress: {
      type: String,
      required: true,
      trim: true,
      maxLength: 255,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxLength: 10,
    },
    suggestedName: {
      type: String,
      trim: true,
      maxLength: 255,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh hơn
addressSchema.index({ userId: 1 });

module.exports = mongoose.model('Address', addressSchema);

