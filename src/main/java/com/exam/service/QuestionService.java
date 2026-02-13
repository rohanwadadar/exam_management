package com.exam.service;

import com.exam.entity.Question;
import com.exam.entity.Exam;
import com.exam.repository.QuestionRepository;
import com.exam.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    public Question addQuestion(Long examId, Question question) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        question.setExam(exam);
        return questionRepository.save(question);
    }

    public List<Question> addQuestions(Long examId, List<Question> questions) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        questions.forEach(q -> q.setExam(exam));
        return questionRepository.saveAll(questions);
    }

    public List<Question> getQuestionsByExam(Long examId) {
        return questionRepository.findByExamId(examId);
    }

    // Returns questions WITHOUT correct answers (for students taking exam)
    public List<Question> getQuestionsForStudent(Long examId) {
        List<Question> questions = questionRepository.findByExamId(examId);
        // Hide correct answers from student
        questions.forEach(q -> q.setCorrectAnswer(null));
        return questions;
    }

    public Question updateQuestion(Question question) {
        Question existing = questionRepository.findById(question.getId())
                .orElseThrow(() -> new RuntimeException("Question not found"));
        existing.setQuestionText(question.getQuestionText());
        existing.setOptionA(question.getOptionA());
        existing.setOptionB(question.getOptionB());
        existing.setOptionC(question.getOptionC());
        existing.setOptionD(question.getOptionD());
        existing.setCorrectAnswer(question.getCorrectAnswer());
        existing.setMarks(question.getMarks());
        return questionRepository.save(existing);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    @Transactional
    public void deleteAllQuestionsByExam(Long examId) {
        questionRepository.deleteByExamId(examId);
    }
}
