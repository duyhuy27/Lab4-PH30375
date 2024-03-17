import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";
import JWT from "jsonwebtoken";
const SECRETKEY = "FPTPOLYTECHNIC";
import transporter from "../config/mail.js";
import nodemailer from "nodemailer";

const app = express();

// Tạo người dùng mới
export const create = async (req, res) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        status: "400",
        error: "User already exists",
      });
    }

    const saveUser = await userData.save();
    res.status(201).json({
      status: "201",
      message: "Get all User successfully",
      data: saveUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      status: "500",
      error: "Internal server error",
    });
  }
};

//user send user manager view ejs
export const home = async (req, res) => {
  try {
    const users = await User.find({}).limit(22);
    res.render("usermanager", { users });
  } catch (error) {
    console.log(error);
  }
};
// Lấy tất cả người dùng từ cơ sở dữ liệu
export const fetch = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }
    // res.render("usermanager", users);
    res.status(200).json({
      status: "200",
      message: "Get all users successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      status: "500",
      error: "Internal server error",
    });
  }
};

// Cập nhật thông tin người dùng
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({
        status: "404",
        message: "User not found.",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "200",
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: "500",
      error: "Internal Server Error.",
    });
  }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Đăng ký người dùng
export const register = async (req, res) => {
  try {
    const { username, email, password, name, avatar, status } = req.body;

    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name: name,
      avatar: avatar,
      status: "onl",
    });

    // Lưu người dùng vào cơ sở dữ liệu
    const result = await newUser.save();
    if (result) {
      // Gửi email thông báo cho người dùng
      const mailOptions = {
        from: "dhuy.ftmobile@gmail.com",
        to: result.email,
        subject: "Đăng ký thành công",
        text: "Chào mừng bạn đến với ứng dụng của chúng tôi! Đăng ký thành công.",
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Đăng nhập người dùng
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Tạo và ký JWT token
    const token = jwt.sign({ userId: user._id }, "abc", {
      expiresIn: "1h",
    });
    const refreshToken = JWT.sign({ id: user._id }, SECRETKEY, {
      expiresIn: "1d",
    });
    res.status(200).json({
      status: 200,
      messenger: "Đăng nhâp thành công",
      data: user,
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
