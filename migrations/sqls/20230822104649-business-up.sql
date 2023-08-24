CREATE TABLE business( 
id SERIAL PRIMARY KEY, 
name VARCHAR(50), 
description VARCHAR(150),
email VARCHAR(50) UNIQUE,
phone_number VARCHAR(20) UNIQUE, 
category VARCHAR(30), 
state VARCHAR(20), 
web_site VARCHAR(100), 
street VARCHAR(50), 
city_zip VARCHAR(20), 
city1 VARCHAR(20), 
city2 VARCHAR(20), 
tags TEXT[], 
images TEXT[],
logo VARCHAR(700),
likes INTEGER,
created_at DATE,
updated_at DATE,
expire_at DATE
);