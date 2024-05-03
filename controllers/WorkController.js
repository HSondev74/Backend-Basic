const { Work } = require("../models/model");

const workController = {
     addWork: async (req, res) => {
          if (!req.body.name) {
               return res
                    .status(400)
                    .json({ message: "Missing required fields" });
          }
          try {
               const newWork = new Work(req.body);
               const savedWork = await newWork.save();
               res.status(201).json(savedWork);
          } catch (error) {
               console.error("Failed to add work:", error);
               res.status(500).json({
                    message: "Error adding work",
                    details: error.message,
               });
          }
     },
     getAllWork: async (req, res) => {
          try {
               const allWork = await Work.find();
               res.status(200).json(allWork);
          } catch (error) {
               console.error("Failed to get all Work:", error);
               res.status(500).json({
                    message: "Error retrieving Work",
                    details: error.message,
               });
          }
     },
     getDetailsWork: async (req, res) => {
          if (!req.params.id) {
               return res.status(400).json({ message: "No work ID provided" });
          }
          try {
               const work = await Work.findById(req.params.id);
               if (!work) {
                    return res.status(404).json({ message: "Work not found" });
               }
               res.status(200).json(work);
          } catch (error) {
               console.error("Failed to get work details:", error);
               res.status(500).json({
                    message: "Error finding work",
                    details: error.message,
               });
          }
     },
     updateWork: async (req, res) => {
          if (!req.params.id) {
               return res.status(400).json({ message: "No work ID provided" });
          }
          try {
               const updatedWork = await Work.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true }
               );
               if (!updatedWork) {
                    return res.status(404).json({ message: "Work not found" });
               }
               res.status(200).json({
                    message: "Work updated successfully",
                    updatedWork,
               });
          } catch (error) {
               console.error("Failed to update work:", error);
               res.status(500).json({
                    message: "Error updating work",
                    details: error.message,
               });
          }
     },
     deleteWork: async (req, res) => {
          if (!req.params.id) {
               return res.status(400).json({ message: "No work ID provided" });
          }
          try {
               const deletedWork = await Work.findByIdAndDelete(req.params.id);
               if (!deletedWork) {
                    return res.status(404).json({ message: "Work not found" });
               }
               res.status(200).json({ message: "Work deleted successfully" });
          } catch (error) {
               console.error("Failed to delete work:", error);
               res.status(500).json({
                    message: "Error deleting work",
                    details: error.message,
               });
          }
     },
};

module.exports = workController;
