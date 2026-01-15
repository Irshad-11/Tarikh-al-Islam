
<div align="center">
  <img src="https://github.com/Irshad-11/Documents/blob/main/TestCase%20Tarikh%20al-Islam.png?raw=true" alt="Tast Case Tarikh al-Islam">
  <br />
  <h1>Test Plan & Test Cases</h1>
  <h3><i>Tārīkh al-Islām</i></h3>
  <hr />
</div>

**Author:** Irshad Hossain <br>
**Organization:** University of Frontier Technology, Bangladesh <br>
**Date:** January 15, 2026 <br>
**Version:** 1.0.0 <br>


### Revision History

| Date       | Version | Description                 | Author |
| ---------- | ------- | --------------------------- | ------ |
| 2026-01-15 | 1.0.0   | Initial MVP Database Design | Irshad |


## 1. Purpose

This document defines the **testing strategy, scope, and test cases** for the *Tarikh al-Islam* system.

The goal of this testing document is to ensure:

* Functional correctness
* Data integrity
* Workflow reliability
* Role-based access enforcement


## 2. Testing Scope

The testing covers the following system areas:

* User authentication and authorization
* Event lifecycle workflows
* Data validation and integrity
* API behavior (functional)
* Security constraints (RBAC)
* System integration


## 3. Test Levels

### 3.1 Unit Testing

Tests individual components such as:

* Model validation
* Business logic functions
* Role checks

### 3.2 Integration Testing

Tests interaction between:

* Frontend and backend
* Backend and database

### 3.3 System Testing

Tests the system as a whole against requirements.

### 3.4 Acceptance Testing

Validates the system against user and academic requirements.



## 4. Test Environment

| Component  | Environment     |
| ---------- | --------------- |
| Backend    | Django + DRF    |
| Database   | PostgreSQL      |
| Frontend   | React           |
| Deployment | Docker          |
| OS         | Linux / Windows |



## 5. Test Data Strategy

Test data includes:

* Sample historical events
* Test contributor accounts
* Admin accounts
* Approved, pending, and rejected events

All test data is isolated from production data.



## 6. Test Case Structure

Each test case follows this structure:

| Field           | Description             |
| --------------- | ----------------------- |
| Test Case ID    | Unique identifier       |
| Test Title      | Short description       |
| Actor           | Who performs the action |
| Precondition    | Required system state   |
| Test Steps      | Actions performed       |
| Expected Result | System response         |
| Status          | Pass / Fail             |



## 7. Functional Test Cases

### 7.1 Authentication Tests

| Test Case ID | Test Title                      | Actor       | Precondition   | Expected Result  |
| ------------ | ------------------------------- | ----------- | -------------- | ---------------- |
| AUTH-01      | Login with valid credentials    | Contributor | Account exists | Login successful |
| AUTH-02      | Login with invalid password     | Contributor | Account exists | Access denied    |
| AUTH-03      | Access admin panel without role | Contributor | Logged in      | Access blocked   |



### 7.2 Event Submission Tests

| Test Case ID | Test Title                       | Actor       | Precondition | Expected Result        |
| ------------ | -------------------------------- | ----------- | ------------ | ---------------------- |
| EVT-01       | Submit new event                 | Contributor | Logged in    | Event saved as Pending |
| EVT-02       | Submit event with missing fields | Contributor | Logged in    | Validation error       |
| EVT-03       | View own submitted events        | Contributor | Logged in    | Events displayed       |



### 7.3 Event Approval Tests

| Test Case ID | Test Title            | Actor | Precondition         | Expected Result            |
| ------------ | --------------------- | ----- | -------------------- | -------------------------- |
| ADM-01       | View pending events   | Admin | Logged in            | Pending list displayed     |
| ADM-02       | Approve pending event | Admin | Pending event exists | Status updated to Approved |
| ADM-03       | Reject pending event  | Admin | Pending event exists | Status updated to Rejected |



### 7.4 Event Deletion Workflow Tests

| Test Case ID | Test Title               | Actor       | Precondition       | Expected Result                   |
| ------------ | ------------------------ | ----------- | ------------------ | --------------------------------- |
| DEL-01       | Request event deletion   | Contributor | Event is Approved  | Status becomes Deletion Requested |
| DEL-02       | Approve deletion request | Admin       | Deletion requested | Event marked Deleted              |
| DEL-03       | Decline deletion request | Admin       | Deletion requested | Event restored to Approved        |



### 7.5 Event Retrieval Tests

| Test Case ID | Test Title           | Actor       | Precondition          | Expected Result  |
| ------------ | -------------------- | ----------- | --------------------- | ---------------- |
| PUB-01       | View timeline events | Public User | Approved events exist | Events displayed |
| PUB-02       | View rejected event  | Public User | Rejected event exists | Not visible      |



## 8. Security and Access Control Tests

| Test Case ID | Test Title                        | Actor       | Expected Result |
| ------------ | --------------------------------- | ----------- | --------------- |
| SEC-01       | Contributor attempts admin action | Contributor | Access denied   |
| SEC-02       | Public user accesses dashboard    | Public User | Access denied   |
| SEC-03       | Suspended contributor login       | Contributor | Login blocked   |



## 9. Non-Functional Tests

### 9.1 Performance Testing

* Timeline loads within acceptable time.
* Event filtering responds quickly.

### 9.2 Reliability Testing

* System handles concurrent requests.
* No data corruption during state changes.

### 9.3 Usability Testing

* Timeline is easy to navigate.
* Event details are readable.


## 10. Traceability

Each test case is traceable to:

* System requirements
* Workflow specification
* Architecture design

This ensures full test coverage.



## 11. Test Completion Criteria

Testing is considered complete when:

* All critical test cases pass
* No blocking defects remain
* MVP requirements are satisfied


