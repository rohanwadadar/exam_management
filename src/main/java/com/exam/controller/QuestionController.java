package com.exam.controller;

import com.exam.entity.Question;
import com.exam.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
@CrossOrigin("*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // Admin: Add single question to exam
    @PostMapping("/admin/{examId}")
    public ResponseEntity<?> addQuestion(@PathVariable Long examId, @RequestBody Question question) {
        try {
            return ResponseEntity.ok(questionService.addQuestion(examId, question));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Admin: Add bulk questions to exam
    @PostMapping("/admin/bulk/{examId}")
    public ResponseEntity<?> addBulkQuestions(@PathVariable Long examId, @RequestBody List<Question> questions) {
        try {
            return ResponseEntity.ok(questionService.addQuestions(examId, questions));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Admin: Get all questions with answers
    @GetMapping("/admin/{examId}")
    public ResponseEntity<?> getQuestionsForAdmin(@PathVariable Long examId) {
        try {
            return ResponseEntity.ok(questionService.getQuestionsByExam(examId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Student: Get questions (without correct answers)
    @GetMapping("/student/{examId}")
    public ResponseEntity<?> getQuestionsForStudent(@PathVariable Long examId) {
        try {
            return ResponseEntity.ok(questionService.getQuestionsForStudent(examId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Admin: Update a question
    @PutMapping("/admin/")
    public ResponseEntity<?> updateQuestion(@RequestBody Question question) {
        try {
            return ResponseEntity.ok(questionService.updateQuestion(question));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // Admin: Delete a question
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok("Question deleted");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
