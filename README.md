# 🚀 NextJS E-Commerce Dashboard

A modern, full-stack e-commerce dashboard built with Next.js 15 frontend and NestJS backend, featuring product management, user authentication, and integrated Stripe payments.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC?style=flat-square&logo=tailwind-css)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?style=flat-square&logo=stripe)

## ✨ Features

### 🛍️ **E-Commerce Core**

- **Product Management** - Browse, search, and filter products
- **Product Details** - Detailed product pages with image galleries
- **Shopping Cart** - Add to cart and manage quantities
- **Stripe Checkout** - Secure payment processing
- **Order Management** - Track purchases and order history

### 🔐 **Authentication & Security**

- **NextAuth.js** - Secure user authentication
- **Protected Routes** - Dashboard access control
- **Session Management** - Automatic login/logout
- **Middleware Protection** - Route-level security

### 📊 **Dashboard Features**

- **Admin Panel** - Manage products, orders, and users
- **Analytics** - Sales metrics and performance tracking
- **Responsive Design** - Mobile-first UI/UX
- **Search & Filtering** - Advanced product discovery

### 🎨 **Modern UI/UX**

- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Beautiful icon library
- **Responsive Layout** - Works on all devices
- **Loading States** - Smooth user interactions

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - SVG icon library

### **Backend**

- **NestJS API** - Node.js backend framework
- **API Proxy** - Next.js proxy to NestJS backend
- **RESTful APIs** - Standard HTTP endpoints

### **Authentication**

- **NextAuth.js** - Authentication library
- **JWT Tokens** - Secure session management

### **Payments**

- **Stripe** - Payment processing
- **Stripe Checkout** - Hosted payment pages
- **Webhooks** - Real-time payment events

## 🚀 Getting Started

### **Prerequisites**

```bash
Node.js 18.0+
npm or yarn
NestJS Backend API running
Stripe account
```

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/nextjs-dashboard.git
cd nextjs-dashboard
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**
   Create `.env.local` file in the root directory:

```env
# NestJS Backend API
EXTERNAL_API_URL="http://localhost:5000/api"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication (Optional)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Start NestJS Backend**

```bash
# Make sure your NestJS backend is running on port 8080
# The backend should expose API endpoints at:
# http://localhost:5000/api/products
# http://localhost:5000/api/users
# etc.
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nextjs-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes & Proxy
│   │   ├── [...path]/            # API proxy to NestJS
│   │   ├── checkout/             # Stripe checkout
│   │   └── stripe/               # Stripe webhooks
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── products/             # Product management
│   │   │   ├── [id]/             # Dynamic product pages
│   │   │   └── page.tsx          # Products listing
│   │   └── page.tsx              # Dashboard home
│   ├── lib/                      # Utility functions
│   │   ├── auth.ts               # Authentication logic
│   │   ├── checkout-sessions.ts  # Stripe checkout
│   │   └── products.ts           # Product API calls
│   ├── ui/                       # Reusable UI components
│   │   ├── products/             # Product-specific components
│   │   ├── button.tsx            # Button component
│   │   ├── search.tsx            # Search component
│   │   └── ...                   # Other UI components
│   ├── utils/                    # Utility functions
│   │   └── get-stripejs.ts       # Stripe.js configuration
│   ├── login/                    # Authentication pages
│   ├── checkout/                 # Checkout success/cancel pages
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── auth.config.ts                # NextAuth configuration
├── middleware.ts                 # Route protection middleware
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.js                # Next.js configuration
└── package.json                  # Dependencies and scripts
```

## 🔧 Configuration

### **NestJS Backend Integration**

1. **API Proxy Setup** - All API calls are proxied to NestJS backend
2. **Environment Variables** - Configure `EXTERNAL_API_URL` to point to your backend
3. **CORS Configuration** - Ensure NestJS backend allows requests from Next.js frontend

### **Stripe Setup**

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks endpoint: `http://localhost:3000/api/stripe/webhook`
4. Add webhook events: `checkout.session.completed`, `payment_intent.succeeded`

### **Authentication Setup**

1. Configure NextAuth.js providers
2. Set up protected routes in middleware
3. Configure session management

## 📚 API Integration

### **NestJS Backend Endpoints**

The frontend expects these endpoints from your NestJS backend:

```typescript
GET /api/products              # Get all products
GET /api/products/:id          # Get product by ID
POST /api/products             # Create new product
PUT /api/products/:id          # Update product
DELETE /api/products/:id       # Delete product

```

## 🧪 Testing

### **Test Payment Cards**

```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
Declined: 4000 0000 0000 0002
```

### **Backend Requirements**

- NestJS backend running on port 5000
- CORS enabled for http://localhost:3000
- JSON responses for all API calls

## 🚀 Deployment

### **Backend Deployment**

- Deploy your NestJS backend separately
- Update `NESTJS_API_URL` to production backend URL
- Ensure CORS allows your production frontend domain

### **Environment Variables for Production**

- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Update Stripe webhook endpoint URL
- Use production Stripe keys

## 🔄 Development Workflow

1. **Start NestJS Backend** (port 5000)
2. **Start Next.js Frontend** (port 3000)
3. **Authentication:** Handled by Next.js with NextAuth.js
4. **Payments:** Handled by Next.js with Stripe

## 📖 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Course](https://nextjs.org/learn)
- [NestJS Documentation](https://nestjs.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/tranloi2k)
- Email: tranloi162710@gmail.com

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [NestJS Team](https://nestjs.com/) for the powerful backend framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

---

⭐ **Star this repository if you found it helpful!**
