const { Genre } = require("../models/model");

const genreController = {
     createGenre: async (req, res) => {
          try {
               const newGenre = await new Genre(req.body);
               const savedGenre = await newGenre.save();
               res.status(201).json(savedGenre);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     getAllGenres: async (req, res) => {
          try {
               const allGenres = await Genre.find();
               res.status(200).json(allGenres);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     getGenreById: async (req, res) => {
          try {
               const genre = await Genre.findById(req.params.id);
               if (!genre) {
                    return res.status(404).json({ message: "Genre not found" });
               }
               res.status(200).json(genre);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     updateGenre: async (req, res) => {
          try {
               const genre = await Genre.findById(req.params.id);
               if (!genre) {
                    return res.status(404).json({ message: "Genre not found" });
               }
               await genre.updateOne({ $set: req.body });

               res.status(200).json({ message: "Genre updated successfully" });
          } catch (error) {
               res.status(500).json(error);
          }
     },
     deleteGenre: async (req, res) => {
          try {
               const genre = await Genre.findByIdAndDelete(req.params.id);
               if (!genre) {
                    return res.status(404).json({ message: "Genre not found" });
               }
               res.json({ message: "Genre deleted successfully" });
          } catch (error) {
               res.status(500).json(error);
          }
     },
};

module.exports = genreController;
