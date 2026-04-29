# 🌊 Flood Emergency Communication Platform — Project Specification

## 1. Overview

In recent years, several regions in Brazil have been affected by floods and disasters caused by heavy rainfall. These events impact thousands of people, creating critical situations that go far beyond material loss.

One of the biggest challenges in these scenarios is **communication**. Important information exists, but it is often **scattered across social media and messaging apps**, making it difficult to access quickly and reliably.

This project proposes a technological solution to **structure, centralize, and distribute critical information efficiently**, helping reduce the impact of disasters and improving communication among all stakeholders.

---

## 2. Objective

The goal of this project is to build a platform that:

* Enables **real-time communication**
* Connects **people who need help** with **those who can help**
* Organizes emergency information in a **clear and accessible way**
* Reduces the impact of **misinformation and lack of coordination**

---

## 3. Problem Definition

### Core Problem

During flood situations:

* Information is **decentralized**
* Access to information is **slow or unreliable**
* There is **no structured communication channel**
* Coordination between people is **inefficient**

### Key Pain Points

**Affected Individuals**

* Don’t know where to find shelter
* Don’t know which areas are safe
* Don’t know how to request help

**Volunteers**

* Don’t know where help is needed
* Lack visibility into priorities

**Authorities**

* Struggle to distribute official information quickly
* Lack centralized visibility of needs

---

## 4. Stakeholders

* Affected individuals
* Volunteers
* NGOs
* Government / Civil Defense
* Donors

---

## 5. Project Scope

You should focus on **one main use case (MVP)**:

### Option A — Help Request Center

* Users can create help requests
* Requests include location and type of need
* Requests can be tracked (open / in progress / resolved)

### Option B — Information Map

* Display:

  * Safe shelters
  * Risk areas
  * Support points
* Interactive filtering

### Option C — Alerts & Communication

* Feed of updates
* Emergency alerts
* Official information posts

---

## 6. Functional Requirements

* Users must be able to:

  * Access the platform (with or without authentication)
  * Submit information (help request, alert, etc.)
  * View relevant data

* The system must:

  * Store structured data
  * Provide fast access to information
  * Organize and categorize content

---

## 7. Non-Functional Requirements

* Simple and intuitive UI
* Mobile-first (recommended)
* Fast performance
* Reliable data structure

---

## 8. Required Tech Stack

### Front-end

* Any framework or tools (e.g., React, Vue, HTML/CSS/JS)

### Back-end

* Node.js
* Express

### Database

* PostgreSQL

---

## 9. System Architecture

### Front-end

* User interface
* Data visualization
* API consumption

### Back-end

* Business logic
* REST API
* Database integration

### Database

* Stores:

  * Users
  * Requests / Alerts
  * Status data

---

## 10. README Structure

Your project must include:

### 1. Idea Presentation

Explain how your idea originated.

> Example:
> This project was created based on the flood challenge in Brazil. I decided to focus on the problem of ________.

### 2. Chosen Problem

Explain which scenario you decided to solve.

### 3. Proposed Solution

Explain your system idea and approach.

### 4. System Structure

Describe:

* Front-end
* Back-end
* Database

---

## 11. Differentiators (What Makes This Project Stand Out)

To elevate your project, implement **2–3 of the following features well**:

---

### 📍 1. Smart Geolocation (Interactive Map)

* Display:

  * Help requests
  * Shelters
  * Risk zones
* Filters by category

**Why it stands out:**
Turns raw data into **fast decision-making tools**.

---

### ⚡ 2. Emergency Priority System

* Classify requests:

  * 🔴 Critical
  * 🟡 Urgent
  * 🟢 Moderate

Based on:

* Keywords
* Type of request
* Waiting time

**Why it stands out:**
Demonstrates **real-world prioritization thinking**.

---

### 🤝 3. Direct User Connection

* Volunteers can accept requests
* Requests show who is helping
* Status updates in real time

**Why it stands out:**
Moves beyond information → enables **actual problem solving**.

---

### 🔄 4. Real-Time Updates

* Automatic updates for:

  * Request status
  * Alerts

**Why it stands out:**
Creates a **live system**, not static data.

---

### 🧠 5. Information Validation System

* Tag content as:

  * ✅ Verified
  * ⚠️ Unverified
* Allow admin or community validation

**Why it stands out:**
Addresses **misinformation**, a critical real-world issue.

---

### 📶 6. Low Connectivity Mode

* Lightweight interface
* Minimal assets
* Optional caching (PWA)

**Why it stands out:**
Designed for **real disaster conditions**.

---

### 🔔 7. Smart Alerts

* Alerts based on:

  * Location
  * Risk level

**Why it stands out:**
Makes the system **proactive**, not reactive.

---

### 🧩 8. Ultra-Simple UX

* Large buttons
* Minimal steps
* Fast actions (e.g., “Request Help” in one click)

**Why it stands out:**
Optimized for **stressful emergency scenarios**.

---

### 📊 9. Admin Dashboard

* Overview of:

  * Active requests
  * Affected areas
  * Demand types

**Why it stands out:**
Supports **decision-making and coordination**.

---

### 💬 10. Built-in Communication (Advanced)

* Simple chat between users

**Why it stands out:**
Enables **real coordination**, not just data sharing.

---

## 12. Evaluation Criteria

Your project will be evaluated based on:

* Problem understanding
* Solution coherence
* System organization
* Technology usage
* Critical thinking

---

## 13. Out of Scope

* Production-ready system
* Full scalability
* External integrations (optional)

---

## 14. Expected Outcome

By the end of this project, you should demonstrate:

* Clear understanding of a real-world problem
* Ability to design a structured solution
* Proper use of technology
* Organized and well-documented project

---

## 💡 Final Tip

Do not try to implement everything.

👉 Choose **2–3 strong differentiators** and execute them well.

**Strong combo example:**

* Interactive map
* Priority system
* Volunteer-request connection

That alone already puts the project above average.

---

### ⚡ Build Something Visible Early (Without Creating Future Rework)

Start with a **simple but visible version of your core feature as early as possible**, even if it’s incomplete.

For example:

* Display a basic list of help requests before building the full map
* Implement static priority labels before automating classification
* Allow manual status updates before real-time sync

However, design your system **with the full scope in mind from the beginning**:

* Define your data model (e.g., requests, users, status) early
* Keep your API structure consistent with future features
* Avoid hardcoding logic that will need to be rewritten later

👉 The goal is to:

* Deliver something **visible and testable quickly**
* While ensuring it can **evolve without major refactoring**

Think:
**“Start simple, but not short-sighted.”**


