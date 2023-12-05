-- 1) instert user
INSERT INTO User (name, email, password, user_type) VALUES ('Ron Swan', 'rontheswan@example.com', 'rontheswantheman', 'buyer');

-- 2) insert agent
INSERT INTO Agent (name, contact_number, email) VALUES ('The Rock', '123-456-7890', 'rockthejohn@example.com');

-- 3) insert home
INSERT INTO Home (address, price, square_feet, bedrooms, bathrooms, availability_status, area_id) VALUES ('123 Main St, Merced, CA, 95341', 200000.00, 1500, 3, 2, 'Available', 1);

-- 4) insert area 
INSERT INTO Area (name, zip_code, city, state) VALUES ('North M', '95341', 'Merced', 'CA');

-- 5) insert review
INSERT INTO Review (user_id, rating, comment, home_id) VALUES (1, 5, 'Great Home!', 1);

-- 6) update user
UPDATE User SET name = 'Luis Carrillo' WHERE id = 1;

-- 7) update agent contact 
UPDATE Agent SET contact_number = '987-654-3210' WHERE id = 1;

-- 8) update home price
UPDATE Home SET price = 220000.00 WHERE id = 1;

-- 9) update area name
UPDATE Area SET name = 'Downtown' WHERE id = 1;

-- 10) update review
UPDATE Review SET rating = 2, comment = 'Didnt like it!' WHERE id = 1;

-- 11) delete user
DELETE FROM User WHERE id = 10;

-- 12) delete agent 
DELETE FROM Agent WHERE id = 10;

-- 13) delete home
DELETE FROM Home WHERE id = 10;

-- 14) delete area 
DELETE FROM Area WHERE id = 5;

-- 15) delete review
DELETE FROM Review WHERE id = 10;

-- 16) select all users 
SELECT * FROM User;

-- 17) select homes that are avaible 
SELECT * FROM Home WHERE availability_status = 'Available';

-- 18) select average rating from a home
SELECT home_id, AVG(rating) as avg_rating FROM Review WHERE home_id = 1 GROUP BY home_id;

-- 19) select review where rating is >4
SELECT * FROM Review WHERE rating > 4;

-- 20) list users that left a review
SELECT User.name, Review.comment FROM User JOIN Review ON User.id = Review.user_id;

-- select user names that haved viewed a home 
select user.name from user join user_views_home on user.id = user_views_home.user_id join home on home.id = user_views_home.home_id where home.id = 10;
-- select address of an agent represents
select h.address from agent a join agent_represents_home ar on ar.agent_id = a.id join home h on h.id = ar.home_id where a.id = 3;
-- select the agents thay represrnt a home with rating 3 or more
select a.name from agent a join agent_represents_home ar on ar.agent_id = a.id join home h on h.id = ar.home_id join review r on h.id = r.home_id where r.rating > 3 group by a.name;
LOAD DATA INFILE 'Atwater-Sheet1.csv' INTO TABLE home FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;
