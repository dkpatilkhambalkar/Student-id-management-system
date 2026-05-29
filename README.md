# Student ID Management System

A lightweight **Student ID Management Web App** built using **HTML, CSS, and vanilla JavaScript**.

## Features Included

- Role-based login (Admin and Student)
- Admin dashboard with summary cards
- Student registration and automatic student ID generation
- Student management table with status toggle and ID generation action
- Search and multi-field filtering
- ID card preview with barcode-style placeholder
- Student dashboard (read-only profile + ID card)
- Basic reporting (degree/year/blood group)
- Audit log tracking

## Default Login Credentials

- **Admin**: `admin@college.edu` / `admin123`
- **Student**: `student@college.edu` / `student123`

## Project Files

- `index.html` — Main UI and page structure
- `style.css` — Styling and responsive layout
- `script.js` — App logic and in-memory data handling

## Run Locally

No build tools required.

1. Clone the repository.
2. Open `index.html` in any modern browser.
3. Optionally use a live server extension for auto reload.

## Next Improvements

- Persist data using `localStorage` or backend APIs
- Integrate backend (Node.js/Express or Spring Boot)
- Add real barcode generation and PDF export
- Add database tables for users, students, ID cards, and audit logs
