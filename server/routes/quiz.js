import express from "express";
import db from "../db.js";
import { verifyToken, verifyTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/all-questions", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM questions");

    const formatted = rows.map(q => ({
      question: q.question,
      options: [q.option1, q.option2, q.option3, q.option4], // ✅ FIXED
      answer: q.answer
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: "Error fetching questions" });
  }
});

// ➕ ADD QUESTION (TEACHER ONLY)
router.post("/add-question", verifyToken, verifyTeacher, async (req, res) => {
  const { question, option1, option2, option3, option4, answer } = req.body;

  try {
    await db.query(
      "INSERT INTO questions (question, choice_a, choice_b, choice_c, choice_d, answer) VALUES (?, ?, ?, ?, ?, ?)",
      [question, option1, option2, option3, option4, answer]
    );

    res.json({ message: "Question added successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error adding question" });
  }
});


// 📊 SUBMIT RESULT
router.post("/submit-result", verifyToken, async (req, res) => {
  const { score, total } = req.body;

  try {
    await db.query(
      "INSERT INTO results (user_id, score, total) VALUES (?, ?, ?)",
      [req.user.id, score, total]
    );

    res.json({ message: "Result saved" });

  } catch (err) {
    res.status(500).json({ message: "Error saving result" });
  }
});

export default router;