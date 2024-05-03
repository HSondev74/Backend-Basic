const genreController = require("../controllers/GenreController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/", middlewareController.verifyToken, genreController.createGenre);

router.get("/", middlewareController.verifyToken, genreController.getAllGenres);

router.get(
     "/:id",
     middlewareController.verifyToken,
     genreController.getGenreById
);

router.put(
     "/:id",
     middlewareController.verifyToken,
     genreController.updateGenre
);

router.delete(
     "/:id",
     middlewareController.verifyToken,
     genreController.deleteGenre
);

module.exports = router;
