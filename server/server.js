import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { verifyToken, checkRole } from "./middleware/authMiddleware.js";

const app = express();
const PORT = 3000;
const SECRET_KEY = "mysecretkey";

app.use(cors());
app.use(express.json());

// Hardcoded users with roles
const users = [
  { id: 1, username: "adminUser", password: "admin123", role: "Admin" },
  { id: 2, username: "moderatorUser", password: "mod123", role: "Moderator" },
  { id: 3, username: "normalUser", password: "user123", role: "User" }
];

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

// Admin-only route
app.get("/admin-dashboard", verifyToken, checkRole("Admin"), (req, res) => {
  res.json({
    message: "Welcome to the Admin dashboard",
    user: req.user
  });
});

// Moderator-only route
app.get("/moderator-panel", verifyToken, checkRole("Moderator"), (req, res) => {
  res.json({
    message: "Welcome to the Moderator panel",
    user: req.user
  });
});

// User profile route (any authenticated user)
app.get("/user-profile", verifyToken, (req, res) => {
  res.json({
    message: `Welcome to your profile, ${req.user.username}`,
    user: req.user
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
