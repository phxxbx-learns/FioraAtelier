# 🚀 Fiora Atelier Deployment Guide

## Prerequisites
- Web server with PHP 7.4+
- MySQL 5.7+

## Installation Steps

1. **Upload Files** to your web server
2. **Create Database** on your web host
3. **Import SQL** from `database.sql` and `update_products.sql`
4. **Configure Database** in control panel
5. **Set Environment Variables**:
   - DB_HOST=your_mysql_host
   - DB_NAME=your_database_name  
   - DB_USER=your_database_user
   - DB_PASS=your_database_password

## Testing
- Visit: yourdomain.com/test-stock.php
- Login to inventory: yourdomain.com/inventory.php
- Test checkout process