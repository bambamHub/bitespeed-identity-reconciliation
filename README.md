🚀 Bitespeed Backend Task
🔗 Identity Reconciliation Service
<p align="center"> <b>A production-ready backend service to intelligently link customer identities across multiple purchases.</b> </p>
📌 Overview

```
This service implements the Identity Reconciliation logic required by Bitespeed.

It consolidates multiple contact records belonging to the same customer based on shared email or phone number, ensuring a single unified identity view.
```

✨ System Guarantees
```
✅ Oldest contact always remains Primary

✅ Secondary contacts are properly linked

✅ No duplicate emails or phone numbers in response

✅ Strict adherence to required response format

✅ Atomic database operations using transactions

✅ Clean MVC architecture

```

```
🛠 Tech Stack
Layer	Technology
Backend	Node.js + Express
Language	TypeScript
ORM	Prisma
Database	PostgreSQL (Neon)

```

```
Deployment	Render
🌐 Live API
POST -> https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify

```

```
🧪 Test Directly in Postman (Using Live Render URL)
✅ Step-by-Step Postman Test

Open Postman

Select POST method

Paste this URL:

https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify

Go to Body → raw → JSON

Paste:

{
  "email": "postman@test.com",
  "phoneNumber": "888888"
}

Click Send

You should receive:

{
  "contact": {
    "primaryContactId": 1,
    "emails": ["postman@test.com"],
    "phoneNumbers": ["888888"],
    "secondaryContactIds": []
  }
}

Status should be:

200 OK

```

```
📡 API Specification
Endpoint
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
🔒 Response Guarantees

Primary email always appears first

Primary phone number always appears first

All values are unique

Only secondary IDs appear in secondaryContactIds

```

🧪 Curl Test Examples
```
1️⃣ New Customer
curl -X POST https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{"email":"doc@hillvalley.edu","phoneNumber":"123456"}'
`

✔ Creates new primary contact
✔ secondaryContactIds = []

``
2️⃣ Same Phone, New Email

curl -X POST https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}'

``



✔ Creates secondary contact
✔ Links to existing primary

`
3️⃣ Same Email, New Phone
curl -X POST https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{"email":"doc@hillvalley.edu","phoneNumber":"999999"}'

`

✔ Creates secondary contact
✔ Phone list updated

`
4️⃣ Only Phone Provided
curl -X POST https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{"phoneNumber":"123456"}'

`

✔ Returns consolidated identity
✔ No new record created

`
5️⃣ Only Email Provided
curl -X POST https://bitespeed-identity-reconciliation-dv9a.onrender.com/identify \
-H "Content-Type: application/json" \
-d '{"email":"doc@hillvalley.edu"}'

`

✔ Returns consolidated identity
✔ No new record created

`
🧠 Edge Case Handling
🔹 1. No Existing Contact

Creates new primary contact.

🔹 2. Same Exact Data Again

No duplicate record created.

🔹 3. Same Phone + New Email

Creates secondary linked to primary.

🔹 4. Same Email + New Phone

Creates secondary linked to primary.

🔹 5. Multiple Secondary Contacts

All linked to same primary. Unique response values.

🔹 6. Merge Two Existing Primaries (Critical Case)

If:

Email matches one primary

Phone matches another

Then:

Oldest remains primary

Newer primary becomes secondary

linkedId updated

Full identity consolidated

🔹 7. Email Null, Phone Provided

Handled correctly.

🔹 8. Phone Null, Email Provided

Handled correctly.

🔹 9. Duplicate Prevention

Emails and phones are always unique.

🔹 10. Order Guarantee

Primary email & phone always appear first.

```

```
🏗 Architecture
Route → Controller → Service → Prisma → Database

Controller handles validation & response

Service layer contains reconciliation logic

Prisma transaction ensures atomicity

Database maintains relational integrity

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

```

```
🚀 Deployment

Hosted on Render

Database hosted on Neon

Environment variables securely configured

Public API endpoint accessible

```

```

✅ Submission Checklist

✔ Public GitHub repository

✔ Clean commit history

✔ /identify endpoint exposed

✔ Hosted on Render

✔ Live endpoint added to README

✔ JSON body used (not form-data)

✔ All edge cases tested

```


👨‍💻 Author
```
Bambam Kumar Gupta

Motilal Nehru National Institute of Technology Allahabad
```
