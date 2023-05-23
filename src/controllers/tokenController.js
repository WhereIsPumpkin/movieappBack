import jwtDecode from "jwt-decode";
import User from "../models/User.js";

export const verifyToken = async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentUser = await User.findOne({ mail: decoded.mail });
      res.status(200).json({ valid: true, user: currentUser });
    } catch (err) {
      res.status(401).json({ valid: false });
    }
  } else {
    res.status(401).json({ valid: false });
  }
};
