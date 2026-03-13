# Simple CRUD Apps - Full-Stack Product Management System

A complete full-stack CRUD (Create, Read, Update, Delete) application featuring both a REST API backend and an interactive web frontend. Built with Node.js, Express.js, MongoDB (Mongoose), and vanilla JavaScript, deployed on Vercel. The codebase uses a lightweight separation of concerns (routes → controllers → models) while serving the frontend as static files from the same Express app.

## 🚀 Overview

This project demonstrates a complete full-stack development workflow:

- **Backend API**: Express.js REST API with MongoDB integration
- **Frontend Interface**: Vanilla JS web app served from `public/`
- **Database**: MongoDB Atlas cloud database
- **Deployment**: Hosted on Vercel at [https://simple-crud-apps.vercel.app](https://simple-crud-apps.vercel.app)
- **Architecture**: Single Express app serves both API routes and static frontend assets
- **Features**: Real-time CRUD operations, responsive design, modal dialogs, notifications, basic client/server validation

## 💡 Inspiration

This project was inspired by the YouTube tutorial: [Build Node.js API from Scratch](https://youtu.be/_7UQPve99r4?si=KfoqN55VkY3Kg59l)

## 🏃‍♂️ Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/) for cloning

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/simple-crud-apps.git
cd simple-crud-apps
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
Create a `.env` file in the root directory:
```env
SCA_DB_NAME=your_mongodb_username
SCA_DB_PASSWORD=your_mongodb_password
```

4. **Start Development Server**
```bash
# Development mode with nodemon (auto-reload)
npm run dev

# Production mode
npm run serve
```

5. **Verify Installation**
- Server runs on: `http://localhost:3000`
- Web interface: `http://localhost:3000` (opens the frontend application)
- API endpoint: `GET http://localhost:3000/api/products`
- Test the full application by adding, updating, and deleting products through the web interface

### Project Structure
```
├── controllers/
│   └── product.controller.js    # Business logic for CRUD operations
├── models/
│   └── product.models.js        # Mongoose schema definition
├── routes/
│   └── product.route.js         # API route definitions
├── public/
│   ├── index.html               # Frontend entry (vanilla JS)
│   ├── css/
│   │   └── styles.css           # UI styles
│   └── js/
│       └── app.js               # Frontend logic (Fetch API CRUD + modals)
├── index.js                     # Application entry point
├── package.json                 # Dependencies and scripts
├── vercel.json                  # Vercel deployment configuration
└── README.md
```

## 🧩 Architecture (Current)

### Request Flow (Local + Production)
- **Single runtime**: One Express app (`index.js`) handles both the REST API and the static frontend.
- **API first**: `/api/products` is mounted before static middleware.
- **Static frontend**: `express.static('public')` serves `/index.html`, `/css/styles.css`, and `/js/app.js`.
- **SPA-style fallback**: `GET /` returns `public/index.html` (non-API routes are intended to be handled by the static middleware / fallback).
- **Frontend ↔ API**: The browser calls relative URLs like `fetch('/api/products')`, so it works on both `localhost` and Vercel without changing base URLs.

### Backend Layering
- **Routes** (`routes/product.route.js`): Defines REST endpoints for products.
- **Controllers** (`controllers/product.controller.js`): Implements CRUD using Mongoose and returns JSON responses.
  - Products list is sorted by newest first: `sort({ createdAt: -1 })`
  - Basic non-negative validation is enforced for `price` and `quantity` on create/update.
- **Models** (`models/product.models.js`): `Product` schema with `timestamps: true` and field validation (`min: 0` for `price` and `quantity`).

### Deployment on Vercel (Serverless)
- **Entrypoint**: `vercel.json` builds `index.js` with `@vercel/node`.
- **Routing**: All paths are routed to `index.js`, so Express serves both:
  - **API** under `/api/products`
  - **Frontend assets** under `/public/*` (via Express static middleware)
- **Local vs production**: In non-production, the app listens on port `3000`; in production it only exports the Express app for Vercel.

## 🏗️ CRUD Application Structure

### API Endpoints

The application provides a complete REST API for product management:

| Method | Endpoint | Description | Body Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/products` | Get all products | No |
| `GET` | `/api/products/:id` | Get single product | No |
| `POST` | `/api/products` | Create new product | Yes |
| `PUT` | `/api/products/:id` | Update existing product | Yes |
| `DELETE` | `/api/products/:id` | Delete product | No |

### Request/Response Examples

#### Create Product (POST)
```json
// Request Body
{
  "name": "Laptop",
  "quantity": 10,
  "price": 15000000
}

// Response
{
  "_id": "60d5ecb74e33a81234567890",
  "name": "Laptop",
  "quantity": 10,
  "price": 15000000,
  "createdAt": "2023-06-25T10:30:00.000Z",
  "updatedAt": "2023-06-25T10:30:00.000Z",
  "__v": 0
}
```

#### Update Product (PUT)
```json
// Request Body
{
  "name": "Gaming Laptop",
  "price": 18000000
}

// Response - Updated product with new values
```

#### Delete Product (DELETE)
```json
// Response
{
  "message": "Product deleted successfully"
}
```

## 🗄️ MongoDB Integration

### Database Configuration
- **Provider**: MongoDB Atlas (Cloud)
- **Connection**: Mongoose ODM
- **Environment Variables**: 
  - `SCA_DB_NAME`: Database username
  - `SCA_DB_PASSWORD`: Database password

### Product Schema
```javascript
{
  name: {
    type: String,
    required: [true, "Please enter product name"]
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Quantity cannot be negative"]
  },
  price: {
    type: Number,
    required: true,
    default: 0,
    min: [0, "Price cannot be negative"]
  },
  Image: {
    type: String,
    required: false
  }
}
```

### Features
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields
- **Validation**: Required field validation with custom messages
- **MongoDB ObjectId**: Automatic ID generation and validation

## 🎨 Frontend Features

### User Interface
- **Modern Design**: Clean, responsive interface with gradient backgrounds
- **Real-time Updates**: Live product list updates after CRUD operations
- **Modal Dialogs**: Smooth update and delete confirmation modals
- **Notifications**: Toast notifications for user feedback
- **Responsive Layout**: Mobile-first design that works on all devices

### User Experience
- **Form Validation**: Client-side validation with user-friendly error messages
- **Loading States**: Visual feedback during API operations
- **Empty States**: Helpful messages when no products exist
- **Keyboard Navigation**: Full keyboard accessibility support
- **Error Handling**: Graceful error handling with user-friendly messages

### Interactive Elements
- **Add Products**: Intuitive form with real-time validation
- **Update Products**: Pre-filled modal with current values
- **Delete Products**: Confirmation dialog to prevent accidental deletion
- **Product Display**: Organized table view with all product details

## 🌐 Deployment on Vercel

### Live Application
- **URL**: [https://simple-crud-apps.vercel.app](https://simple-crud-apps.vercel.app)
- **Status**: Production ready
- **Environment**: Node.js runtime on Vercel

### Deployment Features
- **Automatic Deployment**: Triggered by GitHub pushes
- **Environment Variables**: Securely stored MongoDB credentials
- **Serverless**: Express runs as a Vercel Serverless Function (`@vercel/node`)
- **Global CDN**: Fast worldwide access
- **Static File Serving**: Frontend files are served by Express from the `/public` directory
- **Mixed Content**: Both API and UI are served from the same domain/runtime

## 🌐 Frontend Application

### Web Interface Features
- **Live Demo**: Visit [https://simple-crud-apps.vercel.app](https://simple-crud-apps.vercel.app) to see the application in action
- **Product Management**: Complete CRUD operations through an intuitive web interface
- **Real-time Updates**: Changes are immediately reflected in the product list
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations and transitions

### Key Frontend Components
- **Product Form**: Add new products with validation
- **Product List**: View all products in an organized table format
- **Update Modal**: Edit existing products with pre-filled forms
- **Delete Confirmation**: Safe deletion with confirmation dialogs
- **Notifications**: Real-time feedback for all operations

## 🧪 API Testing

For comprehensive API testing and automation, check out the dedicated testing repository:

- **GitHub Repository**: [https://github.com/fahmi-wiradika/newman-automation](https://github.com/fahmi-wiradika/newman-automation)
- **Live Test Results**: [https://fahmi-wiradika.github.io/newman-automation](https://fahmi-wiradika.github.io/newman-automation)

The testing repository includes:
- Automated Newman/Postman test collections
- CI/CD pipeline with GitHub Actions
- Performance reporting and monitoring
- Both local and production environment testing

## 🛠️ Development Scripts

```json
{
  "scripts": {
    "dev": "nodemon index.js",      // Development with auto-reload
    "serve": "node index.js",       // Production server
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## 🧰 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration
- **Middleware**: Express JSON parsing, static file serving

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS3 with responsive design
- **UI Components**: Custom modal dialogs, notifications, forms
- **API Integration**: Fetch API for REST communication
- **Features**: Real-time updates, form validation, responsive layout

### Deployment
- **Platform**: Vercel (Serverless)
- **Database**: MongoDB Atlas (Cloud)
- **Domain**: Custom Vercel domain
- **Static Files**: Served from `/public` directory

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB Atlas credentials
   - Check IP whitelist in MongoDB Atlas
   - Ensure environment variables are set correctly

2. **Local Server Won't Start**
   - Check if port 3000 is available
   - Verify Node.js installation
   - Install dependencies with `npm install`

3. **Environment Variables Not Loading**
   - Create `.env` file in root directory
   - Check `.env` file syntax
   - Restart server after adding variables

## 📊 API Usage Examples

### Using cURL

```bash
# Get all products
curl -X GET https://simple-crud-apps.vercel.app/api/products

# Create a product  
curl -X POST https://simple-crud-apps.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Smartphone","quantity":5,"price":8000000}'

# Get single product
curl -X GET https://simple-crud-apps.vercel.app/api/products/{product_id}

# Update product
curl -X PUT https://simple-crud-apps.vercel.app/api/products/{product_id} \
  -H "Content-Type: application/json" \
  -d '{"name":"iPhone","price":12000000}'

# Delete product
curl -X DELETE https://simple-crud-apps.vercel.app/api/products/{product_id}
```

### Using JavaScript (Fetch API)

```javascript
// Get all products
const response = await fetch('https://simple-crud-apps.vercel.app/api/products');
const products = await response.json();

// Create new product
const newProduct = await fetch('https://simple-crud-apps.vercel.app/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Tablet',
    quantity: 3,
    price: 5000000
  })
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Quick Links

- **Live API**: [https://simple-crud-apps.vercel.app](https://simple-crud-apps.vercel.app)
- **API Testing Repository**: [https://github.com/fahmi-wiradika/newman-automation](https://github.com/fahmi-wiradika/newman-automation)
- **Live Test Results**: [https://fahmi-wiradika.github.io/newman-automation](https://fahmi-wiradika.github.io/newman-automation)
- **YouTube Tutorial**: [Build Node.js API from Scratch](https://youtu.be/_7UQPve99r4?si=KfoqN55VkY3Kg59l)
- **MongoDB Atlas**: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Vercel**: [https://vercel.com](https://vercel.com)

---

**Happy Coding! 🚀**