import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token using the same secret used to sign it
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Add the decoded token data to the request object
    req.userData = decodedToken;

    // Call next() to allow the request to proceed to the protected route
    next();
  } catch (error) {
    // If there is an error verifying the token, return a 401 Unauthorized response
    res.status(401).json({ message: "Authentication failed" });
  }
};
