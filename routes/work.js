const workController = require("../controllers/WorkController");

const router = require("express").Router();

// ADD Work

router.post("/", workController.addWork);

router.get("/", workController.getAllWork);

router.get("/:id", workController.getDetailsWork);

router.put("/:id", workController.updateWork);

router.delete("/:id", workController.deleteWork);

module.exports = router;
