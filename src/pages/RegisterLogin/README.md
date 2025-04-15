# Authentication System for Halcyon 2025

This directory contains the authentication system for the Halcyon 2025 festival website. It includes the following features:

## Features

1. **User Login**: Allows registered users to log in to their accounts
2. **User Registration**: Allows new users to create accounts
3. **Admin Login**: Provides a separate login for administrators
4. **Password Recovery**: Allows users to reset their passwords via email OTP

## Components

- `index.jsx`: Main component that handles tab switching between different auth forms
- `Login.jsx`: User login form
- `Register.jsx`: User registration form
- `AdminLogin.jsx`: Admin login form
- `ForgotPassword.jsx`: Password recovery form
- `styles.css`: Styling for all authentication components

## Backend Integration

The authentication system is designed to connect to your backend API. You need to configure the API endpoints in the `src/config.js` file:

```javascript
// API URL - replace with your actual backend URL
export const API_URL = 'https://your-backend-api.com/api';
```

## Authentication Flow

1. **User Registration**:
   - User fills out the registration form
   - Form data is sent to the backend API
   - On successful registration, a token is stored in localStorage
   - User is redirected to the home page

2. **User Login**:
   - User enters email and password
   - Credentials are sent to the backend API
   - On successful login, a token is stored in localStorage
   - User is redirected to the home page

3. **Admin Login**:
   - Admin enters email, password, and admin code
   - Credentials are sent to the backend API
   - On successful login, an admin token is stored in localStorage
   - Admin is redirected to the admin dashboard

4. **Password Recovery**:
   - User enters their email
   - OTP is sent to the email
   - User enters the OTP for verification
   - User sets a new password
   - User is redirected to the login page

## Token Storage

Authentication tokens are stored in localStorage:
- User token: stored as `cookie`
- Admin token: stored as `adminCookie`

You can change these names in the `src/config.js` file.

## Customization

You can customize the appearance of the authentication pages by modifying the `styles.css` file. The current design follows the space theme of the Halcyon 2025 festival.
