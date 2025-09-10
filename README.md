# 🍔 Burger POS System - Spring Boot Backend

A modern Point of Sale (POS) system backend specifically designed for burger restaurants, built with Spring Boot. This RESTful API provides comprehensive functionality for managing orders, menu items, inventory, and customer transactions in a fast-food environment.

## 🚀 Features

### Core POS Functionality
- **Order Management**: Create, update, and track customer orders
- **Menu Management**: Dynamic burger menu with customizable items, combos, and add-ons
- **Payment Processing**: Support for multiple payment methods (cash, card, digital)
- **Receipt Generation**: Automated receipt creation and printing integration

### Business Intelligence
- **Sales Analytics**: Daily, weekly, and monthly sales reports
- **Popular Items**: Track best-selling burgers and combos
- **Staff Performance**: Monitor cashier efficiency and order processing times
- **Inventory Alerts**: Low stock notifications and automated reorder suggestions

### User Management
- **Role-based Access**: Admin, Manager, and Cashier roles with different permissions
- **Staff Authentication**: Secure login system for restaurant staff
- **Customer Profiles**: Optional customer registration for loyalty programs

## 🛠 Technology Stack

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: MySQL/PostgreSQL
- **ORM**: Spring Data JPA with Hibernate
- **Security**: Spring Security with JWT authentication
- **Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven
- **Validation**: Bean Validation (JSR-303)

## 📋 Prerequisites

Before running this application, ensure you have:

- Java 17 or higher installed
- Maven 3.6+ installed
- MySQL 8.0+ or PostgreSQL 12+ database server
- IDE (IntelliJ IDEA, Eclipse, or VS Code recommended)

## ⚡ Quick Start !!!!!!!!!!!!!!!!

### 1. Clone the Repository
```bash
git clone https://github.com/minindu-alwis/Spring-Boot-Backend-For-Burger-POS-System.git
cd Spring-Boot-Backend-For-Burger-POS-System
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE burger_pos_db;

-- Create user (optional)
CREATE USER 'pos_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON burger_pos_db.* TO 'pos_user'@'localhost';
```

### 3. Configure Application Properties
Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/burger_pos_db
spring.datasource.username=pos_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080
server.servlet.context-path=/api/v1

# JWT Configuration
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### 4. Run the Application
```bash
# Using Maven
mvn clean install
mvn spring-boot:run

# Or using Maven wrapper
./mvnw clean install
./mvnw spring-boot:run
```

The application will start at `http://localhost:8080/api/v1`

## 📖 API Documentation

### Menu Management
```
GET    /menu/items        - Get all menu items
GET    /menu/items/{id}   - Get specific menu item
POST   /menu/items        - Create new menu item (Admin/Manager)
PUT    /menu/items/{id}   - Update menu item (Admin/Manager)
DELETE /menu/items/{id}   - Delete menu item (Admin)
GET    /menu/categories   - Get menu categories
```

### Order Management
```
GET    /orders            - Get all orders
GET    /orders/{id}       - Get specific order
POST   /orders            - Create new order
PUT    /orders/{id}       - Update order status
DELETE /orders/{id}       - Cancel order
GET    /orders/today      - Get today's orders
```

### Inventory Management
```
GET    /inventory         - Get all inventory items
GET    /inventory/{id}    - Get specific inventory item
POST   /inventory         - Add inventory item (Admin/Manager)
PUT    /inventory/{id}    - Update inventory (Admin/Manager)
GET    /inventory/low     - Get low stock items
```

### Reports
```
GET    /reports/sales/daily      - Daily sales report
GET    /reports/sales/weekly     - Weekly sales report
GET    /reports/sales/monthly    - Monthly sales report
GET    /reports/popular-items    - Most popular items
```

### Interactive API Documentation
Access Swagger UI at: `http://localhost:8080/api/v1/swagger-ui.html`

## 🗃 Database Schema

### Key Entities

**Menu Item**
- id, name, description, price, category
- ingredients, nutritional_info, image_url
- is_available, created_at, updated_at

**Order**
- id, order_number, customer_info, total_amount
- order_status, payment_method, payment_status
- cashier_id, created_at, completed_at

**Order Item**
- id, order_id, menu_item_id, quantity, unit_price
- customizations, special_instructions

**Inventory**
- id, ingredient_name, current_stock, minimum_stock
- unit_of_measure, supplier_info, last_restocked

**User (Staff)**
- id, username, email, password_hash, role
- first_name, last_name, is_active, created_at

## 🔐 Security Features

- **JWT Authentication**: Stateless authentication for API endpoints
- **Role-based Authorization**: Different access levels for staff roles
- **Password Encryption**: BCrypt hashing for secure password storage
- **CORS Configuration**: Configurable cross-origin request handling
- **Request Validation**: Input validation and sanitization

## 🧪 Testing

### Run Unit Tests
```bash
mvn test
```

### Run Integration Tests
```bash
mvn integration-test
```

### Test Coverage
```bash
mvn jacoco:report
```

## 📊 Performance Considerations

- **Database Indexing**: Optimized indexes on frequently queried fields
- **Connection Pooling**: HikariCP for efficient database connections
- **Caching**: Redis integration for frequently accessed data
- **Pagination**: Implemented for large data sets
- **Async Processing**: Non-blocking operations for heavy tasks

## 🚀 Deployment

### Using Docker
```dockerfile
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/burger-pos-backend.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

```bash
docker build -t burger-pos-backend .
docker run -p 8080:8080 burger-pos-backend
```

### Environment Variables for Production
```bash
export DATABASE_URL=jdbc:mysql://prod-db:3306/burger_pos_db
export DATABASE_USERNAME=prod_user
export DATABASE_PASSWORD=secure_password
export JWT_SECRET=production-secret-key
export SPRING_PROFILES_ACTIVE=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: mos.minibuger@gmail.com
- Documentation: [Wiki](https://github.com/minindu-alwis/Spring-Boot-Backend-For-Burger-POS-System/wiki)

## 🎯 Roadmap

### Version 2.0 (Planned)
- [ ] Mobile app integration
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
---

**Built with ❤️ for the food service industry**
