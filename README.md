# TaskApp - Full-Stack Task Completion Platform

A complete micro-earning platform where employers can post paid tasks and workers can complete them to earn money. Built with React, Node.js, and multiple database options.

## 🚀 Features

### Core Features
- **Multi-Role Authentication**: Worker, Employer, and Admin roles with JWT authentication
- **Task Management**: Create, browse, submit, and review tasks
- **Real-time Notifications**: Socket.io integration for instant updates
- **Wallet System**: Virtual wallet with withdrawal and deposit functionality
- **Payment Processing**: Stripe and PayPal integration (demo mode available)
- **File Upload Support**: Cloudinary integration for file handling
- **Responsive Design**: Mobile-first design with Tailwind CSS

### User Roles

#### Workers
- Browse and filter available tasks
- Submit work with various proof types (text, image, URL, file)
- Track submission status and earnings
- Manage wallet and withdraw funds
- View approval rates and worker level

#### Employers
- Create detailed tasks with quality requirements
- Review and approve/reject worker submissions
- Manage task budgets and deadlines
- Track task completion progress
- Add funds to wallet

#### Admins
- Platform statistics and analytics
- User management and moderation
- Task oversight and quality control
- Transaction monitoring

## 🛠 Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **Socket.io Client** for real-time features
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **Socket.io** for real-time communication
- **JWT** for authentication
- **bcrypt** for password hashing
- **Express Rate Limiting** for security
- **Helmet** for security headers
- **Express Validator** for input validation

### Database Options
- **Demo Mode**: In-memory data for quick testing
- **MongoDB**: Traditional NoSQL database with Mongoose
- **Supabase**: Modern PostgreSQL with real-time features

### Additional Services
- **Cloudinary**: File upload and management
- **SendGrid**: Email notifications
- **Stripe**: Payment processing
- **PayPal**: Alternative payment method

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` with your configuration:
   ```env
   # For Supabase (recommended)
   DATABASE_MODE=supabase
   SUPABASE_URL=https://xwvpkvzotdaugkywdnme.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   
   # Or for demo mode (no database needed)
   DATABASE_MODE=demo
   ```

4. **Setup Supabase (if using Supabase)**
   ```bash
   # Run the interactive setup
   npm run setup-supabase
   
   # Then run the SQL schema in your Supabase project
   # Copy contents of database/supabase-schema-simple.sql
   # Paste in Supabase SQL Editor and execute
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Or production build
   npm run build
   cd server && npm start
   ```

6. **Access the application**
   - Development: http://localhost:3000 (frontend) + http://localhost:5000 (API)
   - Production: http://localhost:5000 (full app)

### Demo Accounts

The platform includes pre-configured demo accounts:

- **Worker**: worker@taskapp.com / worker123
- **Employer**: employer@taskapp.com / employer123  
- **Admin**: admin@taskapp.com / admin123

## 📁 Project Structure

```
taskapp/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API services
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Node.js backend
│   ├── config/           # Database and app configuration
│   ├── middleware/       # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   └── package.json
├── package.json         # Root package.json
└── README.md
```

## 🔧 Configuration

### Database Modes

#### Demo Mode (Default)
```env
DATABASE_MODE=demo
```
- Uses in-memory data storage
- Perfect for testing and development
- Includes sample data and users
- No external database required

#### MongoDB
```env
DATABASE_MODE=mongodb
MONGODB_URI=mongodb://localhost:27017/taskapp
```

#### Supabase
```env
DATABASE_MODE=supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### Payment Integration

#### Stripe
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### PayPal
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Email Notifications
```env
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@taskapp.com
```

### File Upload
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🎯 Key Features Walkthrough

### For Workers
1. **Sign Up**: Create account and choose "worker" role
2. **Browse Tasks**: Filter by category, payout, deadline
3. **Task Details**: View requirements and submit work
4. **Track Progress**: Monitor submissions and earnings
5. **Withdraw Funds**: Cash out earnings via multiple methods

### For Employers
1. **Create Tasks**: Set title, description, payout, and requirements
2. **Manage Tasks**: Track progress and worker submissions
3. **Review Work**: Approve or reject submissions with feedback
4. **Add Funds**: Deposit money to pay for completed tasks
5. **Analytics**: View task performance and spending

### For Admins
1. **Platform Overview**: Monitor users, tasks, and transactions
2. **User Management**: Manage user accounts and permissions
3. **Quality Control**: Moderate tasks and resolve disputes
4. **Financial Tracking**: Monitor platform revenue and payouts

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS protection
- Helmet security headers
- CSRF protection

## 🚀 Deployment

### Environment Variables
Set all required environment variables for production:

```env
NODE_ENV=production
DATABASE_MODE=mongodb  # or supabase
# Add all other production configurations
```

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

### Manual Deployment
1. Build the frontend: `cd client && npm run build`
2. Deploy backend to your server
3. Configure reverse proxy (Nginx recommended)
4. Set up SSL certificates
5. Configure production database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo mode for examples

## 🎉 Acknowledgments

- Built with modern React and Node.js best practices
- Inspired by platforms like Fiverr, Upwork, and Amazon MTurk
- Designed for scalability and maintainability
- Community-driven development approach