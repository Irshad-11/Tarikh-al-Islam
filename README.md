
<p align="center">
  <img src="https://raw.githubusercontent.com/Irshad-11/Documents/main/Tārīkh%20al-Islām-banner.png" alt="Tārīkh al-Islām Banner" />
</p>

<h1 align="center">
  Tārīkh al-Islām
  <img src="https://img.shields.io/badge/Coming%20Soon-blueviolet" alt="Status">
</h1>

<p align="center">
  <img src="https://img.icons8.com/?size=40&id=asWSSTBrDlTW&format=png&color=000000" />
  <img src="https://img.icons8.com/?size=40&id=x7XMNGh2vdqA&format=png&color=000000" />
  <img src="https://img.icons8.com/?size=40&id=LPmcJ9e0FU7K&format=png&color=000000" />
  <img src="https://img.icons8.com/?size=40&id=38561&format=png&color=000000" />
  <img src="https://img.icons8.com/?size=50&id=LdUzF8b5sz2R&format=png&color=000000" />
</p>

> [!WARNING]
> This project is under development.  
> **Estimated release:** May 2026

---

## What this project actually is

**Tārīkh al-Islām** is a **Temporal–Geospatial Knowledge Platform** focused on Islamic history.

Instead of reading long articles, users **explore history visually** through:

- 📅 Interactive timeline  
- 🗺️ (Future) Map-based exploration  
- 📖 Sequential historical events  

The goal is to **see Islamic history**, not just read it.



## Why this project is different

Most Islamic history platforms are:

- Text-heavy  
- Blog-style  
- Fragmented  
- Static  
- Difficult to understand chronologically  

### This project changes the model

| Traditional Platforms | Tārīkh al-Islām |
|----------------------|----------------|
| Article-based | Data-driven |
| Static text | Interactive visualization |
| Linear reading | Exploratory navigation |
| No spatial context | Map-based intelligence |
| No temporal engine | Timeline engine |

> This is a **historical visualization engine**.



## System at a Glance (High-Level Architecture)

```mermaid
flowchart LR
    PublicUser["Public User"] -->|View Events| Frontend
    Contributor["Contributor"] -->|Submit Events| Frontend
    Admin["Admin"] -->|Moderate & Manage| Frontend

    Frontend["React + Tailwind UI"] -->|REST API| Backend["Django + DRF"]

    Backend --> Database["PostgreSQL"]

    Backend --> Auth["RBAC & Auth Logic"]
```

## Core Workflow Overview
### Event Lifecycle

```mermaid
stateDiagram-v2
    direction TB

    [*] --> Draft : Contributor Creates
    [*] --> Approved : Admin Direct Add
    
    Draft --> Pending : Submit for Review
    
    Pending --> Approved : Admin Approval
    Pending --> Rejected : Admin Rejection
    
    Rejected --> Draft : Contributor Resubmits
    
    Approved --> DeletionRequested : Contributor Suggests Delete
    Approved --> Deleted : Admin Direct Delete
    
    DeletionRequested --> Deleted : Admin Confirms Delete
    DeletionRequested --> Approved : Admin Declines
    
    Deleted --> [*]

    state Approved {
        direction LR
        Live --> Visible
    }

    note right of Pending : Admin Review Queue
    note left of DeletionRequested : Removal Review
```

> [!NOTE]
> For more information, see the [Detailed Documentation](https://github.com/Irshad-11/Tarikh-al-Islam/blob/main/docs/).

## Technology Stack (MVP)

| Layer    | Technology                       |
| -------- | -------------------------------- |
| Frontend | React, Tailwind CSS              |
| Backend  | Django, Django REST Framework    |
| Database | PostgreSQL                       |
| Auth     | Role-Based Access Control (RBAC) |
| DevOps   | Docker                           |



## Estimated Development Timeline

```mermaid
gantt
    title Tarikh al-Islam MVP Timeline
    dateFormat YYYY-MM-DD

    section Planning
    Documentation and Design :done, 2026-01-01, 14d

    section Backend
    Backend Development      :active, 2026-01-15, 21d

    section Frontend
    Frontend Development     :2026-02-05, 7d

    section Database
    Database Implementation  :2026-02-12, 14d

    section Integration
    Integration and Debugging:2026-02-26, 14d

    section DevOps
    Testing and Docker       :2026-03-12, 14d

    section Release
    MVP Release              :milestone, 2026-03-26, 1d

```



## Sources

Historical data is referenced and cross-checked using publicly available resources:

* **Wikipedia**
* **Al-Islam.org**
* **MuslimHeritage.com**
* **Internet Archive (Islamic history texts)**
* **Qatar Digital Library**

> [!NOTE]
> Sources are used for reference and verification only.
> Data is curated manually.



## License

This project is released under the **MIT License**.

* Free to use and modify
* Attribution appreciated
* Source materials follow their respective licenses



## Developer

**Irshad Hossain**
Student, Software Engineering
University of Frontier Technology, Bangladesh

