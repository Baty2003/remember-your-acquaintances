# Screens

This document describes the UI screens and layout for the application.

---

## 1) Auth – Login

Authentication uses username only (no email).

### Goal
Access personal data.

### UI elements
- Username input
- Password input
- “Log in” button
- Error message area

### Actions
- Log in
- Log out (from profile or header)

### Notes
- No registration UI required (can be manual/admin-only)
- Simple, private auth

---

## 2) Dashboard – Contacts List

### Goal
Browse and manage all contacts.

### UI layout

#### Header
- Search input (by name, tags, occupation)
- “Create Contact” button

#### Filters section
- Tags (multi-select)
- Date range (created / updated)

#### Sorting
- Name
- Date created
- Last updated

#### Grouping
- By tag
- By occupation

### Contact list item
- Name
- Age (~ indicator if approximate)
- Occupation (short)
- Tags
- Photo thumbnail (if exists)

### Actions
- Open contact details
- Create contact

---

## 3) Create Contact

### Goal
Create a new contact.

### Sections

#### Basic Information
- Name (required)
- Age
- Age type:
  - exact
  - approximate (checkbox / toggle)
- Height (approximate)

#### Meeting Information
- Where met
- How met

#### Occupation
- Occupation
- Occupation details (specialization / sphere)

#### Tags
- Multi-select tags
- Tag list loaded from backend

#### Photo
- Upload one photo (optional)

### Actions
- Save (create contact)
- Cancel

---

## 4) Contact Details (Profile Page)

### Goal
See full information about a contact and manage notes.

### Header
- Photo
- Name
- Age (with exact / approximate indicator)
- Occupation + details
- Tags

### Information Section
- Where met
- How met
- Height

---

## 5) Notes Section (Embedded, NOT modal)

Notes are a permanent section on the contact page.

### Layout
- Notes list (chronological)
  - Title
  - Created date
  - Short preview of description
- “Add Note” button at top or bottom

### Create Note (inline or separate sub-section)
- Title input
- Description textarea
- Save / Cancel buttons

### Notes behavior
- Unlimited notes per contact
- Notes are part of the contact page
- No modal dialogs

---

## 6) Edit Contact

### Goal
Update existing contact data.

### Layout
Same layout as “Create Contact” with all fields pre-filled.

### Actions
- Save changes
- Cancel

---

## 7) Tags Management (Optional / Later)

### Goal
Manage available tags.

### UI
- Tags list
- Create tag input
- Delete tag

---

## Navigation (Recommended)
- Left sidebar:
  - Dashboard
  - (Optional later) Tags
- Main content area for screens

---

## MVP Screen Set

Minimal version should include:
- Login (username + password)
- Dashboard
- Create Contact
- Contact Details (with embedded Notes section)
- Add Note (inline)
