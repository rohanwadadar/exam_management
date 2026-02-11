# Exam Management System

A full-stack Exam Management Portal built with **Spring Boot 3**, **Java 17**, and **Bootstrap 5**.

## 🚀 Features

### Admin Portal
- **Dashboard**: Overview of exams and students.
- **Exam Management**: Create, Read, Update, and Delete (CRUD) examinations.
- **Student Management**: 
    - Full control over student profiles.
    - View specific exams enrolled by each student.
    - **Update Exam Dates**: Assign specific exam dates to individual students.
- **Predefined Credentials**: 
    - **Username**: `admin`
    - **Password**: `admin123456`

### Student Portal
- **Role-Based Login**: Students create their own accounts.
- **Exam Enrollment**: Browse available exams and enroll with a single click.
- **Personal Dashboard**: Track enrolled exams and view exam dates assigned by the Admin.

---

## 🏗️ Backend Architecture & File Directory

The backend is built using the **Controller-Service-Repository** pattern, ensuring a clean separation of concerns and robust error handling using `try-catch` blocks.

### 1. Entities (`com.exam.entity`)
These files define the database structure using JPA/Hibernate.
- **`User.java`**: Represents both Admins and Students. Stores credentials, roles, and contact info.
- **`Exam.java`**: Stores exam details like title, subject, max marks, and description.
- **`Enrollment.java`**: The "bridge" table. It links a specific Student to a specific Exam and stores unique data like the **Assigned Exam Date** and status.

### 2. Repositories (`com.exam.repository`)
These interfaces handle all direct communication with the MySQL database.
- **`UserRepository.java`**: Handles fetching users by username (crucial for login).
- **`ExamRepository.java`**: Standard CRUD operations for exams.
- **`EnrollmentRepository.java`**: Specifically used to find all exams a particular student has registered for.

### 3. Services (`com.exam.service`)
This is where the "Brain" of the application lives. Services handle the business logic and exception wrapping.
- **`UserService.java`**: 
    - Handles user registration and login verification.
    - Includes a `@PostConstruct` method that automatically creates the `admin` account if it doesn't exist.
    - Provides logic for Admin to modify student profiles.
- **`ExamService.java`**: 
    - Manages the creation and deletion of exams.
    - Handles the logic for registering a student for an exam.
    - Contains the logic for Admins to update individual student exam dates and statuses.

### 4. Controllers (`com.exam.controller`)
These files expose REST API endpoints that the frontend calls.
- **`UserController.java`**: Endpoints for `/user/login`, registration, and student management.
- **`ExamController.java`**: Endpoints for `/exam/` fetching, admin exam controls, and student enrollment updates.
- **`HomeController.java`**: Simply ensures the static frontend is served at the root URL.

---

## 🛠️ Technology Stack
- **Backend**: Spring Boot 3, Spring Data JPA, Java 17
- **Frontend**: HTML5, Bootstrap 5, JavaScript (Fetch API)
- **Database**: MySQL (Hibernate automatically generates tables)
- **Build Tool**: Maven

## 🏃 How to Run
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/rohanwadadar/exam_management.git
    cd exam_management
    ```
2.  **Database Setup**:
    - Ensure MySQL is running.
    - Create a database named `test`.
3.  **Run Application**:
    ```bash
    mvn spring-boot:run
    ```
4.  **Access the App**: Open [http://localhost:8080](http://localhost:8080).

## 📂 Summary of Key Files
| File Path | Description |
| :--- | :--- |
| `src/main/resources/static/index.html` | The single-page premium frontend UI. |
| `src/main/resources/application.properties` | Contains DB connection and Hibernate settings. |
| `pom.xml` | Maven configuration with dependencies for JPA, Web, and MySQL. |
| `.gitignore` | Prevents build artifacts and IDE files from being uploaded to Git. |
