# Heritage Slabs

Heritage Slabs is an all-in-one ERP (Enterprise Resource Planning) platform designed specifically for the granite and construction industry. The platform streamlines business operations ranging from inventory and supplier management to automated logistics and customer support. A standout feature is the "BuildVision" AI visualizer, which allows clients to preview natural stone products in their own spaces with photorealistic precision.

## Key Features

* **BuildVision AI Visualizer:** A specialized tool that uses Gemini 2.5 Flash for deep image analysis and Vertex AI Imagen 3 to photorealistically replace floor surfaces in user-uploaded room photos.
* **Inventory & Material Management:** Real-time tracking of granite varieties, marble, and soapstone, including automated alerts for low stock levels.
* **Logistics & Delivery:** A comprehensive system for managing vehicles and tracking deliveries across Sri Lanka.
* **Customer Support & Feedback:** Integrated ticketing system for user inquiries and a review platform for product feedback.
* **Secure Administration:** Role-based access control (RBAC) ensuring that sensitive administrative and financial data is only accessible to authorized personnel.

## 🛠️ Technical Architecture

The project follows a modern microservices-inspired architecture:

### Frontend

* **Framework:** React with Vite.
* **Styling:** Tailwind CSS with a "glassmorphism" aesthetic.
* **Icons:** Lucide React.
* **State Management:** Context API for Authentication and Cart management.

### Backend (Core)

* **Framework:** Spring Boot.
* **Security:** Spring Security with JWT (JSON Web Tokens) for stateless authentication.
* **Data Access:** Spring Data JPA with MySQL.
* **Communication:** RESTful APIs with ModelMapper for DTO management.

### AI Service

* **Framework:** FastAPI (Python).
* **Computer Vision:** Google Gemini 2.5 Flash for room layout and material texture analysis.
* **Image Generation:** Vertex AI Imagen 3.0 for generating high-resolution interior renderings.
* **Processing:** Pillow (PIL) for image optimization and base64 encoding.

## 📁 Project Structure

```text
Heritage-Slabs/
├── ai-service/         # Python FastAPI service for Gemini/Vertex AI
├── backend/            # Java Spring Boot enterprise backend
├── frontend/           # React frontend with Tailwind CSS
└── uploads/            # Storage for product and user media

```

## ⚙️ Getting Started

### Prerequisites

* Java 17+
* Node.js & npm
* Python 3.9+
* Google Cloud Project (with Gemini and Vertex AI APIs enabled)

### Setup

1. **AI Service:**
* Navigate to `/ai-service`.
* Create a `.env` file with `GEMINI_API_KEY`, `GOOGLE_CLOUD_PROJECT`, and `GOOGLE_APPLICATION_CREDENTIALS`.
* Install dependencies: `pip install -r requirements.txt`.
* Run: `uvicorn main:app --reload`.


2. **Backend:**
* Navigate to `/backend`.
* Update `application.properties` with your MySQL and SMTP credentials.
* Run: `./mvnw spring-boot:run`.


3. **Frontend:**
* Navigate to `/frontend`.
* Install dependencies: `npm install`.
* Run: `npm run dev`.



---

*Developed for Vijitha Granites - Premium natural stone solutions since 1995.*
