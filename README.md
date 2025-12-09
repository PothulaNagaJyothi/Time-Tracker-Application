Here is the **final README.md in pure Markdown format**, ready to paste directly into your GitHub project.

---

# **TimeFlow – AI-Powered Daily Time Tracking & Analytics Dashboard**

TimeFlow is a productivity-focused web application that helps users log their daily activities, visualize where their time goes, and analyze their day through clean charts and analytics.
The project is built with **HTML, CSS, JavaScript, Firebase**, and multiple **AI tools** (Lovable, ChatGPT) for UI generation, component extraction, and code acceleration.

---

## 🚀 **Live Demo**

🔗 *Add your deployed GitHub Pages link here*
Example:
[https://your-username.github.io/your-repo-name](https://your-username.github.io/your-repo-name)

---


## 📌 **Project Features**

### 🔐 **Authentication**

* Email/Password login
* Sign-up flow
* Logout functionality
* Firebase Auth integration

### 📝 **Activity Logging**

* Add activity title, category, and duration (minutes)
* Per-day storage and separation
* Delete an activity
* Validation for empty/invalid inputs

### 📊 **Dashboard & Analytics**

* Previous/Next date navigation
* Calendar popup selector
* Summary analytics:

  * Total minutes
  * Number of activities
  * Average duration per activity
  * Daily goal percentage
* Category breakdown with progress bars
* Weekly trend visualization
* Clean empty state when no data exists

### 📱 **Responsive UI**

* Layout adapts to mobile, tablet, desktop
* Smooth fade-in animations
* Dark theme with modern visuals

---

## 🤖 **AI Tools Used**

### **Lovable / V0.dev**

Used for:

* UI layout generation
* Component design inspiration
* Obtaining React-based components

### **ChatGPT**

Used for:

* Converting React components → HTML/CSS
* Writing helper JavaScript functions
* Designing color palette & UX decisions
* Fixing Firebase errors
* Creating `README.md`, improving documentation
* Speeding up debugging and workflow

### **Impact of AI**

* Reduced development time
* Improved UI consistency
* Made CSS theming easier
* Simplified logic for charts, date handling, and rendering

---

## 🧰 **Tech Stack**

### **Frontend**

* HTML
* CSS
* JavaScript (Vanilla)

### **Backend**

* Firebase Authentication
* Firebase Firestore (optional: future integration)

### **Deployment**

* GitHub Pages

### **Version Control**

* Git & GitHub

---

## 📁 **Folder Structure**

```
/ (root)
│── index.html           # Login/Signup page
│── tracker.html         # Main dashboard
│── css/
│     └── style.css
│── js/
│     ├── firebase-config.js
│     ├── auth.js
│     └── tracker.js
│── assets/
│── README.md
```

---

## 🛠️ **How to Run the Project Locally**

### **1. Clone Repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### **2. Add Firebase Config**

Inside `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

firebase.initializeApp(firebaseConfig);
```

### **3. Run Locally**

Simply open:

```
index.html
```

in your browser.
(No build tools required.)

---

## 🖼️ **Screenshots (Optional but Recommended)**

Add images in `/assets` and reference them like this:

### **Login**

![Login Page](./assets/login.png)

### **Dashboard**

![Dashboard](./assets/dashboard.png)

---

## 🔮 **Future Improvements**

* Save activities to Firestore with real-time sync
* Add Pie Chart visualization
* Add monthly analytics view
* Edit existing activities
* Add user profile page
* Offline support using LocalStorage

---

## 🔗 **Important Links**

| Purpose           | Link                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| GitHub Repository | [https://github.com/your-username/your-repo-name](https://github.com/your-username/your-repo-name) |
| Live Demo         | [https://your-username.github.io/your-repo-name](https://your-username.github.io/your-repo-name)   |


---

## Application Screenshots

![alt text](assets/Screenshot%202025-12-09%20231417.png)


![alt text](assets/Screenshot%202025-12-09%20231610.png)


![alt text](assets/Screenshot%202025-12-09%20231658.png)


![alt text](assets/Screenshot%202025-12-09%20231739.png)


![alt text](assets/Screenshot%202025-12-09%20231754.png)
