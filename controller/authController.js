import Student from "../model/Student.js";
import { z } from "zod";
import { createStudentSchema } from "../validations/student.validate.js";

// add a new student
export const addStudent = async (req, res) => {
  try {
    const { firstname, lastname, gender, email, matric_no } = req.body;

    // Validate input data
    const result = createStudentSchema.safeParse(req.body);

    if (!result.success) {
      const errors = z.flattenError(result.error);
      return res
        .status(400)
        .json({ success: false, errors: errors.fieldErrors });
    }

    // Check for existing email AND matric_no in single query
    const existingStudent = await Student.findOne({
      $or: [{ email }, { matric_no }],
    });

    if (existingStudent) {
      if (existingStudent.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (existingStudent.matric_no === matric_no) {
        return res.status(400).json({
          success: false,
          message: "Matriculation Number already exists",
        });
      }
    }

    // create new student
    const student = new Student({
      firstname,
      lastname,
      gender,
      email,
      matric_no,
    });

    // save student document
    await student.save();

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error adding student: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all students data
export const getAllStudents = async (req, res) => {
  try {
    // Add projection to only get needed fields
    const students = await Student.find()
      .select("firstname lastname gender email matric_no createdAt")
      .sort({ createdAt: -1 })
      .lean(); // Returns plain JS objects (faster)

    return res.status(200).json({
      success: true,
      message: "Students data retrieved successfully",
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error("Error getting all students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a particular student data
export const getOneStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error getting student:", error);

    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// update a student data
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, gender, email, matric_no } = req.body;

    // Validate input data
    const result = createStudentSchema.safeParse(req.body);
    if (!result.success) {
      const errors = z.flattenError(result.error);
      return res
        .status(400)
        .json({ success: false, errors: errors.fieldErrors });
    }

    // Check for duplicates in single query
    const duplicateCheck = await Student.findOne({
      $and: [{ _id: { $ne: id } }, { $or: [{ email }, { matric_no }] }],
    });

    if (duplicateCheck) {
      if (duplicateCheck.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (duplicateCheck.matric_no === matric_no) {
        return res.status(400).json({
          success: false,
          message: "Matriculation number already exists",
        });
      }
    }

    // Update student using findByIdAndUpdate for better performance
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        firstname,
        lastname,
        gender,
        email,
        matric_no,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run model validators
        lean: true, // Returns plain JS object
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("Student updated successfully:", updatedStudent);

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// delete a student data
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student data deleted successfully",
      data: student,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
