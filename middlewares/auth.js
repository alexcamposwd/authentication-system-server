const jwt = require("jsonwebtoken");
import dotenv from 'dotenv';
dotenv.config();

export const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    const token = authHeader.split(" ")[1]
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) res.status(403).json("Token inválido!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("Acesso negado!");
  }
};
