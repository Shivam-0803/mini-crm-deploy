# Mini CRM Project

A full-stack Customer Relationship Management application with authentication, campaign management, and customer segmentation.

## Features

- Google OAuth Authentication
- Customer management
- Campaign creation and tracking
- Customer segmentation
- Responsive dashboard with charts and analytics

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Passport.js with Google OAuth

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB connection

### Installation

1. Clone this repository:
```bash
git clone https://github.com/Shivam-0803/mini-crm-.git
cd mini-crm-
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Create `.env` file in the backend directory
   - Create `.env` file in the crm-frontend directory

4. Start the development servers:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:5174
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## License

MIT
# mini-crm-
