package com.exam.controller;

import com.exam.entity.Enrollment;
import com.exam.entity.Exam;
import com.exam.entity.User;
import com.exam.service.ExamService;
import com.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exam")
@CrossOrigin("*")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private UserService userService;

    // --- Admin Endpoints ---

    @PostMapping("/admin/")
    public ResponseEntity<?> addExam(@RequestBody Exam exam) {
        try {
            return ResponseEntity.ok(examService.addExam(exam));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/admin/")
    public ResponseEntity<?> updateExam(@RequestBody Exam exam) {
        try {
            return ResponseEntity.ok(examService.updateExam(exam));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/{examId}")
    public ResponseEntity<?> deleteExam(@PathVariable("examId") Long examId) {
        try {
            examService.deleteExam(examId);
            return ResponseEntity.ok("Exam deleted");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // --- Common Endpoints ---

    @GetMapping("/")
    public ResponseEntity<?> getAllExams() {
        try {
            return ResponseEntity.ok(examService.getAllExams());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExamById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(examService.getExamById(id));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveExams() {
        try {
            return ResponseEntity.ok(examService.getActiveExams());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/department/{deptId}")
    public ResponseEntity<?> getExamsByDepartment(@PathVariable Long deptId) {
        try {
            return ResponseEntity.ok(examService.getExamsByDepartment(deptId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> getFilteredExams(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String semester) {
        try {
            if (departmentId != null && semester != null) {
                return ResponseEntity.ok(examService.getExamsByDepartmentAndSemester(departmentId, semester));
            } else if (departmentId != null) {
                return ResponseEntity.ok(examService.getExamsByDepartment(departmentId));
            } else {
                return ResponseEntity.ok(examService.getAllExams());
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // --- Student Endpoints ---

    @PostMapping("/student/register")
    public ResponseEntity<?> registerForExam(@RequestParam Long userId, @RequestParam Long examId) {
        try {
            User user = userService.getUserById(userId);
            if (user == null) throw new RuntimeException("User not found");
            return ResponseEntity.ok(examService.registerForExam(user, examId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/student/registrations/{userId}")
    public ResponseEntity<?> getStudentRegistrations(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(examService.getStudentRegistrationsById(userId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PutMapping("/admin/enrollment")
    public ResponseEntity<?> updateEnrollment(@RequestBody Enrollment enrollment) {
        try {
            return ResponseEntity.ok(examService.updateEnrollment(enrollment));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/admin/enrollments")
    public ResponseEntity<?> getAllEnrollments() {
        try {
            return ResponseEntity.ok(examService.getAllEnrollments());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/admin/enrollments/{examId}")
    public ResponseEntity<?> getEnrollmentsByExam(@PathVariable Long examId) {
        try {
            return ResponseEntity.ok(examService.getEnrollmentsByExam(examId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
