-- MONDAY - WEEK 8 PM 
-- SQL COMMANDS

USE bgqyutsebfwmifqoey0b; -- OR DOUBLE CLICK DATABASE NAME IA SCHEMA TAB

CREATE TABLE books  ( 
	title VARCHAR(255) NOT NULL UNIQUE, 
	author VARCHAR(255) NOT NULL,
	publisher  VARCHAR(255) DEFAULT "Not Known",
	price INT,
    genre VARCHAR(255) DEFAULT "Not Specified",
    in_stock boolean NOT NULL -- booleans in SQL are represented as 0 and 1     
    -- 1 = true
	-- 0 = false
); 

 SHOW TABLES; -- show all table names in our database                                                                        
SELECT * FROM books;
 
-- CREATE Operation 
-- show demo without adding colmum names 
INSERT INTO books VALUES ("Lord of The Rings", "J.R.R Tolkien", 6, "Fantsy", true); 

-- correct way
INSERT INTO books (title, author, price, genre, in_stock)  VALUES ("Lord of The Rings", "J.R.R Tolkien", 6, "Fantsy", true); 
INSERT INTO books VALUES ("The Shinning", "Stephen King", "Random House", 5, "Horror", false); 
INSERT INTO books  VALUES ("Wuthering Heights", "Emily Bronte", "Penguin", 5, "Romance", true);  
INSERT INTO books (title, author, publisher, price, in_stock) VALUES ("Emma", "Jane Austin", "Harper Collins", 16, false); 

-- Send for leaners to copy in
INSERT INTO books (title, author, publisher, price, in_stock)  VALUES ("Pride and Prejudice", "Jane Austin", "Penguin", 6, true); 
INSERT INTO books (title, author, price, in_stock)  VALUES ("Dubliners", "James Joyce", 10, false); 
INSERT INTO books (title, author, price, in_stock)  VALUES ("Ulysses", "James Joyce", 10, false); 
INSERT INTO books (title, author,  publisher, price, in_stock)  VALUES ("War and Peace", "Leo Tolstoy", "Penguin", 18, true);
INSERT INTO books VALUES ("THe Hobbit", "J.R.R Tolkien", "Harper Colins", 6, "Fantsy", true); 
INSERT INTO books VALUES ("1984", "George Orwell", "Penguin", 5, "Dystopian", false);
INSERT INTO books (title, author, price, genre, in_stock) VALUES ("Animal Farm", "George Orwell", 9, "Dystopian", true);
INSERT INTO books (title, author, publisher, price, in_stock)  VALUES ("It", "Stephen King", "Random House", 14, true); 
INSERT INTO books (title, author, publisher, price, in_stock)  VALUES ("Sense and Sensibility ", "Jane Austin", "Penguin", 6, true); 


-- UPDATE 
UPDATE books SET author = "New Author" WHERE title = "Emma"; 

-- DELETE
DELETE FROM books  WHERE title = "Wuthering Heights"; 

-- Filterd Read
SELECT * FROM books WHERE author = 'Jane Austin';

SELECT author FROM books;

-- ALter Tabel
ALTER TABLE books ADD id INT UNIQUE PRIMARY KEY AUTO_INCREMENT; 

SELECT * FROM books;

INSERT INTO books  VALUES ("New book", "New Author","New Publisher");  

-- Aggregate functions
-- COUNT
SELECT COUNT(title)
FROM books
WHERE author = "Jane Austin";

SELECT COUNT(*)FROM books;

SELECT COUNT(*) AS total_books_by_author FROM books WHERE author = 'Jane Austin';   
-- AVG 
SELECT AVG(price)
FROM books;

-- SUM
SELECT SUM(price)
FROM books;

-- MIN
SELECT MIN(price) AS SmallestPrice
FROM books;

-- MAX
SELECT MAX(price) AS LargestPrice
FROM books;

-- Questions
-- Update the publisher of Sense and Sensibility to Random House 
UPDATE books SET publisher = "Random House" WHERE title = "Sense and Sensibility"; 

-- Find the average price of a Jane Austin book
SELECT AVG(price)
FROM books
WHERE author = 'Jane Austin';
-- 9.3333

-- Find the total price of all the George Orwell books that are in stock 
SELECT SUM(price)
FROM books
WHERE author = 'George Orwell' AND in_stock = true;
-- 21

-- How many books are in stock and how many are out of stock (2 statments for this)
SELECT COUNT(*) AS total_books_in_stock FROM books WHERE in_stock = true;   
-- 9
SELECT COUNT(*) AS total_books_in_stock FROM books WHERE in_stock = false;
-- 5

-- How many books don't have a publisher known 
SELECT COUNT(*) AS unkown_publisher FROM books WHERE publisher = 'Not Known';
-- 5 

-- what is the highest priced book thats in stock
SELECT MAX(price) AS LargestPrice FROM books WHERE in_stock = true;
-- 18


-- Stretch goals 
-- find all the authors names that start with a J 
SELECT author FROM books WHERE author LIKE "J%";

SELECT distinct author from books WHERE author LIKE "J%";

SELECT COUNT(author) AS first_letter_j FROM books WHERE author LIKE "J%";













 




