# Player 2: Parlor

Player 2: Parlor is a retro video game storefront built with React and Vite for SEG3125 Lab 8.

The project includes:
- a client-side storefront
- a game catalog with search, filters, and sorting
- a game detail page
- a shopping cart and checkout flow
- an admin analytics dashboard

## Tech Stack

- React
- Vite
- React Router

## Features

- Browse retro games on the homepage
- Search games from the header and catalog page
- Filter by genre, platform, price, year, and rating
- Sort catalog results
- View detailed game pages
- Add games to cart
- Update cart quantity
- Complete a simple checkout flow
- View admin analytics
- Read and submit mock reviews

## Project Structure

```text

src/
├─ App.css
├─ App.jsx
├─ index.css
├─ main.jsx
│
├─ assets/
│  ├─ hero.png
│  ├─ react.svg
│  └─ vite.svg
│
├─ components/
│  ├─ CartItem.jsx
│  ├─ GameCard.jsx
│  ├─ Header.jsx
│  └─ StatsCard.jsx
│
├─ data/
│  └─ games.js
│
├─ layouts/
│  └─ AppLayout.jsx
│
├─ pages/
│  ├─ AdminPage.jsx
│  ├─ CartPage.jsx
│  ├─ CatalogPage.jsx
│  ├─ CheckoutPage.jsx
│  ├─ GameDetailPage.jsx
│  ├─ HomePage.jsx
│  └─ LoginPage.jsx
│
├─ styles/
│
└─ utils/
   ├─ cart.js
   └─ useResponsive.js
```

## How to Run the Project

### 1. Install dependencies

```bash
npm install
```

### 2.Start the development server

```bash
npm run dev
```

