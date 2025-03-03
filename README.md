# NullClass

# Twitter-like Web Application

## Project Overview

This project is a Twitter-like web application with advanced features, developed as part of an internship program. The application includes responsive design, authentication, password recovery, audio tweet uploads, multi-language support, and subscription-based tweet posting.

## Technologies Used

- **Frontend**: React.js (Deployed on Vercel)
- **Backend**: Node.js, Express.js (Deployed on Render)
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: Firebase Authentication
- **Email Services**: SendGrid
- **Payment Gateway**: Razorpay
- **File Storage**: Cloudinary
- **Internationalization**: i18n

## Features Implemented

### 1. Responsive Website Design

- Implemented using CSS media queries.
- Ensures mobile-friendly UI and optimized layouts for different screen sizes.

### 2. Forgot Password Feature

- Users can reset passwords via email or phone.
- Password reset requests are restricted to **once per day**.
- A **random password generator** ensures passwords contain **only uppercase and lowercase letters** (no special characters or numbers).

### 3. Audio Tweet Upload

- Users can **record and upload audio tweets**.
- Authentication is required via **OTP sent to email**.
- **Audio file limitations**:
  - Maximum length: **5 minutes**
  - Maximum size: **100 MB**
- Users can upload audio **only between 2 PM to 7 PM IST**.

### 4. Multi-Language Support

- Supports **6 languages**: English, Spanish, Hindi, Portuguese, Chinese, and French.
- Users must verify their email via **OTP for Translation** before switching languages.
- Dynamic translation applied across the application.

### 5. Subscription-Based Tweeting

- Implemented a payment system with **Razorpay**.
- Plans:
  - **Free Plan**: 1 tweet per month
  - **Bronze Plan**: ₹100/month for 3 tweets
  - **Silver Plan**: ₹300/month for 5 tweets
  - **Gold Plan**: ₹1000/month for unlimited tweets
- Payments can be made **only between 10 AM - 11 AM IST**.
- An **invoice with plan details** is emailed to the user upon successful payment.

## Deployment Details

- **Frontend**: Deployed on **Vercel**.
- **Backend**: Deployed on **Render**.
- **Database**: Hosted on **MongoDB Atlas**.

## Installation & Setup

### 1. Clone the Repository

```sh
 git clone https://github.com/Viren-Kevat/NullClass.git
 cd your-repo
```

### 2. Install Dependencies

#### Backend

```sh
 cd server
 npm install
```

#### Frontend

```sh
 cd client
 npm install
```

### 3. Run the Application

#### Start Backend

```sh
 cd server
 npm start
```

#### Start Frontend

```sh
 cd client
 npm start
```

## Conclusion

This project successfully implements all the assigned tasks, ensuring a robust and feature-rich application. Key learnings include:

- Implementing OTP-based authentication.
- Restricting functionalities based on time constraints.
- Integrating payment processing with time-based restrictions.
- Deploying a scalable web application.

For further improvements, future iterations could include:

- Expanded language support with real-time translation.
- Improved UI/UX for better user engagement.

## Repository Link

[GitHub Repository](https://github.com/Viren-Kevat/NullClass)
