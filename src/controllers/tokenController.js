import jwt from "jsonwebtoken";

export const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ valid: false });
      }
      res.json({ valid: true });
    });
  } else {
    res.status(401).json({ valid: false });
  }
};
