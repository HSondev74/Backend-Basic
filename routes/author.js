const authorController = require("../controllers/AuthorController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

// ADD AUTHOR

router.post("/", middlewareController.verifyToken, authorController.addAuthor);

// GET ALL AUTHORS

router.get(
     "/",
     middlewareController.verifyToken,
     authorController.getAllAuthors
);

router.get(
     "/:author",
     middlewareController.verifyToken,
     authorController.getDetailsAuthor
);

router.put(
     "/:author",
     middlewareController.verifyToken,
     authorController.updateAuthor
);

router.delete(
     "/:id",
     middlewareController.verifyToken,
     authorController.deleteAuthor
);

module.exports = router;
