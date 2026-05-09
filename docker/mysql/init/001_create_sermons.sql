CREATE TABLE IF NOT EXISTS `sermons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `summary` TEXT NOT NULL,
  `key_points` JSON NOT NULL,
  `bible_verses` JSON NOT NULL,
  `quotes` JSON NOT NULL,
  `action_items` JSON NOT NULL,
  `reflection_questions` JSON NOT NULL,
  `youtube_url` TEXT NULL,
  `transcript` LONGTEXT NULL,
  `transcript_segments` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FULLTEXT INDEX `ft_title_summary` (`title`, `summary`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
