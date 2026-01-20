-- Create tarot_cards table
CREATE TABLE IF NOT EXISTS tarot_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    number INT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    alternative_names TEXT,
    arcana VARCHAR(50) NOT NULL,
    element VARCHAR(50),
    suit VARCHAR(50),
    meaning_key TEXT,
    meaning_upright TEXT,
    meaning_reversed TEXT,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_arcana (arcana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;