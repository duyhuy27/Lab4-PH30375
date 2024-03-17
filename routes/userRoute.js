import express from "express";
import {
  fetch,
  create,
  update,
  deleteUser,
  login,
  register,
  home,
} from "../controller/userController.js";

const route = express.Router();

route.get("/", home);
route.get("/getAll", fetch);
route.post("/create", create);
route.put("/update/:id", update);
route.delete("/deleteUser/:id", deleteUser);
route.post("/register", register);
route.post("/login", login);

export default route;
