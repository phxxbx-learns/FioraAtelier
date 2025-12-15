# Fiora Atelier | E-commerce Platform with Inventory Management

## Project Overview

Fiora Atelier is a **full-stack e-commerce platform** specializing in floral arrangements and event styling services. The application features a complete shopping experience with **real-time inventory management**, developed using **Vanilla JavaScript, HTML, CSS, PHP, and MySQL**.

The platform demonstrates robust algorithms, **modular architecture**, clean code practices, and strategic implementation of core **data structures** (Linked List, Stack) to optimize critical functionalities like shopping cart and action history.

---

## Hosting & Deployment

### Important: GitHub Pages Limitation
This project requires **PHP 7.4+ and MySQL 5.7+** for full functionality (shopping cart, inventory management, APIs, and database operations). Since **GitHub Pages only supports static files**, the complete application is deployed on **InfinityFree** hosting to support backend operations.

### Live Demo
**Full-Featured Live Demo:** [https://fioraatelier.wuaze.com/index.html](https://fioraatelier.wuaze.com/index.html)

### Source Code
**GitHub Repository:** [https://github.com/phxxbx-learns/FioraAtelier.git](https://github.com/phxxbx-learns/FioraAtelier.git)
*(Note: Backend features require PHP/MySQL server environment)*

---

## Local Development Setup

### Requirements
- **Web Server:** Apache/Nginx with PHP 7.4+
- **Database:** MySQL 5.7+
- **Browser:** Chrome 70+, Firefox 65+, Safari 12+, Edge 79+

### Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/phxxbx-learns/FioraAtelier.git
   ```

2. **Set up the database:**
   - Create a MySQL database
   - Import `database-fixed.sql` structure
   - Update credentials in `config/database.php`

3. **Configure the application:**
   ```php
   // config/database.php
   private $host = "localhost";
   private $db_name = "fiora_atelier";
   private $username = "root";
   private $password = "";
   ```

4. **Run the application:**
   - Place files in your web server directory (e.g., `htdocs/`)
   - Access via: `http://localhost/fiora-atelier/index.html`

---

## Architectural Design: ES Module Structure

The application adopts a strict **Separation of Concerns** principle, organizing code into distinct directories based on responsibility. This modular design significantly enhances maintainability, scalability, and collaboration.

### Frontend Structure (ES Modules)
```
├── main.js             <-- Application Entry Point
├── data/
│   └── products.js     <-- Static source data for the product catalog
├── classes/
│   ├── Product.js      <-- Base class for a product entity
│   ├── CartItem.js     <-- Node structure for ShoppingCart Linked List
│   ├── ShoppingCart.js <-- Core state management (Linked List)
│   ├── ActionHistory.js<-- Undo/redo operations (Stack implementation)
│   └── OrderHistory.js <-- Record of completed transactions
├── utils/
│   ├── storage.js      <-- Local Storage persistence
│   ├── sorting.js      <-- Quicksort algorithm for data sorting
│   ├── debounce.js     <-- Rate-limiting function calls
│   └── toast.js        <-- Notification pop-ups handler
└── ui/
    ├── domElements.js  <-- Centralized DOM element cache
    ├── ui-cart.js      <-- Cart drawer rendering and interactions
    ├── ui-wishlist.js  <-- Wishlist state management
    ├── ui-products.js  <-- Product cards rendering
    ├── ui-modal.js     <-- Modal window control
    ├── ui-checkout.js  <-- Checkout process and validation
    ├── ui-gallery.js   <-- Image display management
    ├── ui-hero.js      <-- Dynamic hero section components
    └── ui-search.js    <-- Search input and filtering
```

### Backend Structure (PHP/MySQL)
```
php/
├── api/
│   ├── check-stock.php         <-- Real-time stock level checking API
│   └── update-stock.php        <-- Inventory updates API
├── config/
│   ├── database.php            <-- Database connection configuration
│   └── production.php          <-- Production environment settings
├── inventory/
│   ├── dashboard.php           <-- Admin dashboard interface
│   ├── header.php              <-- Admin panel header template
│   ├── login.php               <-- Admin authentication system
│   ├── logout.php              <-- Session termination
│   ├── products.php            <-- Product management interface
│   ├── purchase_order_items.php <-- Purchase order line items
│   ├── purchase_orders.php     <-- Purchase order management
│   └── styles.css              <-- Admin panel styles
├── suppliers.php               <-- Supplier management interface
└── models/
    ├── Inventory.php           <-- Inventory business logic
    ├── Product.php             <-- Product model and operations
    ├── PurchaseOrder.php       <-- Purchase order model
    ├── PurchaseOrderItem.php   <-- Purchase order item model
    └── Supplier.php            <-- Supplier model
```

---

## Technical Implementation Details

### 1. Shopping Cart State Management
- **Module:** `classes/ShoppingCart.js`
- **Data Structure:** **Singly Linked List**
- **Justification:** Provides **O(1) time complexity** for adding new items (prepending to head), highly efficient for frequent cart mutations
- **Complexity:**
  - **Add New Item (Prepend):** **O(1)** (Constant Time)
  - **Search/Total Calculation:** **O(N)** (Linear Time)

### 2. Undo/Redo System
- **Module:** `classes/ActionHistory.js`
- **Data Structure:** **Stack (LIFO)**
- **Justification:** Mathematically correct for history management; ensures **most recent action** is available for **Undo** operation
- **Complexity:**
  - **Push (Save State):** **O(1)**
  - **Pop (Undo):** **O(1)**

### 3. Dynamic Product Sorting
- **Module:** `utils/sorting.js`
- **Algorithm:** **Quicksort (Recursive)**
- **Justification:** Highly efficient for dynamic reordering of product catalog based on user criteria
- **Complexity:**
  - **Average Case:** **O(N log N)**

### 4. Performance Optimization
- **Module:** `utils/debounce.js`
- **Technique:** **Debouncing**
- **Justification:** Prevents excessive function calls during high-frequency events (search input), reducing CPU load and improving UI responsiveness

### 5. Real-time Inventory Management
- **Technology:** **PHP RESTful API + MySQL**
- **API Endpoints:**
  - `POST /php/api/check-stock.php` - Check current stock levels
  - `POST /php/api/update-stock.php` - Update inventory quantities
- **Admin Features:**
  - Real-time stock level monitoring (`inventory/dashboard.php`)
  - Purchase order workflow (`inventory/purchase_orders.php`)
  - Supplier relationship management (`suppliers.php`)
  - Product management (`inventory/products.php`)

### 6. Object-Oriented PHP Architecture
- **Models Directory:** Implements MVC pattern with dedicated classes
  - `Inventory.php`: Handles stock operations and validations
  - `Product.php`: Manages product CRUD operations
  - `PurchaseOrder.php`: Processes purchase order lifecycle
  - `Supplier.php`: Manages supplier data and relationships

---

## Key Features

### Customer Facing
- **Product Catalog** with search, sort, and filter
- **Shopping Cart** with persistent storage (Local Storage)
- **Wishlist** functionality
- **Interactive Gallery** with lightbox
- **Fully Responsive** design (mobile-first)
- **Animated UI** with cherry blossom effects
- **Simulated Checkout** process

### Administrative
- **Admin Dashboard** (`inventory/dashboard.php`)
- **Real-time Stock Monitoring** with alerts
- **Purchase Order Management** system
- **Supplier Management** interface
- **Product CRUD Operations**
- **Secure Authentication** (`inventory/login.php`)
- **Transaction History Logging**

---

## Documentation Standards

The entire codebase adheres to professional documentation standards:

1. **JSDoc Documentation:** All major classes, methods, and exported functions use **JSDoc tags** (`@class`, `@method`, `@param`, `@returns`, etc.)
2. **PHP Documentation:** Backend code includes detailed inline comments and API documentation
3. **Algorithm Clarity:** Non-trivial algorithms include inline comments detailing implementation, purpose, and **performance complexity**
4. **Code Consistency:** Strict naming conventions and file organization across all modules

---

## Project Status & Limitations

### Complete Features
- Full e-commerce shopping flow
- Complete inventory management system with PHP backend
- Responsive frontend design
- Data structure implementations (Linked List, Stack)
- Local storage persistence
- Secure admin authentication

### Current Limitations
- Payment processing is simulated (no real transactions)
- Requires external hosting for PHP/MySQL functionality
- Image optimization pending for production
- Designed for small-medium inventory scale

### Future Enhancements
- User authentication system for customers
- Real payment gateway integration
- Advanced reporting dashboard
- Multi-vendor support
- Mobile application
- Automated email notifications

---

## Support & Contact

For technical support or deployment assistance:
- **Live Demo:** [https://fioraatelier.wuaze.com](https://fioraatelier.wuaze.com)
- **GitHub Issues:** [Project Issues](https://github.com/phxxbx-learns/FioraAtelier/issues)
- **Documentation:** See `User Guide.pdf` for detailed setup and usage instructions

**Default Admin Credentials:**
- Username: `admin`
- Password: `password`

*Developed as a final project for CCIT 104: Data Structures and Algorithms*
```
