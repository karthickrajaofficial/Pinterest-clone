import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      id: String,
      url: String,
    },
    comments: [
      {
        user: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId, // Store user IDs who liked the pin
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);


export const Pin = mongoose.model("Pin", schema);
