package com.exam.repository;

import com.exam.entity.Enrollment;
import com.exam.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(User student);
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByExamId(Long examId);
    Optional<Enrollment> findByStudentIdAndExamId(Long studentId, Long examId);
}
