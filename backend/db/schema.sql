-- USERS TABLE (Login & Register)

CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'learner');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'learner',
    points INT DEFAULT 0,
    badge VARCHAR(50) DEFAULT 'Newbie',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
