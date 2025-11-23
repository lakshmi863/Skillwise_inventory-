#  Product Inventory Management System

A robust full-stack application designed to manage product stock, track inventory history, and visualize data. Built with **React (Frontend)** and **Node.js/Express (Backend)** using **SQLite** as the database.

![Project Banner](https://via.placeholder.com/1200x600?text=Inventory+Dashboard+Preview) 
*(Tip: Replace this link with a screenshot of your Dashboard!)*

##  Live Demo

- **Frontend:** ( https://skillwise-inventory-frontend.onrender.com )
  
- **Backend API:** ( https://skillwise-inventory.onrender.com )

---
Dashboard page

<img width="1912" height="1032" alt="image" src="https://github.com/user-attachments/assets/4689d84d-be28-4d48-b3e6-c3ddd8370f93" />

Inventory page

<img width="1906" height="917" alt="image" src="https://github.com/user-attachments/assets/58404e0e-bfbd-4fe0-a6fc-19d6805a0b8e" />

Add products

<img width="562" height="627" alt="image" src="https://github.com/user-attachments/assets/0560a79f-4bdf-405d-adc1-21e616c44179" />

Inventory  History 

<img width="1557" height="938" alt="image" src="https://github.com/user-attachments/assets/0e1df57a-260a-44ad-8845-0184e009b505" />



##  Key Features

###  Dashboard & Analytics
- **Visual Charts:** Interactive Pie and Bar charts using Recharts to visualize stock distribution and low stock alerts.
- **KPI Cards:** Instant view of Total Products, Total Quantity, Categories, and Low Stock alerts.

###  Inventory Management
- **CRUD Operations:** Add, Edit, and Delete products seamlessly.
- **Inline Editing:** Edit product details directly inside the table.
- **Advanced Filtering:** Server-side Pagination, Category Filtering, and Search functionality.
- **Low Stock Indicators:** Visual cues (Red/Green badges) for stock levels.

###  Import & Export
- **CSV Import:** Bulk upload products via CSV file.
- **CSV Export:** Download current inventory snapshot to CSV.

###  History & Tracking
- **Change Logs:** Automatically tracks every stock change (Who changed it, When, and Old vs. New values).
- **Sidebar History:** View specific product history without leaving the main page.

###  Security & Authentication
- **JWT Authentication:** Secure Login and Registration system.
- **Protected Routes:** Backend endpoints secured via JSON Web Tokens.

###  Responsive Design
- **Mobile Friendly:** Sidebar becomes a top navigation bar on mobile.
- **Adaptive Layouts:** Tables and Charts adjust to screen size.

---

##  Tech Stack

**Frontend:**
- React.js
- CSS Modules (Custom Responsive Design)
- Axios (API Communication)
- Lucide React (Icons)
- Recharts (Data Visualization)

**Backend:**
- Node.js & Express.js
- SQLite3 (Database)
- BCrypt.js (Password Hashing)
- JWT (Authentication)
- Multer & CSV-Parser (File Handling)


