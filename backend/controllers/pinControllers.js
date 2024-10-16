import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  const fileUrl = getDataUrl(file);

  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);

  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });

  res.json({
    message: "Pin Created",
  });
});

export const getAllPins = TryCatch(async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 });

  res.json(pins);
});

export const getSinglePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id).populate("owner", "-password");

  res.json(pin);
});

export const commentOnPin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No Pin with this id",
    });

  pin.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await pin.save();

  res.json({
    message: "Comment Added",
  });
});



export const deleteComment = TryCatch(async (req, res) => {
  // Find the pin by ID
  const pin = await Pin.findById(req.params.id);
  
  if (!pin) {
    return res.status(400).json({ message: "No Pin with this ID." });
  }

  // Ensure comment ID is provided
  if (!req.query.commentId) {
    return res.status(404).json({ message: "Please provide a comment ID." });
  }

  // Find the comment index
  const commentIndex = pin.comments.findIndex(
    (item) => item._id.toString() === req.query.commentId.toString()
  );

  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found." });
  }

  // Check if the logged-in user owns the comment
  const comment = pin.comments[commentIndex];
  if (comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not the owner of this comment." });
  }

  // Remove the comment and save the pin
  pin.comments.splice(commentIndex, 1);
  await pin.save();

  // Return success message
  return res.json({ message: "Comment Deleted." });
});


export const deletePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No Pin with this id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  await cloudinary.v2.uploader.destroy(pin.image.id);

  await pin.deleteOne();

  res.json({
    message: "Pin Deleted",
  });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No Pin with this id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();

  res.json({
    message: "Pin updated",
  });
});

export const likePin = async (req, res) => {
  const pinId = req.params.id;
  const userId = req.user.id; 

  try {
    const pin = await Pin.findById(pinId);

    
    if (pin.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this pin." });
    }

 
    pin.likes.push(userId);
    await pin.save();

    res.status(200).json({ message: "Pin liked successfully!", likes: pin.likes });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};

export const getPin = async (req, res) => {
  const pinId = req.params.id;

  try {
    const pin = await Pin.findById(pinId)
      .populate('likes', 'name')
      .populate('owner', 'name'); 

    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }

    res.status(200).json(pin);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", error });
  }
};



export const unlikePin = TryCatch(async (req, res) => {
    const pinId = req.params.id;
    const userId = req.user.id; 
  
    const pin = await Pin.findById(pinId);
  
    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }
  
    // Check if the user has not liked the pin yet
    const alreadyLiked = pin.likes.includes(userId);
    if (!alreadyLiked) {
      return res.status(400).json({ message: "You haven't liked this pin yet." });
    }
  
    // Remove the user ID from the likes array
    pin.likes = pin.likes.filter(id => id.toString() !== userId);
    await pin.save();
  
    res.status(200).json({ message: "Pin unliked successfully", likes: pin.likes });
  });

