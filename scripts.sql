--Correr en la consola, en psql
createdb 'smart-brain'

-- 
CREATE TABLE user (
  id serial PRIMARY KEY,
  name VARCHAR(100),
  email text UNIQUE NOT NULL,
  entries bigint DEFAULT 0,
  joined TIMESTAMP NOT NULL
);

-- 
CREATE TABLE login (
  id serial PRIMARY KEY,
  hash varchar(100) NOT NULL,
  email text UNIQUE NOT NULL
);

---
--realizar insterts de prueba a travez de la aplicación