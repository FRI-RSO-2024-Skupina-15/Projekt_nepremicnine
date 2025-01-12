# Project NEPMICINE Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Services](#services)
4. [Infrastructure](#infrastructure)
6. [Development Setup](#development-setup)
7. [Deployment](#deployment)
8. [API Documentation](#api-documentation)
9. [Data Models](#data-models)

## System Overview

Project nepremicnine is a cloud-native real estate management system built using a microservices architecture. The system allows users to list, search, and manage property listings with image support and automated notifications.

### Key Features
- Property listing management
- Image upload and management
- Real-time property notifications
- Advanced property search and filtering
- Responsive web interface
- Containerized microservices deployment

### Technology Stack
- Frontend: React.js with Tailwind CSS
- Backend: Node.js/Express.js
- Database: MongoDB
- Azure File Storage for storing property images
- Docker for storing images for each service
- Container Orchestration: Kubernetes (AKS)
- CI/CD: GitHub Actions
- Serverless: Azure Functions
- Email Notifications: SendGrid

## Architecture

The application follows a microservices architecture with the following components:

### Service Architecture
```
├── Frontend Service (React)
├── Properties Service (REST API)
├── Image Service (REST API)
└── Notification Service (Azure Function)
```

### Communication Flow
1. Frontend service communicates with backend services through REST APIs
2. Properties service handles property CRUD operations
3. Image service manages property image uploads and retrieval
4. Notification service sends emails when new properties are listed

## Services

### Frontend Service
- **Technology**: React
- **Purpose**: User interface for property management
- **Components**:
  - PropertyListing: Displays property grid with filters
  - PropertyForm: Handles property creation with image upload

### Properties Service
- **Port**: 3000
- **Purpose**: Core property management API
- **Features**:
  - CRUD operations for properties
  - Filtering and search
  - Integration with notification service
- **API Endpoints**:
  - GET /api/properties
  - POST /api/properties
  - DELETE /api/properties/:id
  - GET /api/properties/health

### Image Service
- **Port**: 3001
- **Purpose**: Image management for properties
- **Features**:
  - Multi-image upload support
  - Azure File Storage integration
  - Image retrieval and deletion
- **API Endpoints**:
  - POST /api/images/upload/:propertyId
  - GET /api/images/property/:propertyId
  - DELETE /api/images/:imageId
  - GET /api/images/health

### Notification Service
- **Type**: Azure Function
- **Purpose**: Automated email notifications
- **Features**:
  - SendGrid integration
  - Property listing notifications
  - Async processing

## Infrastructure

### Kubernetes Components
- **Deployments**:
  - properties-service (2 replicas)
  - image-service (2 replicas)
  - frontend-service
- **Services**:
  - ClusterIP services for internal communication
  - Ingress for external access
- **Storage**:
  - Azure File Storage for property images storage

## Development Setup

### Prerequisites
- Node.js v22
- Docker
- Kubernetes CLI (kubectl)
- Azure CLI
- MongoDB instance

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   cd services/[service-name]
   npm install
   ```
3. Set up environment variables:
   - Create .env files based on provided examples
   - Configure MongoDB connection
   - Set up Azure storage credentials

### Environment Variables
```
MONGO_URI=mongodb://[username]:[password]@[host]/[database]
NOTIFICATION_FUNC_URL=https://[function-url]
SENDGRID_API_KEY=[your-api-key]
```

## Deployment

### CI/CD Pipeline
The project uses GitHub Actions for automated deployment:

1. **Build Stage**:
   - Node.js setup and dependency installation
   - Code validation and testing

2. **Docker Stage**:
   - Multi-service Docker image building
   - Push to Docker Hub registry

3. **Deployment Stage**:
   - AKS authentication and context setup
   - Secret creation in Kubernetes
   - Application deployment
   - Health check and verification

### Kubernetes Deployment
1. Create AKS cluster
2. Apply storage configuration:
   ```bash
   kubectl apply -f k8s/image-service/azure-file-storage-class.yaml
   kubectl apply -f k8s/image-service/azure-file-pvc.yaml
   ```
3. Deploy services:
   ```bash
   kubectl apply -f k8s/properties-service/deployment-properties.yaml
   kubectl apply -f k8s/image-service/deployment-image.yaml
   kubectl apply -f k8s/ingress.yaml
   ```

## API Documentation

### Properties Service API

#### GET /api/properties
Query Parameters:
- city (string): Filter by city
- minPrice (number): Minimum price
- maxPrice (number): Maximum price
- type (string): Property type
- bedrooms (number): Number of bedrooms

Response:
```json
[
  {
    "_id": "string",
    "price": number,
    "type": "apartment|house|commercial",
    "location": {
      "city": "string",
      "country": "string"
    },
    "size": number,
    "bedrooms": number,
    "contact": {
      "name": "string",
      "email": "string"
    }
  }
]
```

### Image Service API

#### POST /api/images/upload/:propertyId
- Method: POST
- Content-Type: multipart/form-data
- Max Files: 10
- File Size Limit: 5MB per image

Response:
```json
[
  {
    "_id": "string",
    "propertyId": "string",
    "filename": "string",
    "url": "string"
  }
]
```

## Data Models

### Property Schema
```javascript
{
  price: Number (required),
  type: String (required),
  location: {
    city: String (required),
    country: String
  },
  size: Number (required),
  plotSize: Number,
  floors: Number,
  bedrooms: Number,
  bathrooms: Number,
  constructionYear: Number (required),
  energyRating: String,
  contact: {
    name: String (required),
    email: String (required),
    phone: String
  }
}
```

### Image Schema
```javascript
{
  propertyId: ObjectId (required),
  filename: String (required),
  originalName: String,
  mimetype: String,
  size: Number,
  url: String,
  thumbnailUrl: String,
  createdAt: Date
}
```

