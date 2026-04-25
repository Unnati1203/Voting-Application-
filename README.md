# Voting Application (Node.js & MongoDB)

A secure voting application built with Node.js, Express, and MongoDB. Users can register using their Aadhaar number, vote for candidates, and view real-time vote counts. Only Admins can manage the list of candidates.

## Features
- **User Authentication:** Sign up/Sign in using Aadhaar Number & Password.
- **Role-Based Access:** 
  - **Voter:** Can vote once (tracked via `isVoted` flag) and view live results.
  - **Admin:** Can Create, Update, and Delete candidates. Cannot vote.
- **Real-time Voting:** Live vote counting and candidate ranking.
- **Security:** JWT-based authentication and password hashing.

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)
- **Security:** bcryptjs, jsonwebtoken
- **Tools:** VS Code, Git

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/voting-app.git
   cd voting-app
