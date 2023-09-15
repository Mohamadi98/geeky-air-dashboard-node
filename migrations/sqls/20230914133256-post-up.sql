CREATE TABLE post(
id SERIAL PRIMARY KEY, 
business_id INT REFERENCES business(id) ON DELETE CASCADE, 
images TEXT[], 
video VARCHAR(200), 
text VARCHAR(700), 
scheduled_at TIMESTAMP, 
active BOOLEAN, 
type VARCHAR(100), 
websites JSONB,
created_at TIMESTAMP,
updated_at TIMESTAMP,
expire_at TIMESTAMP
);