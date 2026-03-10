const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./models/User");
const Marks = require("./models/Marks");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

/* ================= REGISTER ================= */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    res.json({ msg: "Registered Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

/* ================= LOGIN ================= */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    res.json({
      msg: "Login Success",
      id: user._id,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

/* ================= GET STUDENTS ================= */
app.get("/api/students", async (req, res) => {
  const students = await User.find({ role: "student" });
  res.json(students);
});

/* ================= ADD MARKS ================= */
app.post("/api/add-marks", async (req, res) => {
  const { studentId, subject, marks, attendance, suggestion } = req.body;

  const data = new Marks({
    studentId,
    subject,
    marks,
    attendance,
    suggestion,
  });

  await data.save();
  res.json({ msg: "Marks Added" });
});
// Get marks for logged-in student
app.get("/api/student-marks/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const marks = await Marks.find({ studentId: user._id });

    res.json(marks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});
// Get marks of specific student
app.get("/api/student-marks/:studentId", async (req, res) => {

  try {

    const marks = await Marks.find({
      studentId: req.params.studentId
    });

    res.json(marks);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching marks" });
  }

});


/* ================= STUDENT VIEW MARKS ================= */
app.get("/api/marks/:studentId", async (req, res) => {
  const data = await Marks.find({ studentId: req.params.studentId });
  res.json(data);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
