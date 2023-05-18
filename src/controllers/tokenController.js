import jwtDecode from "jwt-decode";

export const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwtDecode(token);
      res.status(200).json({ valid: true, decoded });
    } catch (err) {
      res.status(401).json({ valid: false });
    }
  } else {
    res.status(401).json({ valid: false });
  }
};
