CREATE TABLE business( 
id SERIAL PRIMARY KEY, 
name VARCHAR(50), 
email VARCHAR(50) UNIQUE,
phone_no VARCHAR(20) UNIQUE, 
category VARCHAR(30), 
state VARCHAR(20), 
website VARCHAR(100), 
street VARCHAR(20), 
city_zip VARCHAR(20), 
city1 VARCHAR(20), 
city2 VARCHAR(20), 
tags TEXT[], 
logo VARCHAR(100),
likes INTEGER,
created_at DATE,
updated_at DATE,
expire_at DATE
);