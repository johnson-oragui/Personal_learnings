-- CREATE A USER
CREATE USER 'my_user'@'localhost' IDENTIFIED BY 'my_user';
-- create database
CREATE DATABASE IF NOT EXISTS `all_users`;
-- give permissions on new user
GRANT SELECT, INSERT, DELETE, UPDATE ON `all_users` TO 'my_user'@'localhost';
-- save changes
FLUSH PRIVILEGES;
