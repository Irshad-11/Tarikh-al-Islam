

<div align="center">
  <img src="https://github.com/Irshad-11/Documents/blob/main/System%20Design%20Tarikh%20al-Islam.png?raw=true" alt="System Architecture Tarikh al-Islam">
  
  <br />

  <h1>System Design Document</h1>
  <h6><i>Low-Level System Design (LLD)</i></h6>
  <h3><i>Tarikh al-Islam</i></h3>

  ---
</div>


**Author:** Irshad Hossain
**Organization:** University of Frontier Technology, Bangladesh.
**Date:** January 14, 2026
**Version:** 1.0.0

### Revision History

The following table tracks the development and modifications of this document in accordance with IEEE documentation standards.

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-01-14 | 1.0.0 | Initial MVP Requirement Draft | Irshad |



## 1. Introduction

### 1.1 Purpose

This document describes the **low-level system design** of the Tārīkh al-Islām platform.
It explains internal system behavior, workflows, module responsibilities, data handling, and role-based access logic.

This document complements the System Architecture and Software Requirements Specification (SRS).



## 2. Design Scope

The System Design covers:

* Internal module decomposition
* User and event lifecycle workflows
* Role-based access control logic
* API-level interaction behavior
* Data state transitions
* Error and validation handling (conceptual)



## 3. Module-Level Design

### 3.1 Backend Module Decomposition

The backend system is logically divided into the following modules (services):

```mermaid
graph TD
    API[API Layer] --> UserSvc[User Management Service]
    API --> EventSvc[Event Management Service]
    API --> Auth[Authentication & Authorization]
    EventSvc --> Workflow[Approval Workflow Engine]
```



### 3.2 User Management Module

**Responsibilities:**

* Contributor registration
* Authentication and login
* Role assignment (ADMIN / CONTRIBUTOR)
* Account activation and suspension
* Providing user metadata to other modules

**Key Design Decisions:**

* Public users do not require accounts
* Only contributors can register
* Admins are created manually or elevated



### 3.3 Event Management Module

**Responsibilities:**

* Event creation and modification
* Event lifecycle management
* Event approval and rejection
* Maintaining historical integrity of data

**Event States:**

* `PENDING`
* `APPROVED`
* `REJECTED`
* `DELETED`



## 4. Role-Based Access Control (RBAC) Design

### 4.1 Role Permission Matrix

| Action                   | Public | Contributor | Admin |
| ------------------------ | ------ | ----------- | ----- |
| View events              | ✔      | ✔           | ✔     |
| Create event             | ✖      | ✔           | ✔     |
| Delete event             | ✖      | ✖           | ✔     |
| Edit own event (pending) | ✖      | ✔           | ✔     |
| Approve / Reject event   | ✖      | ✖           | ✔     |
| Suspend contributor      | ✖      | ✖           | ✔     |



### 4.2 RBAC Enforcement Flow

```mermaid
flowchart LR
    A([Client Request]) --> B{Authentication<br>Middleware}
    
    B -- Unauthenticated --> C[[401 Unauthorized]]
    B -- Authenticated --> D{RBAC<br>Policy Engine}
    
    D -- Role: Admin --> F[Admin Dashboard]
    D -- Role: Contributor --> G[Contributor Panel]

    style C fill:#f96,stroke:#333
    
    style F fill:#9f9,stroke:#333
```



## 5. Workflow Design

### 5.1 Event Submission Workflow (Contributor)

```mermaid
sequenceDiagram
    participant C as Contributor
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    C->>FE: Fill Event Form
    FE->>BE: POST /events
    BE->>BE: Validate Role (Contributor)
    BE->>DB: Save Event (Status = Pending)
    DB-->>BE: Saved
    BE-->>FE: Submission Successful
```



### 5.2 Event Approval Workflow (Admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    A->>FE: View Pending Events
    FE->>BE: GET /events?status=pending
    BE->>DB: Fetch Pending Events
    DB-->>BE: Events
    A->>FE: Approve / Reject
    FE->>BE: PATCH /events/{id}
    BE->>DB: Update Status
```

### 5.3 Event Deletion Workflow (Admin)

```mermaid
sequenceDiagram
    participant A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    A->>FE: View Deletion Requests
    FE->>BE: GET /events?status=deletion_requested
    BE->>DB: Fetch Requested Deletions
    DB-->>BE: Events List
    BE-->>FE: Display Events
    
    alt Confirm Deletion
        A->>FE: Confirm Delete Request
        FE->>BE: DELETE /events/{id}
        BE->>DB: Update Status to 'DELETED' (Soft Delete)
        DB-->>BE: Success
        BE-->>FE: Show "Event Removed"
    else Reject Deletion
        A->>FE: Reject Delete Request
        FE->>BE: PATCH /events/{id} (status=APPROVED)
        BE->>DB: Restore Status to 'APPROVED'
        DB-->>BE: Success
        BE-->>FE: Show "Request Denied"
    end
```

### 5.4 Event Retrieval Workflow (Public User)

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database

    U->>FE: Select Timeline Year
    FE->>BE: GET /events?year=XYZ
    BE->>DB: Fetch Approved Events
    DB-->>BE: Event Data
    BE-->>FE: JSON Response
```




## 6. Event Lifecycle Design

```mermaid
stateDiagram-v2
    [*] --> Pending : Contributor Creates
    [*] --> Approved : Admin Directly Adds
    
    Pending --> Approved : Admin Approves
    Pending --> Rejected : Admin Rejects
    
    Rejected --> Pending : Contributor Updates
    
    Approved --> DeletionRequested : Contributor Suggests Delete
    Approved --> Deleted : Admin Deletes
    
    DeletionRequested --> Deleted : Admin Confirms Delete
    DeletionRequested --> Approved : Admin Denies Delete
    
    Deleted --> [*]

    note right of Approved
        Admin bypasses 
        Pending state
    end note
```



## 7. Data Design (Logical Level)

### 7.1 Core Entities (Logical)

```mermaid
erDiagram
    USER ||--o{ EVENT : creates
    USER ||--o{ EVENT : modifies

    USER {
        int id
        string role
        boolean is_active
    }

    EVENT {
        int id
        string title
        string status
        int created_by
        int last_modified_by
    }
```

> [!NOTE]
> Detailed [Database Design](https://github.com/Irshad-11/Tarikh-al-Islam/blob/main/docs/04-database-design.md) is documented separately.



## 8. API Design Overview (Conceptual)

### 8.1 Event APIs

| Endpoint     | Method | Role               |
| ------------ | ------ | ------------------ |
| `/events`     | GET    | All                |
| `/events`      | POST   | Contributor, Admin |
| `/events/{id}` | PATCH  | Admin              |
| `/events/{id}` | DELETE | Admin              |

> [!NOTE]
> Detailed [API Design](https://github.com/Irshad-11/Tarikh-al-Islam/blob/main/docs/05-api-design.md) is documented separately.

## 9. Error Handling Design

* Unauthorized access returns `403 Forbidden`
* Invalid data returns `400 Bad Request`
* Suspended users are blocked at authorization level
* All validation errors are returned in structured JSON



## 10. Design Considerations

### 10.1 Extensibility

* Location data stored for future map integration
* Metadata fields allow audit and tracking

### 10.2 Maintainability

* Clear separation between user logic and event logic
* Modular Django apps

### 10.3 Security

* RBAC enforced at backend
* No client-side trust



## 11. Design Constraints

* Django REST Framework must be used for API logic
* PostgreSQL must store all persistent data
* Frontend must not directly access the database
* Dockerized deployment must be supported



## 12. Conclusion

This system design ensures clarity, modularity, and future scalability while maintaining simplicity for the MVP.
The design aligns with academic standards and real-world software engineering practices.

