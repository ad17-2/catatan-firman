-- Adds persisted transcript text and timestamped Whisper segments.
-- Safe to rerun: each ALTER TABLE executes only when the column is missing.

SET @schema_name = DATABASE();

SET @transcript_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'sermons'
    AND COLUMN_NAME = 'transcript'
);

SET @add_transcript_sql = IF(
  @transcript_column_exists = 0,
  'ALTER TABLE `sermons` ADD COLUMN `transcript` LONGTEXT NULL AFTER `youtube_url`',
  'SELECT ''Column transcript already exists'' AS message'
);

PREPARE add_transcript_stmt FROM @add_transcript_sql;
EXECUTE add_transcript_stmt;
DEALLOCATE PREPARE add_transcript_stmt;

SET @transcript_segments_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'sermons'
    AND COLUMN_NAME = 'transcript_segments'
);

SET @add_transcript_segments_sql = IF(
  @transcript_segments_column_exists = 0,
  'ALTER TABLE `sermons` ADD COLUMN `transcript_segments` JSON NULL AFTER `transcript`',
  'SELECT ''Column transcript_segments already exists'' AS message'
);

PREPARE add_transcript_segments_stmt FROM @add_transcript_segments_sql;
EXECUTE add_transcript_segments_stmt;
DEALLOCATE PREPARE add_transcript_segments_stmt;
