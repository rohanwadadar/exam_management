package com.exam.controller;

import com.exam.entity.ExamResult;
import com.exam.service.ExamResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/result")
@CrossOrigin("*")
public class ExamResultController {

    @Autowired
    private ExamResultService examResultService;

    // Student: Submit exam answers
    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(
            @RequestParam Long studentId,
            @RequestParam Long examId,
            @RequestBody Map<String, String> answers) {
        try {
            ExamResult result = examResultService.submitExam(studentId, examId, answers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Student: Get my results
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentResults(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok(examResultService.getResultsByStudent(studentId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Admin: Get results for a specific exam
    @GetMapping("/exam/{examId}")
    public ResponseEntity<?> getExamResults(@PathVariable Long examId) {
        try {
            return ResponseEntity.ok(examResultService.getResultsByExam(examId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Admin: Get all results
    @GetMapping("/all")
    public ResponseEntity<?> getAllResults() {
        try {
            return ResponseEntity.ok(examResultService.getAllResults());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Get single result by student + exam
    @GetMapping("/check")
    public ResponseEntity<?> checkResult(@RequestParam Long studentId, @RequestParam Long examId) {
        try {
            ExamResult result = examResultService.getResult(studentId, examId);
            if (result != null) {
                return ResponseEntity.ok(result);
            }
            return ResponseEntity.ok("No result found");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
