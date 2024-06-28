--Correr en la consola, en psql
createdb 'smart-brain'

-- 
CREATE TABLE users (
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  entries bigint DEFAULT 0,
  joined TIMESTAMP NOT NULL
);

-- 
CREATE TABLE login (
  id serial PRIMARY KEY,
  hash VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

---
--realizar insterts de prueba a travez de la aplicación