-- load data from .txt file
LOAD DATA LOCAL INFILE './pets.txt' INTO TABLE pet;

-- if error local_infile disables

show global variables like 'local_infile';

-- then enable with this-

set global local_infile=true;

-- Then check again and quit from mysql server with this-

exit;
-- Now you have to connect/login server with local_infile. For this run this code from terminal command line-

sudo mysql --local_infile=1 -u root -ppassword DB_name

-- now load the data from local file-

mysql> load data local infile 'path/file_name.extention' into table table_name;
