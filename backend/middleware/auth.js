import jwt from "jsonwebtoken";

export const vertifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json("Access Denied"); // 403 Forbidden

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft(); // Remove Bearer from string and remove leading whitespace and extracting the token (simple js stuff)
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(401).json("Token verification failed"); // 401 Unauthorized
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
