# Exam Management System

A full-stack Exam Management Portal built with **Spring Boot 3**, **Java 17**, and **Bootstrap 5**. This system allows administrators to manage exams and student records, while students can register for exams and track their enrollments.

## 🚀 Features

### Admin Portal
- **Dashboard**: Overview of exams and students.
- **Exam Management**: Create, Read, Update, and Delete (CRUD) examinations.
- **Student Management**: 
    - Full control over student profiles.
    - View specific exams enrolled by each student.
    - **Update Exam Dates**: Assign specific exam dates to individual students.
    - **Status Control**: Mark enrollments as Registered or Completed.
- **Predefined Credentials**: No signup required for Admin.
    - **Username**: `admin`
    - **Password**: `admin123456`

### Student Portal
- **Role-Based Login**: Students create their own accounts.
- **Exam Enrollment**: Browse available exams and enroll with a single click.
- **Personal Dashboard**: Track enrolled exams and view exam dates assigned by the Admin.

## 🛠️ Technology Stack
- **Backend**: Spring Boot 3, Spring Data JPA, Java 17
- **Frontend**: HTML5, Bootstrap 5, JavaScript (Fetch API)
- **Database**: MySQL (Hibernated/JPA for ORM)
- **Build Tool**: Maven

## ⚙️ Configuration
The project is configured to run on port `8080`.
Database settings (in `src/main/resources/application.properties`):
- **DB Name**: `test`
- **Username**: `root`
- **Password**: (Empty by default)

## 🏃 How to Run
1.  **Clone the Repository**:
    ```bash
    git clone <your-repo-url>
    cd exam_management
    ```
2.  **Database Setup**:
    - Ensure MySQL is running.
    - Create a database named `test` (though the app is configured to create it if it doesn't exist).
3.  **Run Application**:
    ```bash
    mvn spring-boot:run
    ```
4.  **Access the App**: Click [http://localhost:8080](http://localhost:8080).

## 📂 Project Structure
- `src/main/java/com/exam/entity`: JPA Data Models.
- `src/main/java/com/exam/controller`: REST API endpoints.
- `src/main/java/com/exam/service`: Business logic & Exception handling.
- `src/main/resources/static`: Frontend (Single Page Application).
