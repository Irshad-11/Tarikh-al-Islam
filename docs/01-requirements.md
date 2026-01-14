<div align="center">
  <img src="https://github.com/Irshad-11/Documents/blob/main/Requirement%20Tarikh%20al-Islam.png?raw=true" alt="Requirement Tarikh al-Islam">
  
  <br />

  <h1>Software Requirements Specification</h1>
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
| 2026-01-14 | 1.0.1 | Added requirements for event deletion | Irshad |


## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for **Tārīkh al-Islām**, a data-driven historical visualization platform focused on Islamic history. The purpose of this SRS is to clearly define the functional and non-functional requirements of the system for developers, reviewers, and academic evaluation.

### 1.2 Scope

Tārīkh al-Islām enables users to explore Islamic historical events through a chronological timeline, search and filtering mechanisms, and detailed event views supported by verified sources. The system supports role-based access control with different functionalities for Public Users, Contributors, and Administrators.

This SRS covers the requirements for the Minimum Viable Product (MVP) of the system.

### 1.3 Definitions, Acronyms, and Abbreviations

* **SRS**: Software Requirements Specification
* **RBAC**: Role-Based Access Control
* **MVP**: Minimum Viable Product



## 2. Overall Description

### 2.1 Product Perspective

Tārīkh al-Islām is a web-based application developed using a decoupled architecture, where the frontend and backend operate as separate components communicating via APIs. The system is designed to be extensible for future features such as interactive maps and advanced analytics.

### 2.2 User Classes and Characteristics

| User Class  | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| Public User | Users who can view approved historical events without authentication          |
| Contributor | Registered users can submit, manage, and suggest deletion of historical events. |
| Admin       | Privileged users can create, update, and delete events, approvals, and contributor accounts.       |



## 3. Functional Requirements

### 3.1 Public User Requirements

**FR-1**
The system shall allow public users to view approved historical events without requiring authentication.

**FR-2**
The system shall display historical events in a chronological timeline view.

**FR-3**
The system shall allow users to select a specific year from the timeline to view associated events.

**FR-4**
The system shall allow users to search historical events using keyword-based queries.

**FR-5**
The system shall allow users to filter historical events by time period and region.

**FR-6**
The system shall display detailed information for each historical event, including:

* Event title
* Event description
* Date or time range
* Geographic location
* Source references
* Contributor information
* Last modification metadata



### 3.2 Contributor Requirements

**FR-7**
The system shall allow users to register as contributors.

**FR-8**
The system shall allow contributors to authenticate using a secure login mechanism.

**FR-9**
The system shall allow contributors to create new historical event entries.

**FR-10**
The system shall assign a *pending* status to all contributor-submitted events by default.

**FR-11**
The system shall allow contributors to edit or delete their own events prior to administrative approval.

**FR-12**
The system shall allow contributors to view the approval status of their submitted events.

**FR-13**
The system shall allow contributors to suggest deletion of any historical events, subject to approval.



### 3.3 Administrator Requirements

**FR-14**
The system shall allow administrators to access an administrative dashboard through authentication.

**FR-15**
The system shall allow administrators to view all submitted historical events.

**FR-16**
The system shall allow administrators to approve pending historical events.

**FR-17**
The system shall allow administrators to reject historical events and provide a rejection note.

**FR-18**
The system shall allow administrators to create historical events that are automatically approved.

**FR-19**
The system shall allow administrators to edit or delete any existing historical event.

**FR-20**
The system shall allow Administrators to confirm or reverse deletion suggestions initiated by Contributors.

**FR-21**
The system shall allow administrators to suspend or reactivate contributor accounts.



## 4. Non-Functional Requirements

### 4.1 Performance Requirements

**NFR-1**
The system shall return event search and filtering results within an acceptable response time under normal operating conditions.



### 4.2 Security Requirements

**NFR-2**
The system shall enforce role-based access control for all protected resources and actions.

**NFR-3**
The system shall restrict administrative operations to authorized administrator users only.



### 4.3 Usability Requirements

**NFR-4**
The system shall provide a clean and intuitive user interface to support easy timeline navigation and event exploration.



### 4.4 Maintainability Requirements

**NFR-5**
The system shall be designed using modular and extensible components to support future enhancements such as map-based visualization.



## 5. System Constraints

**SC-1**
The frontend of the system shall be implemented using React and Tailwind CSS.

**SC-2**
The backend of the system shall be implemented using Django and Django REST Framework.

**SC-3**
PostgreSQL shall be used as the primary relational database management system.

**SC-4**
The system shall be containerized using Docker for development and deployment environments.


