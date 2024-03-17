import Fruits from "../models/fruitsModel.js";
import Distributor from "../models/distributorsModel.js";
import fs from "fs";
import multer from "multer";
import jwt from "jsonwebtoken";
import { error } from "console";
const SECRETKEY = "FPTPOLYTECHNIC";
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({
      status: "401",
      error: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({
      status: "401",
      error: "Invalid token",
    });
  }
};

// Call verifyToken middleware before fetching fruits

export const fetchFruits = async (req, res) => {
  try {
    // Verify token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ status: "401", error: "Unauthorized" });

    let payload;
    try {
      payload = await new Promise((resolve, reject) => {
        jwt.verify(token, SECRETKEY, (err, decoded) => {
          if (err) {
            if (err instanceof jwt.TokenExpiredError) {
              reject({ status: 401, error: "Token expired" });
            } else {
              reject({ status: 403, error: "Forbidden" });
            }
          } else {
            resolve(decoded);
          }
        });
      });
    } catch (err) {
      return res.status(err.status).json(err);
    }

    console.log(payload);
    const fruits = await Fruits.find();
    if (fruits.length === 0) {
      return res.status(404).json({
        status: "404",
        message: "No fruits found",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Get all fruits successfully",
      data: fruits,
    });
  } catch (error) {
    console.error("Error fetching fruits:", error);
    res.status(500).json({
      status: "500",
      error: "Internal server error",
    });
  }
};

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

export const home = async (req, res) => {
  try {
    const fruits = await Fruits.find({}).limit(22);
    res.render("frmanager", { fruits });
  } catch (error) {
    console.log(error);
  }
};
// Tạo fruits mới

// Cập nhật thông tin fruits
export const updateFruits = async (req, res) => {
  try {
    const id = req.params.id;
    const fruitsExist = await Fruits.findById(id);
    if (!fruitsExist) {
      return res.status(404).json({
        status: "404",
        message: "Fruits not found.",
      });
    }
    const updatedFruits = await Fruits.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "200",
      message: "Fruits updated successfully",
      data: updatedFruits,
    });
  } catch (error) {
    console.error("Error updating fruits:", error);
    res.status(500).json({
      status: "500",
      error: "Internal Server Error.",
    });
  }
};

// Xóa fruits api controller
export const deleteFruits = async (req, res) => {
  try {
    const id = req.params.id;
    const fruitsExist = await Fruits.findById(id);
    if (!fruitsExist) {
      return res.status(404).json({ message: "Fruits not found." });
    }
    await Fruits.findByIdAndDelete(id);
    res.status(200).json({ message: "Fruits deleted successfully" });
  } catch (error) {
    console.error("Error deleting fruits:", error);
    res.status(500).json({
      status: "500",
      error: "Internal Server Error.",
    });
  }
};

export const addScreen = async (req, res) => {
  try {
    // Fetch distributors and fruits data from the database
    const distributors = await Distributor.find();
    const fruits = await Fruits.find({}).limit(22);

    res.render("addfr", {
      fruits: fruits,
      distributors: distributors,
      uploader: uploader.fields([{ name: "image", maxCount: 1 }]),
      postFruits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const createFruits = async (req, res) => {
  try {
    let url_image = "";
    if (req.files && req.files["image"]) {
      const imageFile = req.files["image"][0];
      const imagePath = "./public/uploads/" + imageFile.originalname;
      await fs.renameSync(imageFile.path, imagePath);
      url_image = "/uploads/" + imageFile.originalname;
    }

    const fruitsData = new Fruits({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      status: req.body.status,
      image: url_image,
      des: req.body.des,
      id_distributor: req.body.id_distributor,
    });

    const fruitsExists = await Fruits.findOne({ name: req.body.name });
    if (fruitsExists) {
      return res.status(400).json({
        error: "Fruits already exists",
      });
    }

    const savedFruits = await fruitsData.save();

    res.status(201).json({
      status: "200",
      message: "Fruits created successfully",
      data: savedFruits,
    });
  } catch (error) {
    console.error("Error creating fruits:", error);
    res.status(500).json({
      status: "500",
      error: "Internal server error",
    });
  }
};

export const addFruits = async (req, res) => {
  try {
    // Fetch distributors data from the database
    const distributors = await Distributor.find();
    res.render("addfr", {
      distributors: distributors,
      uploader: uploader.fields([{ name: "image", maxCount: 1 }]),
      postFruits,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const postFruits = async (req, res, next) => {
  let url_image = "";
  try {
    if (req.files["image"]) {
      const imageFile = req.files["image"][0];
      fs.renameSync(
        imageFile.path,
        "./public/uploads/" + imageFile.originalname
      );
      url_image = "/uploads/" + imageFile.originalname;
    }
    const fruitsData = new Fruits({
      name: req.body.name,
      quantity: req.body.quantity,
      price: req.body.price,
      status: req.body.status,
      image: url_image,
      description: req.body.description,
      distributor: req.body.distributor,
    });
    const { name } = fruitsData;
    const fruitsExists = await Fruits.findOne({ name });
    if (fruitsExists) {
      return res.status(400).json({
        error: "Fruits already exists",
      });
    }
    await fruitsData.save();
    res.redirect("/fruits");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading fruits!");
  }
};
