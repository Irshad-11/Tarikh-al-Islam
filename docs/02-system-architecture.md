

<div align="center">
  <img src="https://github.com/Irshad-11/Documents/blob/main/System%20Architecture%20Tarikh%20al-Islam.png?raw=true" alt="System Architecture Tarikh al-Islam">
  
  <br />

  <h1>System Architecture</h1>
  <h3><i>Tarikh al-Islam</i></h3>

  ---
</div>


**Author:** Irshad Hossain
**Organization:** University of Frontier Technology, Bangladesh.
**Date:** January 14, 2026
**Version:** 1.0.1


### Revision History

The following table tracks the development and modifications of this document in accordance with IEEE documentation standards.

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-01-14 | 1.0.0 | Initial MVP Requirement Draft | Irshad |
| 2026-01-14 | 1.0.1 | Drafted section on event deletion | Irshad |


# 1. Introduction

## 1.1 Purpose

This document describes the high-level system architecture of **Tārīkh al-Islām**.
It defines the major system components, their responsibilities, and the interactions between them.

The purpose of this document is to provide a clear architectural overview for developers, reviewers, and academic evaluation.



# 2. Architectural Overview

## 2.1 Architectural Style

Tārīkh al-Islām follows a **client–server architecture** with a **decoupled frontend and backend**.

The system is designed using a **three-tier architecture**, consisting of:

* Presentation Layer
* Application Layer
* Data Layer

This architectural approach improves scalability, maintainability, and separation of concerns.

### High-Level Architecture Diagram
```mermaid
graph TD
    A[Presentation Layer<br/>React + Tailwind] -->|"REST API (JSON)"| B[Application Layer<br/>Django + DRF]
    B -->|ORM| C[(Data Layer<br/>PostgreSQL)]
```


# 3. System Components

## 3.1 Presentation Layer (Frontend)

The Presentation Layer is responsible for user interaction and data visualization.

### Responsibilities

* Display historical events in timeline view
* Provide search and filtering interfaces
* Render event details and metadata
* Provide dashboards for Admin and Contributor roles
* Communicate with backend services via REST APIs

### Technology

* React
* Tailwind CSS

### Frontend Role-Based Views

```mermaid
flowchart LR
    U[User] -->|Public Access| P[Events Timeline View]
    U -->|Login| D[Dashboard]
    D --> C[Contributor Dashboard]
    D --> A[Admin Dashboard]
```



## 3.2 Application Layer (Backend)

The Application Layer contains the core business logic and access control mechanisms.

### Responsibilities

* Handle authentication and authorization
* Enforce role-based access control (RBAC)
* Process event creation, approval, and moderation
* Expose RESTful APIs to the frontend
* Validate and manage historical data

### Technology

* Django
* Django REST Framework (DRF)

### Backend Logical Modules

```mermaid
graph LR
    API[API Layer] --> Auth[Authentication & RBAC]
    API --> EventSvc[Event Management Service]
    API --> UserSvc[User Management Service]
    EventSvc --> Approval[Approval Workflow]
```



## 3.3 Data Layer (Database)

The Data Layer is responsible for persistent storage of system data.

### Responsibilities

* Store historical events and related metadata
* Store user accounts and role information
* Maintain data integrity and relationships
* Support future features such as spatial and temporal queries

### Technology

* PostgreSQL

### Core Database Entities (Conceptual)

```mermaid
erDiagram
    USER ||--o{ EVENT : creates
    USER {
        int id
        string username
        string role
        boolean is_active
    }
    EVENT {
        int id
        string title
        text description
        date event_date
        string location
        string status
    }
```



# 4. Component Interaction

## 4.1 Frontend–Backend Interaction

The frontend communicates with the backend using RESTful HTTP requests.
All data exchanged between the frontend and backend is in JSON format.

Authentication credentials are verified by the backend before granting access to protected resources.

### API Interaction Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend API

    FE->>BE: GET /api/events
    BE-->>FE: 200 OK (Approved Events)

    FE->>BE: POST /api/events
    BE-->>FE: 201 Created (Pending)
```



## 4.2 Backend–Database Interaction

The backend interacts with the database using an Object-Relational Mapping (ORM) layer.
This abstraction ensures secure and consistent data access while reducing direct dependency on database queries.

```mermaid
flowchart LR
    BE[Backend Services] --> ORM[Django ORM]
    ORM --> DB[(PostgreSQL)]
```



# 5. Data Flow Description

## 5.1 Event Retrieval Flow (Public User)

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    User->>FE: Select Year
    FE->>BE: Request Approved Events
    BE->>DB: Query Approved Events
    DB-->>BE: Event Data
    BE-->>FE: JSON Response
    FE-->>User: Render Timeline
```



## 5.2 Event Submission Flow (Contributor)

```mermaid
sequenceDiagram
    participant Contributor
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Contributor->>FE: Submit Event
    FE->>BE: POST Event Data
    BE->>DB: Save Event (Pending)
    DB-->>BE: Confirmation
    BE-->>FE: Status Pending
```



## 5.3 Event Approval Flow (Admin)

```mermaid
sequenceDiagram
    participant Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    Admin->>FE: Review Pending Events
    FE->>BE: Fetch Pending Events
    BE->>DB: Query Pending
    DB-->>BE: Pending Events
    Admin->>FE: Approve / Reject
    FE->>BE: Update Status
    BE->>DB: Save Status
```

## 5.4 Event Deletion & Cleanup Flow (Admin)

```mermaid
sequenceDiagram
    participant Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database 

    Admin->>FE: Access Moderation Dashboard
    FE->>BE: GET /api/moderation/deletions/
    BE->>BE: Validate Admin Permissions
    BE->>DB: Fetch 'DeletionRequested' Records
    DB-->>BE: Event Data
    BE-->>FE: Populate Deletion Queue
    
    Admin->>FE: Confirm/Reject Deletion
    
    FE->>BE: POST /api/moderation/resolve-delete/
    Note over BE: Logic: If Approved -> Status='DELETED'<br/>If Rejected -> Status='APPROVED'
    
    BE->>DB: Persist State Transition
    DB-->>BE: Transaction Confirmed
    
    BE-->>FE: Return Sync Response
    FE-->>Admin: Update Dashboard UI
```


# 6. Deployment Architecture (High-Level)

The system is deployed using containerized services to ensure consistency across environments.

### Components

* Frontend container (React)
* Backend container (Django + DRF)
* Database container (PostgreSQL)

Docker is used to manage service orchestration and environment configuration.

```mermaid
graph TD
    Browser[User Browser]
    Browser --> FE[Frontend Container]
    FE --> BE[Backend Container]
    BE --> DB[(PostgreSQL Container)]
```



# 7. Design Considerations

## 7.1 Scalability

The decoupled architecture allows the frontend and backend to scale independently.

## 7.2 Maintainability

Modular component design enables easier updates and future enhancements, such as interactive map integration.

## 7.3 Security

All protected actions are enforced through backend authorization and role-based access control.



# 8. Architectural Constraints

* The system must use REST APIs for communication.
* The frontend and backend must remain decoupled.
* PostgreSQL must be used as the primary data store.
* Docker must be used for deployment consistency.


