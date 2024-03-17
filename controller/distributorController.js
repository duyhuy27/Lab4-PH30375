import Distributor from "../models/distributorsModel.js";

export const home = async (req, res) => {
  try {
    const dis = await Distributor.find({}).limit(22);
    res.render("dis", { dis });
  } catch (error) {
    console.log(error);
  }
};
// Tao distributor moi
export const create = async (req, res) => {
  try {
    const distributorData = new Distributor(req.body);
    const { name } = distributorData;
    const distributorExists = await Distributor.findOne({ name });

    if (distributorExists) {
      return res.status(400).json({
        error: "Distributor already exists",
      });
    }

    const saveDistributor = await distributorData.save();
    res.status(201).json({
      status: "200",
      message: "Distributor created successfully",
      data: saveDistributor,
    });
  } catch (error) {
    console.error("Error creating distributor:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// lay tat ca distributor
export const fetch = async (req, res) => {
  try {
    const distributors = await Distributor.find();
    if (distributors.length === 0) {
      return res.status(404).json({
        status: "404",
        message: "No distributors found",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Get all distributors successfully",
      data: distributors,
    });
  } catch (error) {
    console.error("Error fetching distributors:", error);
    res.status(500).json({
      status: "500",
      error: "Internal server error",
    });
  }
};

// Cập nhật thông tin distributor
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const distributorExist = await Distributor.findById(id);
    if (!distributorExist) {
      return res.status(404).json({
        status: "404",
        message: "Distributor not found.",
      });
    }
    const updatedDistributor = await Distributor.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "200",
      message: "Distributor updated successfully",
      distributor: updatedDistributor,
    });
  } catch (error) {
    console.error("Error updating distributor:", error);
    res.status(500).json({
      status: "500",
      error: "Internal Server Error.",
    });
  }
};

// Xóa distributor
export const deleteDistributor = async (req, res) => {
  try {
    const id = req.params.id;
    const distributorExist = await Distributor.findById(id);
    if (!distributorExist) {
      return res.status(404).json({ message: "Distributor not found." });
    }
    await Distributor.findByIdAndDelete(id);
    res.status(200).json({ message: "Distributor deleted successfully" });
  } catch (error) {
    console.error("Error deleting distributor:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Lấy thông tin distributor theo id
export const fetchById = async (req, res) => {
  try {
    const id = req.params.id;
    const distributor = await Distributor.findById(id);
    if (!distributor) {
      return res.status(404).json({
        status: "404",
        message: "Distributor not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching distributor:", error);
    res.status(500).json({
      status: "500",
      error: "Internal Server Error.",
    });
  }
};





