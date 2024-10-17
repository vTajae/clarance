
# Security Clearance Form Application

---

## 🔧 **Description**

This project focuses on developing a client-side application to handle the extensive personal data required for the United States Security Clearance form, without storing any information on external servers. I wanted to ensure that all the sensitive information remained on the user's device, which posed unique challenges but ultimately led to innovative solutions.

The project required me to manage large datasets that could not be stored server-side for liability reasons. Instead, I utilized IndexedDB for client-side storage, which stores all data locally within the user's browser. The idea was to temporarily store this information as the user fills out the form, then generate a PDF and wipe the data. This solution aligned perfectly with the requirements of the application.

---

## 🛠️ **Technologies Used**

- **Frontend**: React.js, TypeScript
- **Data Parsing**: PDF.js for extracting and mapping PDF form fields
- **Database**: IndexedDB for client-side data storage

---

## ⚙️ **Challenges and Solutions**

### Handling Sensitive Data Locally:
The core challenge was managing large amounts of sensitive data while ensuring compliance with privacy regulations. I addressed this by using IndexedDB to store all information directly in the user's browser, avoiding server-side storage entirely. This helped in reducing liability and offering the user full control over their data.

### Implementing Business Rules from PDF:
The security clearance form had several embedded business rules that needed to be reflected in the dynamic form I built. This required robust data models and interfaces. I used PDF.js to extract and map PDF fields to React components, enforcing those rules dynamically in the frontend application.

Although the project is currently on hold due to time and budget constraints, it has significantly improved my skills in dealing with client-side storage solutions and handling large datasets in React.

---

## 🚀 **Outcomes**

This project honed my problem-solving abilities, particularly in managing sensitive data and ensuring user privacy through client-side storage solutions. Despite the project's pause, I gained a deeper understanding of data structures, data parsing, and managing large datasets in a privacy-compliant manner.

---

## 🏆 **Accomplishments**

- Engineered a client-side storage solution using IndexedDB for handling sensitive data securely.
- Mapped complex business rules from the United States Security Clearance PDF form into dynamic form fields using PDF.js.
- Deepened my understanding of data parsing, storage solutions, and front-end data management.

---

## 🔗 **Code Samples**

Coming soon ...

