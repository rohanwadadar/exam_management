package com.exam.service;

import com.exam.entity.Enrollment;
import com.exam.entity.Exam;
import com.exam.entity.User;
import com.exam.repository.EnrollmentRepository;
import com.exam.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // Admin operations
    public Exam addExam(Exam exam) {
        return examRepository.save(exam);
    }

    public Exam updateExam(Exam exam) {
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    // Student operations
    public Enrollment registerForExam(User student, Long examId) {
        Exam exam = examRepository.findById(examId).orElseThrow(() -> new RuntimeException("Exam not found"));
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setExam(exam);
        enrollment.setStatus("REGISTERED");
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getStudentRegistrations(User student) {
        return enrollmentRepository.findByStudent(student);
    }

    public Enrollment updateEnrollment(Enrollment enrollment) {
        Enrollment existing = enrollmentRepository.findById(enrollment.getId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        existing.setExamDate(enrollment.getExamDate());
        existing.setStatus(enrollment.getStatus());
        return enrollmentRepository.save(existing);
    }
}
