const db = require("../server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Register Controller
// =======================
const register = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });
  }

  // Check duplicate email
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error (register):", err);
      return res.status(500).json({ message: "Server error", fatal: true });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Insert error (register):", err);
          return res.status(500).json({ message: "Server error", fatal: true });
        }

        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId,
        });
      }
    );
  });
};

// =======================
// Login Controller
// =======================
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error (login):", err);
      return res.status(500).json({ message: "Server error", fatal: true });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    // যদি JWT_SECRET .env ফাইলে না থাকে তবে default secret ব্যবহার করবে
    const secret = process.env.JWT_SECRET || "default_secret_key";

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
};

module.exports = { register, login };
