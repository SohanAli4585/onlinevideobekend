const db = require("../server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
const register = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ message: "User registered successfully" });
        }
    );
};

// Login
const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "সব ফিল্ড পূরণ করুন" });

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) return res.status(401).json({ message: "Password is incorrect" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
};

module.exports = { register, login };
