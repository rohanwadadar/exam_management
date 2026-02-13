package com.exam.service;

import com.exam.entity.Enrollment;
import com.exam.entity.Exam;
import com.exam.entity.User;
import com.exam.entity.Department;
import com.exam.repository.EnrollmentRepository;
import com.exam.repository.ExamRepository;
import com.exam.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    // Admin operations
    public Exam addExam(Exam exam) {
        if (exam.getDepartment() != null && exam.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(exam.getDepartment().getId()).orElse(null);
            exam.setDepartment(dept);
        }
        return examRepository.save(exam);
    }

    public Exam updateExam(Exam exam) {
        Exam existing = examRepository.findById(exam.getId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        existing.setTitle(exam.getTitle());
        existing.setDescription(exam.getDescription());
        existing.setMaxMarks(exam.getMaxMarks());
        existing.setNumberOfQuestions(exam.getNumberOfQuestions());
        existing.setSubject(exam.getSubject());
        existing.setSemester(exam.getSemester());
        existing.setDurationMinutes(exam.getDurationMinutes());
        existing.setPassingPercentage(exam.getPassingPercentage());
        existing.setActive(exam.isActive());
        if (exam.getDepartment() != null && exam.getDepartment().getId() != null) {
            Department dept = departmentRepository.findById(exam.getDepartment().getId()).orElse(null);
            existing.setDepartment(dept);
        }
        return examRepository.save(existing);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public Exam getExamById(Long id) {
        return examRepository.findById(id).orElse(null);
    }

    public List<Exam> getActiveExams() {
        return examRepository.findByActiveTrue();
    }

    public List<Exam> getExamsByDepartment(Long departmentId) {
        return examRepository.findByDepartmentId(departmentId);
    }

    public List<Exam> getExamsByDepartmentAndSemester(Long departmentId, String semester) {
        return examRepository.findByDepartmentIdAndSemester(departmentId, semester);
    }

    // Student operations
    public Enrollment registerForExam(User student, Long examId) {
        // Check if already enrolled
        if (enrollmentRepository.findByStudentIdAndExamId(student.getId(), examId).isPresent()) {
            throw new RuntimeException("Already enrolled for this exam!");
        }
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setExam(exam);
        enrollment.setStatus("REGISTERED");
        enrollment.setExamTaken(false);
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getStudentRegistrations(User student) {
        return enrollmentRepository.findByStudent(student);
    }

    public List<Enrollment> getStudentRegistrationsById(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    public Enrollment updateEnrollment(Enrollment enrollment) {
        Enrollment existing = enrollmentRepository.findById(enrollment.getId())
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        existing.setExamDate(enrollment.getExamDate());
        existing.setStatus(enrollment.getStatus());
        return enrollmentRepository.save(existing);
    }

    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    public List<Enrollment> getEnrollmentsByExam(Long examId) {
        return enrollmentRepository.findByExamId(examId);
    }
}
