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

Demo API Checking on Postman – All Edge Cases
1️⃣ New Customer (No Existing Contact)
<img src="https://github.com/user-attachments/assets/6243ad78-c3b3-4cc1-b89e-cd1b62d34f13" width="800"/>

2️⃣ Same Exact Data Again
<img src="https://github.com/user-attachments/assets/b537bc48-ee4c-44e6-81b6-f5f3ae1c41c7" width="800"/>

3️⃣ Same Phone, New Email
<img src="https://github.com/user-attachments/assets/e077a245-d744-4e41-806e-c2be9943cafa" width="800"/>

4️⃣ Same Email, New Phone
<img src="https://github.com/user-attachments/assets/c8982bd8-e440-428a-a041-922bc2e95574" width="800"/>

5️⃣ Only Phone Provided
<img src="https://github.com/user-attachments/assets/f068e32e-17b8-4f02-a1ce-1659dae2923e" width="800"/>

6️⃣ Only Email Provided
<img src="https://github.com/user-attachments/assets/b43cc502-574b-4b7a-8491-bb924acc301f" width="800"/>

7️⃣ Merge Two Existing Primaries
Step 1 – Create First Primary
<img src="https://github.com/user-attachments/assets/0c3d4be2-f508-4523-a3b9-9a272a74da5d" width="800"/>

Step 2 – Create Second Primary
<img src="https://github.com/user-attachments/assets/d8bc5a26-a6ca-45ea-ae76-ceaced96f52d" width="800"/>

Step 3 – Linking Request
<img src="https://github.com/user-attachments/assets/8027c6f2-3b46-481e-b181-98bfa7c29d60" width="800"/>


8️⃣ Email Null, Phone Valid
<img src="https://github.com/user-attachments/assets/ed9a715c-0eb9-4ffe-ba32-b171d9818213" width="800"/>

9️⃣ Phone Null, Email Valid
<img src="https://github.com/user-attachments/assets/bc7e89ec-a326-49e4-8d2d-b747b5032d01" width="800"/>

🔟 Completely New Phone Only
<img src="https://github.com/user-attachments/assets/888a80ac-99ef-4b00-ae1a-fadec5cead28" width="800"/>

1️⃣1️⃣ Completely New Email Only
<img src="https://github.com/user-attachments/assets/19ceef56-7908-4b5e-9f49-5958df2abaaa" width="800"/>


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
