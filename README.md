# VoltCare Billing Application

A professional billing and customer management application built for **VoltCare** — an electrical, plumbing, and hardware solutions company.

## 🚀 Overview

VoltCare Billing is a modern, responsive web application designed to streamline bill generation, product management, and customer relationship management. It replaces traditional paper-based billing with a clean digital workflow.

## ✨ Features

### 📋 Billing System
- **Quick bill generation** — Add products from inventory, generate professional bills instantly
- **Custom items** — Add items not in your inventory directly on the bill with description, quantity, and price
- **Custom notes** — Attach notes, terms, or special instructions to any bill
- **Price toggle** — Choose to show or hide prices on printed bills (useful for quotations vs invoices)
- **Print-ready** — Bills are optimized for printing with a clean layout

### 📦 Product Management
- **Full product catalog** — Browse products by category with search functionality
- **Variant support** — Products like wires support multiple sizes (1mm, 1.5mm, 2.5mm, 4mm, 6mm, 10mm) and colors (Red, Blue, Green, Black, Yellow, White) with individual pricing and stock
- **Image upload** — Upload product images (supports base64, up to 2MB) or use emoji placeholders
- **Stock tracking** — Low stock alerts and inventory management

### 📁 Category Management (Admin)
- **Create categories** — Add new top-level categories (Electric, Plumbing, Hardware, or custom)
- **Create subcategories** — Add subcategories under any category (e.g., Wiring, Switches, Lights under Electric)
- **Delete categories/subcategories** — Clean up unused categories
- **Dynamic icons** — Choose icons for categories (⚡ Electric, 💧 Water, 🔧 Tools, 📦 General)

### 📊 Dashboard
- **Bills history** — View and search all previously generated bills
- **Revenue tracking** — See total revenue and bill count at a glance
- **Contact management** — Store customer and lead details
- **Lead sources** — Track where contacts come from (Google Maps, Referral, Walk-in, WhatsApp, Phone Call)
- **WhatsApp integration** — One-tap WhatsApp messaging to any contact
- **Search & filter** — Quickly find bills or contacts

### 🔐 Admin Panel
- **Password protected** — Secure access with password authentication (default: `voltcare2024`)
- **Product CRUD** — Add, edit, delete products with full details
- **Category CRUD** — Create and manage categories and subcategories
- **Inventory overview** — See all products, stock levels, and low stock alerts

## 🏗️ Technical Architecture

### Tech Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Routing:** React Router DOM v6
- **State Management:** React Context API
- **Fonts:** Space Grotesk (headings) + DM Sans (body)

### Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Input, Dialog, etc.)
│   ├── Header.tsx       # App header with navigation and search
│   ├── CategoryNav.tsx  # Category/subcategory filter bar
│   ├── ProductCard.tsx  # Product card with variant selector
│   └── NavLink.tsx      # Navigation link component
├── context/
│   ├── AdminContext.tsx  # Product, category, and contact state management
│   └── CartContext.tsx   # Cart and billing state management
├── data/
│   ├── types.ts         # TypeScript interfaces (Product, Bill, Contact, etc.)
│   └── products.ts      # Seed data for categories and products
├── pages/
│   ├── Index.tsx        # Main product browsing page
│   ├── CartPage.tsx     # Cart with bill generation form
│   ├── InvoicePage.tsx  # Bill view and print page
│   ├── DashboardPage.tsx # Bills history, contacts, and CRM
│   ├── AdminPage.tsx    # Admin panel for product/category management
│   └── NotFound.tsx     # 404 page
├── index.css            # Design system tokens and global styles
├── App.tsx              # Route configuration
└── main.tsx             # Entry point
```

### Data Models

| Model | Description |
|-------|-------------|
| `Product` | Name, price, category, subcategory, image, variants, stock |
| `ProductVariant` | Size, color, price, stock, SKU for a specific product variant |
| `Bill` | Generated bill with items, custom items, notes, price visibility |
| `CustomBillItem` | Ad-hoc items added during billing (not in inventory) |
| `Category` | Top-level category with icon and subcategories |
| `Contact` | Customer/lead with phone, WhatsApp, source, notes |
| `Customer` | Billing customer with name, phone, address |

### Design System
- **Brand Colors:** VoltCare Red, Gold, Blue
- **Primary:** Green (HSL 145 70% 36%)
- **Accent:** Gold (HSL 42 90% 55%)
- **Semantic tokens** for all colors — fully themeable
- **Responsive breakpoints** — optimized for mobile (320px+), tablet, and desktop

## 📱 Responsive Design

The application is fully responsive:
- **Mobile (320px+):** Compact cards, stacked layouts, touch-friendly buttons
- **Tablet (768px+):** Optimized grid layouts, side-by-side forms
- **Desktop (1024px+):** Full navigation, multi-column grids, spacious layout

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Bun

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd voltcare-billing

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Creating a Bill
1. Browse products on the home page or search by name/brand
2. Add products to cart using the **ADD** button
3. For variant products (wires), select size and color before adding
4. Go to cart and optionally add **custom items** not in inventory
5. Click **Generate Bill** → fill customer details
6. Toggle **show/hide prices** and add a **custom note** if needed
7. Click **Generate Bill** to create and view the bill
8. Use **Print** to print or save as PDF

### Managing Products (Admin)
1. Navigate to **Admin Panel** (⚙️ icon)
2. Login with password: `voltcare2024`
3. Click **Add Product** to add new products with image upload
4. Use the **Categories** tab to create new categories and subcategories
5. Edit or delete existing products from the product table

### Managing Contacts
1. Go to **Dashboard** from the navigation
2. Switch to **Contacts & Leads** tab
3. Add contacts with source tracking (Google Maps, Referral, etc.)
4. Use the WhatsApp button (💬) to message contacts directly

## 🔒 Security Notes

- Admin access is password-protected (change `voltcare2024` in `AdminContext.tsx`)
- All data is stored in-memory (browser session) — refreshing clears data
- For persistent storage, consider connecting a database backend

## 📝 License

This project is proprietary to VoltCare.
