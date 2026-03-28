CREATE DATABASE IF NOT EXISTS Player2_Parlor
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE Player2_Parlor;

CREATE TABLE IF NOT EXISTS users (
  user_id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platforms (
  platform_id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  manufacturer VARCHAR(100),
  release_year SMALLINT
);

CREATE TABLE IF NOT EXISTS genres (
  genre_id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS games (
  game_id CHAR(36) PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  short_description VARCHAR(255),
  description TEXT NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK (price >= 0),
  cover_image_url VARCHAR(500),
  release_year SMALLINT NOT NULL,
  platform_id CHAR(36) NOT NULL,
  average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  review_count INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  trending BOOLEAN NOT NULL DEFAULT FALSE,
  best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_release BOOLEAN NOT NULL DEFAULT FALSE,
  developer VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_games_platform
    FOREIGN KEY (platform_id) REFERENCES platforms(platform_id)
);

CREATE TABLE IF NOT EXISTS game_genres (
  game_id CHAR(36) NOT NULL,
  genre_id CHAR(36) NOT NULL,
  PRIMARY KEY (game_id, genre_id),
  CONSTRAINT fk_game_genres_game
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
  CONSTRAINT fk_game_genres_genre
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
  review_id CHAR(36) PRIMARY KEY,
  game_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  body TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_reviews_user_game (user_id, game_id),
  CONSTRAINT fk_reviews_game
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  order_id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_name VARCHAR(200) NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  game_id CHAR(36) NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 1),
  unit_price DECIMAL(8,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_game
    FOREIGN KEY (game_id) REFERENCES games(game_id)
);