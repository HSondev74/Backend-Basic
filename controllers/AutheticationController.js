const { Register } = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authController = {
     register: async (req, res) => {
          try {
               const existingUser = await Register.findOne({
                    $or: [
                         { username: req.body.username },
                         { email: req.body.email },
                    ],
               });

               if (existingUser) {
                    return res
                         .status(400)
                         .json({ message: "Username or email already exists" });
               }

               const salt = await bcrypt.genSalt(10);
               const hashed = await bcrypt.hash(req.body.password, salt);

               // create a new user
               const newUser = await new Register({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed,
                    admin: req.body.admin,
               });

               // save in DB

               const user = await newUser.save();

               res.status(200).json(user);
          } catch (error) {
               res.status(500).json(error);
          }
     },
     login: async (req, res) => {
          try {
               const user = await Register.findOne({
                    username: req.body.username,
               });
               if (!user) {
                    res.status(404).json({ message: "username not found" });
               }
               const validPassword = await bcrypt.compare(
                    req.body.password,
                    user.password
               );

               if (!validPassword) {
                    res.status(404).json({ message: "password is incorrect" });
               }

               if (user && validPassword) {
                    const accessToken = jwt.sign(
                         {
                              id: user.id,
                              admin: user.admin,
                         },
                         process.env.ACCESS_TOKEN_SECRET,
                         { expiresIn: "2h" }
                    );
                    const refreshToken = jwt.sign(
                         {
                              id: user.id,
                              admin: user.admin,
                         },
                         process.env.ACCESS_REFRESH_TOKEN,
                         { expiresIn: "365d" }
                    );
                    res.cookie("refreshToken", refreshToken, {
                         httpOnly: true,
                         secure: true,
                         path: "/",
                         sameSite: "strict",
                    });
                    const { password, ...others } = user._doc;
                    res.status(200).json({ others, accessToken });
               }
          } catch (error) {
               res.status(500).json(error);
          }
     },
     requestRefreshToken: async (req, res) => {
          // take the refresh token from user
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken)
               return res.status(401).json("you are not authenticated");
          jwt.verify(
               refreshToken,
               process.env.ACCESS_REFRESH_TOKEN,
               (err, user) => {
                    if (err) {
                         console.log(err);
                    }
                    // create new access token, refresh token
                    const newAccessToken = jwt.sign(
                         {
                              id: user.id,
                              admin: user.admin,
                         },
                         process.env.ACCESS_TOKEN_SECRET,
                         { expiresIn: "2h" }
                    );
                    const newRefreshToken = jwt.sign(
                         {
                              id: user.id,
                              admin: user.admin,
                         },
                         process.env.ACCESS_TOKEN_SECRET,
                         { expiresIn: "365d" }
                    );
                    res.cookie("refreshToken", newRefreshToken, {
                         httpOnly: true,
                         secure: true,
                         path: "/",
                         sameSite: "strict",
                    });

                    res.status(200).json({ accessToken: newAccessToken });
               }
          );
     },
     logout: async (req, res) => {
          res.clearCookie("refreshToken");
          res.status(200).json("Logged out!");
     },
};

module.exports = authController;
