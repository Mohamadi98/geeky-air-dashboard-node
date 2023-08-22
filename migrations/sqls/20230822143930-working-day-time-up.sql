CREATE TABLE working_day_time( 
id SERIAL PRIMARY KEY, 
business_id INT REFERENCES business(id), 
day VARCHAR(10) NOT NULL, 
open BOOLEAN,
start_time VARCHAR(20), 
end_time VARCHAR(20), 
open_24h BOOLEAN
);