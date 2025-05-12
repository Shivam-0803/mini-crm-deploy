#!/bin/bash

echo "=========================================="
echo "Mini CRM Deployment Preparation Script"
echo "=========================================="
echo ""

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "Error: render.yaml file not found!"
    exit 1
fi

echo "This script will help prepare your project for deployment on Render.com"
echo ""

# Install dependencies
echo "Step 1: Installing dependencies..."
npm run install:all
echo "✅ Dependencies installed successfully!"
echo ""

# Create .env files if they don't exist
echo "Step 2: Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo "Created backend/.env from template. Please update the values."
    else
        echo "Warning: No template found. Creating empty backend/.env file."
        touch backend/.env
    fi
fi

if [ ! -f "crm-frontend/.env" ]; then
    if [ -f "crm-frontend/.env.example" ]; then
        cp crm-frontend/.env.example crm-frontend/.env
        echo "Created crm-frontend/.env from template. Please update the values."
    else
        echo "Warning: No template found. Creating empty crm-frontend/.env file."
        touch crm-frontend/.env
    fi
fi

echo "✅ Environment files setup complete!"
echo ""

# Build frontend
echo "Step 3: Building frontend..."
cd crm-frontend && npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi
cd ..
echo ""

# Test backend
echo "Step 4: Testing backend connection..."
cd backend && node -e "
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed!', err.message);
    process.exit(1);
  });
"
if [ $? -eq 0 ]; then
    echo "✅ Backend connection test passed!"
else
    echo "❌ Backend connection test failed! Please check your MONGODB_URI in backend/.env"
fi
cd ..
echo ""

echo "Step 5: Deployment instructions..."
echo ""
echo "To deploy to Render.com:"
echo "1. Push your code to GitHub"
echo "2. Go to Render.com and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Use the settings from render.yaml"
echo "5. Add all required environment variables"
echo ""
echo "Alternatively, use the 'Deploy to Render' button in the README.md"
echo ""

echo "=========================================="
echo "Deployment preparation complete!"
echo "==========================================" 