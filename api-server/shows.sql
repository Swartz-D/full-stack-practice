
DROP TABLE IF EXISTS streaming_service CASCADE;
DROP TABLE IF EXISTS movies CASCADE;

CREATE TABLE streaming_service (
  id SERIAL PRIMARY KEY,
  name text,
  base_price REAL
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title varchar(50) NOT NULL,
  streamer_id INT,
  CONSTRAINT fk_streamer
  FOREIGN KEY (streamer_id) REFERENCES streaming_service(id)
  ON DELETE CASCADE
);



INSERT INTO streaming_service (name, base_price) 
VALUES ('Netflix', 6.99),('Disney+', 7.99),('HBOmax', 9.99),
('Hulu', 7.99),('Prime Video', 8.99),('Apple TV Plus', 6.99),
('Peacock', 4.99);

INSERT INTO movies (title, streamer_id) 
VALUES ('The Bad Guys', 1), ('All Quiet on the Western Front', 1),
('The Gray Man', 1), ('Father Stu', 1), ('Uncharted', 1), 
('No Exit', 4), ('RUN', 4), ('The Princess', 4), 
('Aftershock', 4), ('The Binge', 4), ('Tales of the Jedi', 2),
('Hocus Pocus 2', 2), ('Without Remorse', 5), ('Black as Night', 5), 
('Black Box', 5), ('RadioActive', 5);

