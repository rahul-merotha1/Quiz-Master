import jwt from "jsonwebtoken";

// 🔐 VERIFY TOKEN
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    );

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


// 🔥 ROLE CHECK (TEACHER)
export const verifyTeacher = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher access only" });
  }
  next();
};