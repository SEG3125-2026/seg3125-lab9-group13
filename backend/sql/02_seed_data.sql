USE player2_parlor;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE game_genres;
TRUNCATE TABLE reviews;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE games;
TRUNCATE TABLE genres;
TRUNCATE TABLE platforms;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO platforms (platform_id, name, manufacturer, release_year) VALUES
('11111111-1111-1111-1111-111111111111', 'SNES', 'Nintendo', 1990),
('22222222-2222-2222-2222-222222222222', 'GBA', 'Nintendo', 2001),
('33333333-3333-3333-3333-333333333333', 'N64', 'Nintendo', 1996),
('44444444-4444-4444-4444-444444444444', 'SEGA Saturn', 'SEGA', 1994),
('55555555-5555-5555-5555-555555555555', 'PS1', 'Sony', 1994),
('66666666-6666-6666-6666-666666666666', 'SEGA Dreamcast', 'SEGA', 1998),
('77777777-7777-7777-7777-777777777777', 'PC', 'Various', NULL),
('88888888-8888-8888-8888-888888888888', 'SEGA Master System', 'SEGA', 1985);

INSERT INTO genres (genre_id, name) VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'JRPG'),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Racing'),
('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Adventure'),
('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Sports'),
('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Shooter'),
('aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'Fighting'),
('aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaa7', 'Action');

INSERT INTO games (
  game_id,
  slug,
  title,
  short_description,
  description,
  price,
  cover_image_url,
  release_year,
  platform_id,
  average_rating,
  review_count,
  stock,
  featured,
  trending,
  best_seller,
  is_new_release,
  developer
) VALUES
('10000000-0000-0000-0000-000000000001', 'chrono-trigger', 'Chrono Trigger', 'A timeless classic for JRPG fans.', 'Chrono Trigger is a SNES JRPG Classic, with a deep story and characters designed and written by Akira Toriyama.', 2197.04, '/images/games/chrono-trigger/cover.jpg', 1995, '11111111-1111-1111-1111-111111111111', 5.0, 0, 10, TRUE, TRUE, TRUE, FALSE, 'Squaresoft'),
('10000000-0000-0000-0000-000000000002', 'super-mario-kart', 'Super Mario Kart', 'Retro cart racing with tight controls, frantic items and bright pixel art tracks.', 'Super Mario Kart delivers the original arcade-style racing, colorful circuits, and local multiplayer experience for players who love this series.', 64.95, '/images/games/super-mario-kart/cover.jpg', 1992, '11111111-1111-1111-1111-111111111111', 4.8, 0, 10, FALSE, TRUE, FALSE, FALSE, 'Nintendo'),
('10000000-0000-0000-0000-000000000003', 'pokemon-mystery-dungeon-gba', 'Pokemon Mystery Dungeon: GBA', 'Explore dangerous dungeons with your Pokemon friends and defeat foes.', 'Pokemon Mystery Dungeon: Red Rescue Team combines dungeon exploration, enemy encounters, and treasure hunting inspired by the Mystery Dungeon series.', 106.40, '/images/games/pokemon-mystery-dungeon-gba/cover.jpg', 2005, '22222222-2222-2222-2222-222222222222', 4.6, 0, 10, FALSE, TRUE, FALSE, FALSE, 'Spike Chunsoft'),
('10000000-0000-0000-0000-000000000004', 'mario-tennis', 'Mario Tennis', 'Fast arcade tennis with exaggerated power shots.', 'Mario Tennis offers quick matches, responsive controls, and energetic courts that make every rally feel exciting.', 59.99, '/images/games/mario-tennis/cover.jpg', 2000, '33333333-3333-3333-3333-333333333333', 4.7, 0, 10, FALSE, FALSE, TRUE, FALSE, 'Nintendo'),
('10000000-0000-0000-0000-000000000005', 'star-fox', 'Star Fox', 'Space combat, boss battles, and ship-flying action.', 'Star Fox is a late SNES-era rail shooter that mixes ship flying gameplay with impressive visuals and memorable boss encounters.', 49.99, '/images/games/star-fox/cover.jpg', 1993, '11111111-1111-1111-1111-111111111111', 4.6, 0, 10, FALSE, FALSE, TRUE, FALSE, 'Nintendo'),
('10000000-0000-0000-0000-000000000006', 'panzer-dragoon', 'Panzer Dragoon', 'Battle through airborne levels packed with enemies.', 'Panzer Dragoon is an action-heavy rail shooter focused on reflexes, pattern recognition, and fast replayable stages.', 75.51, '/images/games/panzer-dragoon/cover.jpg', 1995, '44444444-4444-4444-4444-444444444444', 4.3, 0, 10, FALSE, FALSE, FALSE, TRUE, 'SEGA'),
('10000000-0000-0000-0000-000000000007', 'mortal-kombat', 'Mortal Kombat', 'A competitive fighter with memorable characters.', 'Mortal Kombat brings classic versus action, unique move sets, and couch competition energy to the SNES.', 14.99, '/images/games/mortal-kombat/cover.jpg', 1993, '11111111-1111-1111-1111-111111111111', 3.9, 0, 10, FALSE, FALSE, FALSE, TRUE, 'Midway'),
('10000000-0000-0000-0000-000000000008', 'final-fantasy-7', 'Final Fantasy 7', 'A fantasy journey through midgar.', 'Final Fantasy focuses on a deep narrative with classic JRPG combat making it ideal for players who love immersive adventures.', 34.99, '/images/games/final-fantasy-7/cover.jpg', 1997, '55555555-5555-5555-5555-555555555555', 5.0, 0, 10, FALSE, FALSE, FALSE, TRUE, 'Squaresoft'),
('10000000-0000-0000-0000-000000000009', 'nba-2k1', 'NBA 2K1', 'Quick basketball matches with advanced graphics.', 'NBA 2K1 is easy to pick up and fun to replay, with short matches and realistic presentation.', 32.27, '/images/games/nba-2k1/cover.jpg', 2000, '66666666-6666-6666-6666-666666666666', 4.4, 0, 10, FALSE, FALSE, FALSE, FALSE, 'Visual Concepts'),
('10000000-0000-0000-0000-000000000010', 'crash-team-racing', 'Crash Team Racing', '3D Kart racing with a classic feel.', 'Crash Team Racing mixes speed, sharp turns, and aggressive opponents into a lively retro racing package.', 14.46, '/images/games/crash-team-racing/cover.jpg', 1999, '55555555-5555-5555-5555-555555555555', 4.2, 0, 10, FALSE, FALSE, FALSE, FALSE, 'Naughty Dog'),
('10000000-0000-0000-0000-000000000011', 'doom', 'DOOM', 'Fight through hell to kill armies of demons.', 'DOOM is a first of its kind, fight through the armies of hell as Doomguy in this classic shooter', 219.66, '/images/games/doom/cover.jpg', 1993, '77777777-7777-7777-7777-777777777777', 4.8, 0, 10, FALSE, FALSE, FALSE, FALSE, 'id Software'),
('10000000-0000-0000-0000-000000000012', 'ninja-gaiden', 'Ninja Gaiden', 'Fast action and precise platforming across japan.', 'Ninja Gaiden combines sharp movement, vast levels, and arcade difficulty into a polished retro action title.', 24.99, '/images/games/ninja-gaiden/cover.jpg', 1992, '88888888-8888-8888-8888-888888888888', 4.6, 0, 10, TRUE, TRUE, FALSE, FALSE, 'SIMS');

INSERT INTO game_genres (game_id, genre_id) VALUES
('10000000-0000-0000-0000-000000000001', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1'),
('10000000-0000-0000-0000-000000000002', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2'),
('10000000-0000-0000-0000-000000000003', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3'),
('10000000-0000-0000-0000-000000000004', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4'),
('10000000-0000-0000-0000-000000000005', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5'),
('10000000-0000-0000-0000-000000000006', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5'),
('10000000-0000-0000-0000-000000000007', 'aaaaaaa6-aaaa-aaaa-aaaa-aaaaaaaaaaa6'),
('10000000-0000-0000-0000-000000000008', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1'),
('10000000-0000-0000-0000-000000000009', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaa4'),
('10000000-0000-0000-0000-000000000010', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2'),
('10000000-0000-0000-0000-000000000011', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaa5'),
('10000000-0000-0000-0000-000000000012', 'aaaaaaa7-aaaa-aaaa-aaaa-aaaaaaaaaaa7');