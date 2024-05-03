const jwt = require("jsonwebtoken");

const middlewareController = {
     verifyToken: (req, res, next) => {
          const token = req.headers.token;
          if (token) {
               const accessToken = token.split(" ")[1];
               jwt.verify(
                    accessToken,
                    process.env.ACCESS_TOKEN_SECRET,
                    (err, user) => {
                         if (err) {
                              return res.status(403).json("Token is not valid");
                         }
                         req.user = user;
                         next();
                    }
               );
          } else {
               res.status(401).json("You are not allowed to access token");
          }
     },
     verifyTokenAndAdminAuth: (req, res, next) => {
          middlewareController.verifyToken(req, res, (err) => {
               if (err) {
                    return res.status(500).json("Internal Server Error");
               }
               if (req.user.admin) {
                    next();
               } else {
                    res.status(403).json(
                         "You need admin rights to perform this action."
                    );
               }
          });
     },
};

module.exports = middlewareController;
