

<div align="center">
  <img src="https://github.com/Irshad-11/Documents/blob/main/Database%20Design%20Tarikh%20al-Islam.png?raw=true" alt="Database Design Tarikh al-Islam">
  <br />
  <h1>Database Design</h1>
  <h3><i>Tārīkh al-Islām</i></h3>
  <hr />
</div>

**Author:** Irshad Hossain
**Organization:** University of Frontier Technology, Bangladesh
**Date:** January 14, 2026
**Version:** 1.0.0



### Revision History

| Date       | Version | Description                 | Author |
| ---------- | ------- | --------------------------- | ------ |
| 2026-01-14 | 1.0.0   | Initial MVP Database Design | Irshad |



## 1. Introduction

This document describes the **logical and physical database design** for the *Tārīkh al-Islām* platform.

The database is designed to:

* Preserve historical accuracy
* Support moderation workflows
* Enable future geospatial and temporal features
* Maintain full auditability of changes



## 2. Design Goals

* Data integrity and normalization
* Role-based data ownership
* Traceability of all content changes
* Support for future map and timeline engines
* Compliance with academic and real-world engineering standards



## 3. Core Entity Overview

```mermaid
erDiagram
    USER ||--o{ EVENT : creates
    EVENT ||--o{ EVENT_SOURCE : references
    EVENT ||--o{ EVENT_IMAGE : contains
    EVENT ||--o{ EVENT_TAG : categorized_by
    TAG ||--o{ EVENT_TAG : assigned_to
    EVENT ||--o{ EVENT_MODERATION_LOG : audited_by
```



## 4. Table Definitions

### 4.1 users

Stores system users with role-based permissions.

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        string password_hash
        string role
        boolean is_active
        datetime created_at
        datetime last_login
    }
```



### 4.2 events

Stores historical events with temporal and spatial context.

```mermaid
erDiagram
    EVENT {
        int id PK
        string title
        text description_md
        string location_name
        float latitude
        float longitude
        int start_year_ad
        int end_year_ad
        int start_year_hijri
        int end_year_hijri
        string status
        int created_by FK
        int updated_by FK
        datetime created_at
        datetime updated_at
        datetime approved_at
    }
```

**Status Lifecycle:**

```mermaid
stateDiagram-v2
    PENDING --> APPROVED
    PENDING --> REJECTED
    APPROVED --> DELETION_REQUESTED
    DELETION_REQUESTED --> DELETED
    DELETION_REQUESTED --> APPROVED
```



### 4.3 event_sources

Stores source references for verification.

```mermaid
erDiagram
    EVENT_SOURCE {
        int id PK
        int event_id FK
        string title
        string url
        boolean is_primary_source
    }
```



### 4.4 tags & event_tags

Supports flexible classification.

```mermaid
erDiagram
    TAG {
        int id PK
        string name
        string slug
    }

    EVENT_TAG {
        int event_id FK
        int tag_id FK
    }
```



### 4.5 event_images

Stores visual media related to events.

```mermaid
erDiagram
    EVENT_IMAGE {
        int id PK
        int event_id FK
        string image_url
        string caption
        datetime uploaded_at
    }
```



### 4.6 event_moderation_log

Provides a complete audit trail.

```mermaid
erDiagram
    EVENT_MODERATION_LOG {
        int id PK
        int event_id FK
        string action
        int performed_by FK
        text note
        datetime created_at
    }
```

**Why this table is critical:**

* Academic integrity
* Transparency
* Debugging & review
* Real-world moderation modeling


## 5. Relationship Summary and Table Connectivity

This section explains how all database tables are **logically related and physically connected** within the Tārīkh al-Islām system.
The relationships are designed to reflect **real-world historical data curation**, where contributors submit content, administrators moderate it, and all actions remain traceable.

### 5.1 Relationship Overview (Descriptive)

* A **Contributor** can create multiple **historical events**, forming a one-to-many relationship between `users` and `events`.
* Each **event** may reference multiple **historical sources**, allowing academic verification and cross-referencing.
* Events can be associated with multiple **tags** (such as dynasty, region, or theme), implemented using a junction table to maintain normalization.
* Each event may include multiple **images** to support visual understanding.
* All moderation-related actions (approval, rejection, deletion requests) are recorded in a dedicated **moderation log**, ensuring transparency and accountability.
* Every moderation action is linked to the **Contributor or Admin** who performed it, maintaining a complete audit trail.

This structure ensures that **historical data remains authoritative, verifiable, and auditable**.



## 5.2 Logical Relationship Diagram (Conceptual)

```mermaid
erDiagram
    USERS ||--o{ EVENTS : creates
    USERS ||--o{ EVENT_MODERATION_LOG : performs

    EVENTS ||--o{ EVENT_SOURCES : references
    EVENTS ||--o{ EVENT_IMAGES : contains
    EVENTS ||--o{ EVENT_TAGS : classified_by
    EVENTS ||--o{ EVENT_MODERATION_LOG : audited

    TAGS ||--o{ EVENT_TAGS : linked_to
```



## 5.3 Physical Foreign Key Connectivity (Database View)

```mermaid
flowchart LR
    USERS[users.id] --> EVENTS[events.created_by]
    USERS[users.id] --> EVENT_MODERATION_LOG[performed_by]

    EVENTS[events.id] --> EVENT_SOURCES[event_id]
    EVENTS[events.id] --> EVENT_IMAGES[event_id]
    EVENTS[events.id] --> EVENT_TAGS[event_id]
    EVENTS[events.id] --> EVENT_MODERATION_LOG[event_id]

    TAGS[tags.id] --> EVENT_TAGS[tag_id]
```

This diagram represents **actual foreign key relationships** as implemented in PostgreSQL.



# 6. Example Database Walkthrough
The following section demonstrates **how real data would look inside the database**, using concrete examples.



## 6.1 Example: Contributor Record

```mermaid
erDiagram
    USERS {
        int id PK "12"
        string username "irshad_h"
        string email "irshad@tarikhislam.org"
        string role "CONTRIBUTOR"
        boolean is_active "true"
        datetime created_at "2025-11-02"
        datetime last_login "2026-01-10"
    }

```



## 6.2 Example: Historical Event Record

```mermaid
erDiagram
    EVENTS {
        int id PK "101"
        string title "Battle_of_Badr"
        text description_md "First major battle in Islamic history"
        string location_name "Badr, Madinah"
        float latitude "23.78"
        float longitude "38.79"
        int start_year_ad "624"
        int end_year_ad "624"
        int start_year_hijri "2"
        int end_year_hijri "2"
        string status "APPROVED"
        int created_by FK "12"
        datetime created_at "2025-11-05"
        datetime updated_at "2026-01-08"
        datetime approved_at "2026-01-09"
    }

```



## 6.3 Example: Multiple Event Sources (Academic References)

```mermaid
erDiagram
    EVENT_SOURCE {
        int id PK "201"
        int event_id FK "101"
        string title "Battle of Badr - Wikipedia"
        string url "https://en.wikipedia.org/wiki/Battle_of_Badr"
        boolean is_primary_source "true"
    }

```

```mermaid
erDiagram
    EVENT_SOURCE {
        int id PK "202"
        int event_id FK "101"
        string title "Ar-Raheeq Al-Makhtum"
        string url "https://archive.org/details/sealednectar"
        boolean is_primary_source "false"
    }

```

This shows how **multiple sources** can validate a single event.



## 6.4 Example: Tags and Event Classification

```mermaid
erDiagram
    TAGS {
        int id PK "1"
        string name "Early Islam"
        string slug "early-islam"
    }


    EVENT_TAGS {
        int event_id FK "101"
        int tag_id FK "1"
    }

```

```mermaid
erDiagram    
    TAGS {
        int id PK "2"
        string name "Battles"
        string slug "battles"
    }

    EVENT_TAGS {
        int event_id FK "101"
        int tag_id FK "2"
    }

```

This allows **flexible filtering and thematic grouping**.



## 6.5 Example: Event Images

```mermaid
erDiagram
    EVENT_IMAGES {
        int id PK "301"
        int event_id FK "101"
        string image_url "https://cdn.tarikhislam.org/images/badr_map.png"
        string caption "Map of the Battle of Badr"
        datetime uploaded_at "2025-11-06"
    }

```



## 6.6 Example: Moderation Log (Audit Trail)

```mermaid
erDiagram
    EVENT_MODERATION_LOG {
        int id PK "401"
        int event_id FK "101"
        string action "APPROVED"
        int performed_by FK "3"
        text note "Verified against multiple sources"
        datetime created_at "2026-01-09"
    }

```
```mermaid
erDiagram

    EVENT_MODERATION_LOG {
        int id PK "402"
        int event_id FK "101"
        string action "DELETE_REQUESTED"
        int performed_by FK "12"
        text note "Duplicate event identified"
        datetime created_at "2026-02-01"
    }

```

This ensures **every moderation action is permanently recorded**.

