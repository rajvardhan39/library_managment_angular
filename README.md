# 📚 Premium Library Inventory Management System
### Developed by Rajvardhan Patil

A high-end, responsive Library Admin dashboard engineered with **Angular 17** and a **Node.js/Express** backend. This project showcases a sophisticated UI with glass-morphism effects, staggered animations, and a fully reactive data flow powered by **RxJS**.

## 👤 About the Developer
**Rajvardhan Patil** A Software Developer focused on building high-performance web applications with a clean aesthetic. This project was developed to demonstrate expertise in:
* **Reactive Programming**: Managing complex UI states with RxJS streams.
* **Modern Frontend Architecture**: Leveraging Angular 17's standalone components.
* **Premium UI/UX Design**: Crafting custom animations and smooth user transitions.

---

## ✨ Key Features

* **Reactive Search & Filtering**: Real-time book search using `debounceTime` and `distinctUntilChanged` to optimize performance and API calls.
* **Premium UI/UX**: 
    * **Spring Motion Modals**: High-end entry and confirmation dialogs with custom cubic-bezier "pop" animations.
    * **Staggered Form Fields**: Logic-driven field entrance where inputs slide into view sequentially.
    * **Glass-morphism Design**: A deep slate palette with indigo accents and `backdrop-filter` blur effects.
* **Inventory Tracking**: Intelligent status badges for "Low Stock" (Yellow) and "Out of Stock" (Red).
* **Custom Success Toasts**: Beautiful, non-intrusive notification system for real-time user feedback.
* **CRUD Operations**: Full-cycle management of book titles, categories, published years, and copy counts.

## 🚀 Tech Stack

### Frontend
* **Framework**: Angular 17 (Standalone)
* **State Management**: RxJS (BehaviorSubjects, Observables, CombineLatest)
* **Styling**: Modern CSS3 (CSS Variables, Premium Keyframe Animations, Flex/Grid)

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js

---

## 🛠️ Getting Started

### 1. Prerequisites
* Node.js (v18.x or higher)
* Angular CLI (`npm install -g @angular/cli`)

### 2. Installation
```bash
# Clone the repository
git clone [your-repo-link]

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd frontend
npm install