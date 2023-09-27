CREATE TABLE post(
id SERIAL PRIMARY KEY, 
business_id INT REFERENCES business(id) ON DELETE CASCADE, 
images TEXT[], 
video VARCHAR(200), 
content text, 
status VARCHAR(100), 
type VARCHAR(100), 
dates TIMESTAMP[],
italic BOOLEAN,
bold BOOLEAN,
websites JSONB,
integrations TEXT[],
created_at TIMESTAMP,
updated_at TIMESTAMP,
expire_at TIMESTAMP
);