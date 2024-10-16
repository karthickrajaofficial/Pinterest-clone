import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  commentOnPin,
  createPin,
  deleteComment,
  deletePin,
  getAllPins,
  getSinglePin,
  updatePin,
  likePin,
  getPin,
  unlikePin
} from "../controllers/pinControllers.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile, createPin);
router.get("/all", isAuth, getAllPins);
router.get("/:id", isAuth, getSinglePin);
router.put("/:id", isAuth, updatePin);
router.delete("/:id", isAuth, deletePin);
router.post("/comment/:id", isAuth, commentOnPin);
router.delete("/comment/:id", isAuth, deleteComment);
router.post("/like/:id", isAuth, likePin);
router.post("/unlike/:id",isAuth, unlikePin);
router.get("/:id", getPin);

export default router;
