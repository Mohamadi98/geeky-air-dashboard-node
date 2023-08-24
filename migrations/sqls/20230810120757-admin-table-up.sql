CREATE TABLE admin (
  id serial PRIMARY KEY,
  username VARCHAR (255) NOT NULL,
  email VARCHAR (255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  profile_image VARCHAR(700),
  active BOOLEAN NOT NULL DEFAULT true
);