# Drug-Management-System
ParaEase'O is a drug management system. It was made as a second-year university project. ***It is not being used commercially and was made as a student project only.***

## Status
It is not being maintained anymore as project development period has ended.

## Features
 - Users can register an account to the website's database.
 - Users can log into their account.
 - Users can add new drugs into the database.
 - Users can view information about drugs that are already in the database.
 - Users can edit existing drug information.
 - Users can delete one or multiple drug entries in the database.
 - Users can type into the search bar to filter drug entries.
 - Users can see generated reports about the drugs in the database such as reports about drugs that are expiring, drugs that are running out, and other useful reports.
 - Users can print the generated reports.
 - Application data-passing is handled using AJAX requests.

## Dependencies
- [XAMPP](https://www.apachefriends.org/download.html) is needed to make this site work. 

## Installation
1. Download the repository files or clone the repository. Place the repository files inside the configured document root of your XAMPP installation. If you have not changed your document root, the default path will be inside the `htdocs` folder of your XAMPP installation folder.
2. Navigate to the location of your php configuration file and open it. It is located in `{XAMPP installation folder}\php\php.ini`
3. Scroll down until you see `;extension=php_pdo_odbc.dll`. Remove the semicolon at the beginning of the line. Save the file.
4. Open the XAMPP control panel and start the Apache server.
5. You are now ready. Open the `index.html` file of the project in your browser by typing `localhost/{relative path to the index.html file}`.
