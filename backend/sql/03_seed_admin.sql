USE player2_parlor;

INSERT INTO users (
  user_id,
  email,
  password_hash,
  display_name,
  role
) VALUES (
  '90000000-0000-0000-0000-000000000001',
  'seg3125admin@player2parlor.local',
  '$2y$12$juZJ8lE.gISqSekhk/UUkuE.Y7rX1hk6Rk.GmwrN8m.Kvr7SjPKBe',
  'seg3125admin',
  'admin'
)
ON DUPLICATE KEY UPDATE
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name),
  role = VALUES(role);