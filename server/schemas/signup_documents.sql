CREATE TABLE IF NOT EXISTS signup_documents (
  id SERIAL PRIMARY KEY,
  signup_request_id INTEGER NOT NULL REFERENCES signup_requests(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries by signup_request_id
CREATE INDEX IF NOT EXISTS idx_signup_documents_signup_request_id 
ON signup_documents(signup_request_id);

-- Create index for faster queries by document_type
CREATE INDEX IF NOT EXISTS idx_signup_documents_type 
ON signup_documents(document_type); 