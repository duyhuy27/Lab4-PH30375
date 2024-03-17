import express from "express";

import {
  fetch,
  create,
  update,
  deleteDistributor,
  home,
} from "../controller/distributorController.js";

const distributorsRoute = express.Router();

distributorsRoute.get("/", home);
distributorsRoute.get("/get", fetch);
distributorsRoute.post("/create", create);
distributorsRoute.put("/update/:id", update);
distributorsRoute.delete("/delete/:id", deleteDistributor);

export default distributorsRoute;
