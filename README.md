## Player 2: Parlor

### Project Overview

This web application allows users to browse retro games, register an account, log in, add games to the cart, place orders, and leave reviews.  It also includes an admin dashboard where an administrator can monitor store activity, view users, view order details, and see sales reports.

### Main Features

**Customer Features**

- Browse retro game catalog
- Search, filter, and sort games
- View game details
- Add games to cart
- Register and log in
- Place orders through checkout
- Submit reviews for games
- Switch between **English** and **Simplified Chinese**

**Admin Features**

- Admin-only login and protected admin page
- View all registered users
- Delete customer accounts
- View recent orders and order details
- View admin dashboard reports:
  - Sales Trend
  - Top Selling Games
  - Order Status / Basic Summary

**Bilingual Support**

The website supports:
- English
- Simplified Chinese

Users can switch languages from the header using the language selector.

### Tech Stack

**Frontend**

- React
- Vite
- React Router

**Backend**

- Node.js
- Express

**Database**

- MySQL
- MySQL Workbench

**Other Libraries**

- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- uuid
- nodemon

## Project Structure

```text
project-root/
  backend/
    sql/
    src/
    .env.example
    package.json
  public/
  src/
  .env.example
  package.json
  vite.config.js
```

## How to Run the Project

### Requirements

Make sure you have installed:

- Node.js
- MySQL Server
- MySQL Workbench

After pulling the project, please do these steps:

1. In /backend, create a `.env` file:

  ```bash
  PORT=5000
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=your_mysql_password
  DB_NAME=player2_parlor
  JWT_SECRET=your_secret_string
  ```

2. Make sure **MySQL** is running.

3. In MySQL Workbench, run:
  `backend/sql/01_schema.sql`

  `backend/sql/02_seed_data.sql`

  `backend/sql/03_seed_admin.sql`

4. In /backend, run:
  `npm install`
  `npm run dev`

5. in root run: 

  `npm install`

  `npm run dev`

