import express from "express";

import {
  createFruits,
  deleteFruits,
  updateFruits,
  home,
  addScreen,
  fetchFruits,
} from "../controller/fruitsController.js";

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  dest: "/tmp",
});

const fruitsRoute = express.Router();
//api/fr/ => home
fruitsRoute.get("/", home);
fruitsRoute.get("/add", addScreen);
fruitsRoute.post(
  "/create",
  uploader.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createFruits
);
fruitsRoute.get("/getAll", fetchFruits);
fruitsRoute.delete("/delete/:id", deleteFruits);
fruitsRoute.put("/update/:id", updateFruits);

export default fruitsRoute;
