const bookController = require("../controllers/BookController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

// ADD a BOOK

router.post("/", middlewareController.verifyToken, bookController.addABook);

router.get("/", middlewareController.verifyToken, bookController.getAllBooks);

router.get(
     "/:id",
     middlewareController.verifyToken,
     bookController.getDetailsBook
);

router.put(
     "/:id",
     middlewareController.verifyToken,
     bookController.updateABook
);

router.delete(
     "/:id",
     middlewareController.verifyTokenAndAdminAuth,
     bookController.deleteBook
);

module.exports = router;
