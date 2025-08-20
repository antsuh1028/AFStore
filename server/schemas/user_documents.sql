CREATE TABLE IF NOT EXISTS user_documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(64) NOT NULL,
  s3_key TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, document_type, s3_key)
); 