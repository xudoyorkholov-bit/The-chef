# 🍽️ The Chef Restaurant Website

A full-stack Progressive Web App (PWA) restaurant website built with React, TypeScript, Node.js, Express, and MongoDB.

> **📱 Installable as a mobile app!** Works offline and provides a native app experience.

## Project Structure

```
the-chef-restaurant/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + TypeScript
└── .kiro/specs/       # Project specifications
```

## Features

### Core Features
- 🍽️ Menu browsing with categories and filtering
- 📅 Online reservation system with confirmation
- 🛒 Shopping cart and online ordering
- 🖼️ Photo gallery with lightbox
- 📧 Contact form
- 💬 Customer testimonials and reviews
- 👤 User profiles with order history
- 🔐 JWT authentication and authorization

### PWA Features
- 📱 **Installable** - Add to home screen on any device
- 🚀 **Fast** - Optimized performance with service workers
- 📴 **Offline** - Works without internet connection
- 🔔 **Push Notifications** - Get updates about orders and offers
- 🎨 **Native Feel** - Full-screen app experience
- 🔄 **Auto-updates** - Always get the latest version

### Admin Features
- 👨‍💼 Admin dashboard for content management
- 📊 Order management and tracking
- 📅 Reservation management
- 📝 Menu item CRUD operations
- 🖼️ Gallery management
- 💬 Testimonial moderation

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT
- bcrypt
- Multer (file uploads)

### Testing
- Jest
- fast-check (Property-based testing)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone the repository

2. Install dependencies:

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. Set up environment variables:

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
```

4. Configure your MongoDB connection in `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/thechef
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thechef
```

5. Seed the database (optional):

```bash
cd backend
npm run seed
```

6. Run the development servers:

```bash
# Frontend (port 5173)
cd frontend
npm run dev

# Backend (port 5000)
cd backend
npm run dev
```

## 📱 Installing as PWA

### For Users

The app can be installed on any device:

**📱 Android:**
1. Open the website in Chrome
2. Tap "Install" when prompted
3. Or: Menu (⋮) → "Add to Home screen"

**🍎 iPhone:**
1. Open in Safari (only Safari supports PWA on iOS)
2. Tap Share button (📤)
3. Select "Add to Home Screen"

**💻 Desktop:**
1. Open in Chrome or Edge
2. Click install icon (⊕) in address bar
3. Or: Menu (⋮) → "Install The Chef"

For detailed instructions, see [PWA_INSTALL_GUIDE_UZ.md](./PWA_INSTALL_GUIDE_UZ.md)

**⚠️ Troubleshooting:**
If the install button doesn't work automatically:
- Make sure you're using a supported browser (Chrome, Edge, Safari)
- Wait 30 seconds on the page for the install prompt to activate
- Try the manual installation method from browser menu
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions

### For Developers

PWA features are automatically enabled. The app includes:
- Service Worker for offline functionality
- Web App Manifest with icons
- Install prompt component
- Offline fallback pages

**Development Testing:**
```bash
# Enable PWA in development mode (already configured)
npm run dev

# Test production build locally
npm run build
npm run preview
```

**PWA Requirements:**
- ✅ HTTPS (or localhost for development)
- ✅ Service Worker registered
- ✅ Valid manifest.json
- ✅ Icons in all required sizes
- ✅ User engagement (30s+ on page)

To regenerate PWA icons:
```bash
cd frontend
node generate-icons.cjs
```

## Design

### Color Scheme
- **Background**: Cream (#FFF8E7)
- **Primary**: Green (#4CAF50)
- **Accent**: Liver (#8B4513)
- **Text**: Black (#000000) / Dark Liver (#654321)
- **Cards**: White with soft shadows (box-shadow: 0 2px 8px rgba(0,0,0,0.1))

### PWA Icons
All required PWA icons are included:
- 72x72, 96x96, 128x128, 144x144, 152x152 (Android)
- 192x192, 384x384, 512x512 (PWA standard)
- 180x180 (Apple touch icon)
- 32x32 (Favicon)

Icons feature a chef's hat with fork and knife design in brand colors.

## 📚 Documentation

- [User Guide (Uzbek)](./FOYDALANUVCHI_QOLLANMA.md) - How to use the app
- [PWA Install Guide (Uzbek)](./PWA_INSTALL_GUIDE_UZ.md) - How to install on different devices
- [PWA Icons Guide](./frontend/PWA_ICONS_GUIDE.md) - Technical details about PWA icons
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run property-based tests
npm run test:properties

# Run all tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the production bundle: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend (Heroku/Railway/Vercel)
1. Set environment variables
2. Deploy from Git repository
3. Ensure MongoDB connection is configured

### MongoDB (Atlas)
1. Create a free cluster at mongodb.com/atlas
2. Get connection string
3. Add to backend environment variables

## 📄 License

MIT
