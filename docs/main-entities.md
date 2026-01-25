# Main Entities

This document describes the main entities used in the application.

---

## User
Represents the authenticated owner of the data.

- id
- username
- password (hashed)
- createdAt

A user owns all contacts, tags, and notes.

---

## Contact (Person)
Represents a person I have met.

### Fields
- id
- name (required)

- age
- ageType
  - exact
  - approximate

- height (approximate)

- occupation
- occupationDetails

- whereMet
- howMet

- photo (optional, single)

- tags (list of Tag references)

- createdAt
- updatedAt

---

## Tag
Used to categorize contacts.

### Fields
- id
- name

### Notes
- Tags are selected from a predefined list
- Tags are provided by the backend
- Used for filtering, sorting, and grouping

---

## Note
Represents a personal note or journal entry related to a contact.

### Fields
- id
- contactId
- title
- description
- createdAt

### Notes
- Each contact can have unlimited notes
- Notes are optional

---

## Relationships
- User → Contacts (one-to-many)
- Contact → Notes (one-to-many)
- Contact → Tags (many-to-many)

---

## Extensibility
- New fields can be added to Contact without breaking existing logic
- New entities can be introduced later if needed
