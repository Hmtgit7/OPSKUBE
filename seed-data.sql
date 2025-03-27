-- Seed data for the Event Management System
-- This script works with both PostgreSQL (used by both backends)

-- Truncate tables (in case they already contain data)
TRUNCATE TABLE rsvps CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE events_id_seq RESTART WITH 1;
ALTER SEQUENCE rsvps_id_seq RESTART WITH 1;

-- Insert Users
-- Note: Passwords are 'password123' hashed with bcrypt (works for both backends)
INSERT INTO users (username, email, password, created_at, updated_at)
VALUES
  ('john_doe', 'john@example.com', '$2a$10$6Yw5OCHKGZHBkYvhwMxN5OPNaEARZ7IGZkNqFN1ttEJibfZHmn.Ci', NOW(), NOW()),
  ('jane_smith', 'jane@example.com', '$2a$10$6Yw5OCHKGZHBkYvhwMxN5OPNaEARZ7IGZkNqFN1ttEJibfZHmn.Ci', NOW(), NOW()),
  ('bob_johnson', 'bob@example.com', '$2a$10$6Yw5OCHKGZHBkYvhwMxN5OPNaEARZ7IGZkNqFN1ttEJibfZHmn.Ci', NOW(), NOW()),
  ('alice_green', 'alice@example.com', '$2a$10$6Yw5OCHKGZHBkYvhwMxN5OPNaEARZ7IGZkNqFN1ttEJibfZHmn.Ci', NOW(), NOW()),
  ('mike_brown', 'mike@example.com', '$2a$10$6Yw5OCHKGZHBkYvhwMxN5OPNaEARZ7IGZkNqFN1ttEJibfZHmn.Ci', NOW(), NOW());

-- Insert Events
INSERT INTO events (name, description, date, location, user_id, created_at, updated_at)
VALUES
  ('Tech Conference 2025', 'Annual technology conference featuring the latest innovations', '2025-06-15 09:00:00', 'San Francisco Convention Center', 1, NOW(), NOW()),
  ('Summer Music Festival', 'Outdoor music festival with top artists', '2025-07-20 17:00:00', 'Central Park', 2, NOW(), NOW()),
  ('Data Science Workshop', 'Hands-on workshop for data analysis and machine learning', '2025-05-10 10:00:00', 'Tech Hub Downtown', 1, NOW(), NOW()),
  ('Charity Run', '5K run to raise funds for local charities', '2025-04-05 08:00:00', 'City Park', 3, NOW(), NOW()),
  ('Art Exhibition', 'Exhibition of contemporary art from local artists', '2025-08-12 18:30:00', 'Metropolitan Art Gallery', 4, NOW(), NOW()),
  ('Business Networking', 'Connect with professionals in your industry', '2025-05-25 19:00:00', 'Grand Hotel Conference Room', 5, NOW(), NOW()),
  ('Yoga Retreat', 'Weekend of yoga and meditation', '2025-09-18 08:00:00', 'Mountain View Resort', 2, NOW(), NOW()),
  ('Book Club Meeting', 'Discussion of this month\'s book selection', '2025-04-30 18:00:00', 'City Library', 4, NOW(), NOW()),
  ('Food Festival', 'Taste dishes from top local restaurants', '2025-10-10 12:00:00', 'Downtown Food Court', 3, NOW(), NOW()),
  ('Career Fair', 'Meet recruiters from top companies', '2025-06-28 10:00:00', 'University Campus', 5, NOW(), NOW());

-- Insert RSVPs
INSERT INTO rsvps (user_id, event_id, status, created_at, updated_at)
VALUES
  (2, 1, 'ATTENDING', NOW(), NOW()),
  (3, 1, 'ATTENDING', NOW(), NOW()),
  (4, 1, 'MAYBE', NOW(), NOW()),
  (5, 1, 'ATTENDING', NOW(), NOW()),
  (1, 2, 'ATTENDING', NOW(), NOW()),
  (3, 2, 'DECLINED', NOW(), NOW()),
  (4, 2, 'ATTENDING', NOW(), NOW()),
  (2, 3, 'ATTENDING', NOW(), NOW()),
  (4, 3, 'ATTENDING', NOW(), NOW()),
  (5, 3, 'MAYBE', NOW(), NOW()),
  (1, 4, 'ATTENDING', NOW(), NOW()),
  (2, 4, 'ATTENDING', NOW(), NOW()),
  (5, 4, 'ATTENDING', NOW(), NOW()),
  (1, 5, 'MAYBE', NOW(), NOW()),
  (2, 5, 'ATTENDING', NOW(), NOW()),
  (3, 5, 'ATTENDING', NOW(), NOW()),
  (1, 6, 'ATTENDING', NOW(), NOW()),
  (2, 6, 'DECLINED', NOW(), NOW()),
  (3, 6, 'MAYBE', NOW(), NOW()),
  (4, 6, 'ATTENDING', NOW(), NOW());