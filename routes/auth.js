import express from "express";
import {
  addStudent,
  getAllStudents,
  getOneStudent,
  updateStudent,
  deleteStudent,
} from "../controller/authController.js";

const router = express.Router();

router.get("/students", getAllStudents);
router.get("/students/:id", getOneStudent);
router.post("/students", addStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;
