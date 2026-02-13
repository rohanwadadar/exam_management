package com.exam.service;

import com.exam.entity.*;
import com.exam.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ExamResultService {

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    /**
     * Submit exam and auto-grade MCQ answers
     * answersMap format: { "questionId1": "A", "questionId2": "C", ... }
     */
    public ExamResult submitExam(Long studentId, Long examId, Map<String, String> answersMap) {
        // Check if already submitted
        Optional<ExamResult> existing = examResultRepository.findByStudentIdAndExamId(studentId, examId);
        if (existing.isPresent() && !"IN_PROGRESS".equals(existing.get().getStatus())) {
            throw new RuntimeException("Exam already submitted!");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        List<Question> questions = questionRepository.findByExamId(examId);

        int totalQuestions = questions.size();
        int attempted = 0;
        int correct = 0;
        int wrong = 0;
        int totalMarks = 0;
        int marksObtained = 0;

        for (Question q : questions) {
            totalMarks += (q.getMarks() != null ? q.getMarks() : 1);
            String studentAnswer = answersMap.get(String.valueOf(q.getId()));
            if (studentAnswer != null && !studentAnswer.isEmpty()) {
                attempted++;
                if (studentAnswer.equalsIgnoreCase(q.getCorrectAnswer())) {
                    correct++;
                    marksObtained += (q.getMarks() != null ? q.getMarks() : 1);
                } else {
                    wrong++;
                }
            }
        }

        double percentage = totalMarks > 0 ? (marksObtained * 100.0 / totalMarks) : 0;
        String status = percentage >= (exam.getPassingPercentage() != null ? exam.getPassingPercentage() : 40.0)
                ? "PASSED" : "FAILED";

        ExamResult result;
        if (existing.isPresent()) {
            result = existing.get();
        } else {
            result = new ExamResult();
        }

        result.setStudent(student);
        result.setExam(exam);
        result.setTotalQuestions(totalQuestions);
        result.setAttemptedQuestions(attempted);
        result.setCorrectAnswers(correct);
        result.setWrongAnswers(wrong);
        result.setMarksObtained(marksObtained);
        result.setTotalMarks(totalMarks);
        result.setPercentage(Math.round(percentage * 100.0) / 100.0);
        result.setStatus(status);
        result.setSubmittedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        result.setAnswersJson(new com.fasterxml.jackson.databind.ObjectMapper().valueToTree(answersMap).toString());

        ExamResult saved = examResultRepository.save(result);

        // Update enrollment status
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentIdAndExamId(studentId, examId);
        if (enrollment.isPresent()) {
            Enrollment en = enrollment.get();
            en.setStatus("COMPLETED");
            en.setExamTaken(true);
            en.setScore(marksObtained);
            enrollmentRepository.save(en);
        }

        return saved;
    }

    public List<ExamResult> getResultsByStudent(Long studentId) {
        return examResultRepository.findByStudentId(studentId);
    }

    public List<ExamResult> getResultsByExam(Long examId) {
        return examResultRepository.findByExamId(examId);
    }

    public ExamResult getResult(Long studentId, Long examId) {
        return examResultRepository.findByStudentIdAndExamId(studentId, examId).orElse(null);
    }

    public List<ExamResult> getAllResults() {
        return examResultRepository.findAll();
    }
}
