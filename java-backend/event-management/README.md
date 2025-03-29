# EventHub - Java Backend

This is the Java Spring Boot backend for the EventHub application. It provides a RESTful API for managing events, user authentication, and RSVP functionality.

## Features

- User authentication with JWT
- CRUD operations for events
- RSVP to events
- Pagination, filtering, and searching
- PostgreSQL database with JPA/Hibernate
- Input validation
- Error handling

## Tech Stack

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT Authentication
- Maven

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/profile` | Get current user profile |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events with pagination |
| GET | `/api/events/{id}` | Get event by ID |
| POST | `/api/events` | Create a new event |
| PUT | `/api/events/{id}` | Update an event |
| DELETE | `/api/events/{id}` | Delete an event |
| GET | `/api/events/my-events` | Get events created by current user |
| GET | `/api/events/attending` | Get events the user is attending |

### RSVPs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events/{id}/rsvp` | RSVP to an event |
| GET | `/api/events/{id}/rsvp` | Get all RSVPs for an event |
| GET | `/api/events/{id}/rsvp/me` | Get current user's RSVP status |
| DELETE | `/api/events/{id}/rsvp` | Delete RSVP |

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven
- PostgreSQL

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd java-backend
   ```

2. Create a `application.properties` file in `src/main/resources` based on the example

3. Configure your database details in the properties file

4. Build the application
   ```bash
   ./mvnw clean install
   ```

5. Run the application
   ```bash
   ./mvnw spring-boot:run
   ```

### Production Build

```bash
./mvnw clean package
java -jar target/event-management-0.0.1-SNAPSHOT.jar
```

## Docker

### Build Docker Image

```bash
docker build -t event-management-java-backend .
```

### Run Docker Container

```bash
docker run -p 5000:5000 --env-file .env event-management-java-backend
```

## Database Schema

### Users Table
- id (Long, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password (String, Hashed)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### Events Table
- id (Long, Primary Key)
- name (String)
- description (Text)
- date (LocalDateTime)
- location (String)
- organizer (User, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)

### RSVPs Table
- id (Long, Primary Key)
- status (Enum: ATTENDING, MAYBE, DECLINED)
- user (User, Foreign Key)
- event (Event, Foreign Key)
- createdAt (Timestamp)
- updatedAt (Timestamp)

## Environment Variables/Properties

```properties
# Server Configuration
server.port=5000
server.servlet.context-path=/api

# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/event_management
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA and Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
app.jwt.secret=your_jwt_secret_key_here
app.jwt.expiration=86400000
app.jwt.header=Authorization
app.jwt.prefix=Bearer 

# CORS Configuration
app.cors.allowed-origins=http://localhost:5173
```

## Project Structure

```
src/
├── main/
│   ├── java/com/opskube/eventmanagement/
│   │   ├── config/         # Configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── exception/      # Custom exceptions and handlers
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # JPA repositories
│   │   ├── security/       # Security configuration and JWT
│   │   ├── service/        # Business logic
│   │   └── EventManagementApplication.java
│   └── resources/
│       ├── application.properties  # Application configuration
│       └── static/                 # Static resources
└── test/                           # Test classes
```

## Available Maven Commands

- `./mvnw spring-boot:run` - Run the application
- `./mvnw clean package` - Build the application
- `./mvnw test` - Run tests
- `./mvnw clean install` - Clean and install dependencies

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Select the Java backend directory
4. Set the following:
   - Build Command: `./mvnw clean install`
   - Start Command: `java -jar target/event-management-0.0.1-SNAPSHOT.jar`
5. Add environment variables as needed
6. Deploy the service

## Troubleshooting

### Common Issues

1. **Database Connection Problems**:
   - Check database credentials in application properties
   - Ensure PostgreSQL server is running
   - Verify database exists and user has correct permissions

2. **JWT Issues**:
   - Ensure `app.jwt.secret` is properly set
   - Check token expiration time

3. **JPA/Hibernate Errors**:
   - Ensure entity mappings are correct
   - Check database schema matches entity definitions

4. **CORS Issues**:
   - Verify allowed origins configuration matches your frontend URL

## License

[MIT](LICENSE)