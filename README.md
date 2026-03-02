🚀 Bitespeed Backend Task – Identity Reconciliation

This service implements the identity reconciliation logic required by Bitespeed.

It links multiple contact records belonging to the same customer based on shared email or phone number, and returns a consolidated identity response.

The system ensures:

✅ Oldest contact always remains primary

✅ Secondary contacts are correctly linked

✅ No duplicate emails or phone numbers in response

✅ Strict adherence to required response format

✅ Atomic database operations using transactions

🛠 Tech Stack

Node.js

TypeScript

Express

PostgreSQL (Neon)

Prisma ORM

Render (Deployment)

🌐 Live Endpoint
POST https://YOUR_RENDER_URL/identify

Replace YOUR_RENDER_URL with your deployed Render service URL.

📌 API Endpoint
POST /identify
📥 Request Body (JSON)
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}

⚠️ At least one of email or phoneNumber must be provided.

📤 Response Format
{
  "contact": {
    "primaryContactId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}
Response Guarantees

First email is always the primary contact’s email

First phone number is always the primary contact’s phone

All arrays contain unique values

Only secondary contacts appear in secondaryContactIds

🧪 Curl Test Examples
1️⃣ New Customer
curl -X POST https://YOUR_RENDER_URL/identify \
-H "Content-Type: application/json" \
-d '{"email":"doc@hillvalley.edu","phoneNumber":"123456"}'

Expected:

Creates new primary contact

secondaryContactIds = []

2️⃣ Same Phone, New Email
curl -X POST https://YOUR_RENDER_URL/identify \
-H "Content-Type: application/json" \
-d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}'

Expected:

Creates secondary contact

Links to existing primary

3️⃣ Same Email, New Phone
curl -X POST https://YOUR_RENDER_URL/identify \
-H "Content-Type: application/json" \
-d '{"email":"doc@hillvalley.edu","phoneNumber":"999999"}'

Expected:

Creates secondary contact

Phone list updated

4️⃣ Only Phone Provided
curl -X POST https://YOUR_RENDER_URL/identify \
-H "Content-Type: application/json" \
-d '{"phoneNumber":"123456"}'

Expected:

Returns consolidated identity

No new record created

5️⃣ Only Email Provided
curl -X POST https://YOUR_RENDER_URL/identify \
-H "Content-Type: application/json" \
-d '{"email":"doc@hillvalley.edu"}'

Expected:

Returns consolidated identity

No new record created

🧠 Edge Case Handling (Complete Validation Matrix)
1. No Existing Contact

If neither email nor phone exists:

New contact created

linkPrecedence = "primary"

secondaryContactIds = []

2. Same Exact Data Sent Again

If both email and phone already exist:

No new record created

Existing primary returned

No duplicates in response

3. Same Phone, New Email

Secondary contact created

Linked to oldest primary

Email list updated

4. Same Email, New Phone

Secondary contact created

Linked to oldest primary

Phone list updated

5. Multiple Secondary Contacts

All linked to same primary

Unique emails and phones returned

Primary values appear first

6. Merge Two Existing Primaries (Critical Case)

If email matches one primary and phone matches another:

Oldest contact remains primary

Newer primary converted to secondary

linkedId updated

Full consolidated identity returned

7. Email Null, Phone Provided
{
  "email": null,
  "phoneNumber": "123456"
}

✔ Works correctly

8. Phone Null, Email Provided
{
  "email": "doc@hillvalley.edu",
  "phoneNumber": null
}

✔ Works correctly

9. Duplicate Prevention

After multiple merges:

No duplicate emails

No duplicate phone numbers

No duplicate secondary IDs

10. Order Guarantee

Primary contact ID always correct

Primary email always first

Primary phone always first

Secondary IDs only include secondary contacts

🏗 Architecture
Route → Controller → Service → Prisma → Database

Controller handles validation and response

Service layer contains reconciliation logic

Prisma transactions ensure atomicity

Database maintains relational consistency

🗄 Database Schema
{
  id: Int
  phoneNumber: String?
  email: String?
  linkedId: Int?
  linkPrecedence: "primary" | "secondary"
  createdAt: DateTime
  updatedAt: DateTime
  deletedAt: DateTime?
}
🚀 Deployment

Hosted on Render

PostgreSQL hosted on Neon

Environment variables securely configured

Public API endpoint accessible

✅ Submission Checklist

 Public GitHub repository

 Clean commit history

 /identify endpoint exposed

 Hosted on Render

 Live endpoint added to README

 Uses JSON body (not form-data)

 All edge cases tested

👨‍💻 Author

Bambam Kumar Gupta
Motilal Nehru National Institute of Technology Allahabad