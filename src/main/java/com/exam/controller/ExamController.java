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

    // --- Student Endpoints ---

    @PostMapping("/student/register")
    public ResponseEntity<?> registerForExam(@RequestParam Long userId, @RequestParam Long examId) {
        try {
            User user = new User();
            user.setId(userId);
            return ResponseEntity.ok(examService.registerForExam(user, examId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/student/registrations/{userId}")
    public ResponseEntity<?> getStudentRegistrations(@PathVariable Long userId) {
        try {
            User user = new User();
            user.setId(userId);
            return ResponseEntity.ok(examService.getStudentRegistrations(user));
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
}
