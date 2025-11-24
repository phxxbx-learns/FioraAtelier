# Fiora Atelier | E-commerce Shopping Cart

## Project Overview

The Fiora Atelier is a sophisticated e-commerce prototype developed using **Vanilla JavaScript (ES Modules)**, HTML, and CSS. The primary goal of this application is to showcase robust algorithms, including a strict **modular architecture**, clean code practices, and the strategic implementation of core **data structures** (Linked List, Stack) to optimize critical functionalities like the shopping cart.

-----

## Setup and Execution

### Requirements

This project utilizes modern **ES Module** syntax (`import`/`export`). For security reasons, web browsers prevent module loading directly from the file system (`file://` protocol).

### Instructions

1.  **Clone the repository:** Obtain the source code at `(https://github.com/phxxbx-learns/FioraAtelier.git)`.
2.  **Run a local development server:** This is essential. Use a simple HTTP server (e.g., VS Code's Live Server extension, `npm install -g http-server`).
3.  **Open `index.html`** via the server URL `(https://phxxbx-learns.github.io/FioraAtelier/index.html)`.

-----

## Architectural Design: ES Module Structure

The application adopts a strict **Separation of Concerns** principle, organizing code into distinct directories based on responsibility. This modular design significantly enhances maintainability, scalability, and collaboration across the codebase.

### Detailed File Structure

```
├── main.js             <-- Application Entry Point (Orchestrator, initiates all modules and state)
├── data/
│   └── products.js     <-- Static source data for the product catalog.
├── classes/
│   ├── Product.js      <-- Base class for a product entity.
│   ├── CartItem.js     <-- Node structure for the ShoppingCart Linked List.
│   ├── ShoppingCart.js <-- Core state management for the cart (Linked List implementation).
│   ├── ActionHistory.js<-- Manages undo/redo operations (Stack implementation).
│   └── OrderHistory.js <-- Manages persistent record of completed transactions.
├── utils/
│   ├── storage.js      <-- Handles all read/write operations for Local Storage persistence.
│   ├── sorting.js      <-- Implements the Quicksort algorithm for dynamic data sorting.
│   ├── debounce.js     <-- Performance utility for rate-limiting function calls.
│   └── toast.js        <-- Logic and presentation handler for notification pop-ups.
└── ui/
    ├── domElements.js  <-- Centralized cache for all frequently queried DOM elements.
    ├── ui-cart.js      <-- Logic for rendering, updating, and interacting with the cart drawer.
    ├── ui-wishlist.js  <-- Handles rendering and state changes for the product wishlist.
    ├── ui-products.js  <-- Manages the rendering of product cards into categorized grids.
    ├── ui-modal.js     <-- Generic logic for modal window display and control.
    ├── ui-checkout.js  <-- Handles the checkout process flow and form validation.
    ├── ui-gallery.js   <-- Logic for managing image display on product detail pages.
    ├── ui-hero.js      <-- Initializes dynamic/animated components in the hero section.
    └── ui-search.js    <-- Manages user input and displays filtered search results.
```

-----

## Technical Implementation Details

The following sections detail the non-trivial algorithms and data structures chosen to optimize application performance and functionality.

### 1\. Shopping Cart State Management

  - **Module:** `classes/ShoppingCart.js`
  - **Data Structure:** **Singly Linked List**
  - **Justification:** A Linked List is used over a standard array because it provides **O(1) time complexity** for adding a *new* item (by prepending to the head), which is highly efficient for frequent cart mutations.
  - **Complexity:**
      - **Add New Item (Prepend):** **O(1)** (Constant Time).
      - **Search/Total Calculation:** **O(N)** (Linear Time).

### 2\. Undo/Redo System

  - **Module:** `classes/ActionHistory.js`
  - **Data Structure:** **Stack (LIFO - Last-In, First-Out)**
  - **Justification:** The Stack is the mathematically correct structure for history management, ensuring that the **most recent action** is the one available for the **Undo** operation.
  - **Complexity:**
      - **Push (Save State):** **O(1)**.
      - **Pop (Undo):** **O(1)**.

### 3\. Dynamic Product Sorting

  - **Module:** `utils/sorting.js`
  - **Algorithm:** **Quicksort (Recursive)**
  - **Justification:** Quicksort is a highly efficient algorithm used to dynamically reorder the product catalog based on user criteria (e.g., price, name).
  - **Complexity:**
      - **Average Case:** **O(N log N)**.

### 4\. Performance Optimization

  - **Module:** `utils/debounce.js`
  - **Technique:** **Debouncing**
  - **Justification:** This utility prevents excessive function calls during high-frequency events, most notably the search input. It ensures the search logic only executes *after* the user pauses typing, significantly reducing CPU load and improving UI responsiveness.

-----

## Documentation Standards

The entire codebase strictly adheres to professional documentation standards to ensure clarity, collaboration, and long-term maintenance:

1.  **JSDoc Documentation:** All major classes, methods, and exported functions are thoroughly documented using **JSDoc tags** (`@class`, `@method`, `@param`, `@returns`, etc.), which provides rich context and type safety.
2.  **Algorithm Clarity:** All non-trivial algorithms include inline comments detailing their implementation, purpose, and associated **performance complexity**.
3.  **Code Consistency:** Naming conventions and file organization are strictly adhered to across all modules.
