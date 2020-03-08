Class: CECS 343 Sec 03
Project: VCS Project 1 — Create Repository
Team: Bofa
	Members: Tanner Lowthorp   018099378
		 Edmund Zhou       014164733
		 Saurav Chhapawala 
		 Parth Chhasatiya  015668105

Intro: Create a repository for the given project source tree (including a “snapshot” of “all” its files) within the project. 

Contents: 

External Requirements: 
- Node v12.14.1+ https://nodejs.org/en/download/
- Node Package Manager 6.13.1+ https://nodejs.org/en/download/
-Once Node Packager Manager is installed:
	- Node fs module
		install using this command in the project directory: npm install fs --save
	- Node express module
		install using this command in the project directory: npm install express --save 

Setup and Installation: After installing Node, extract the project files. Traverse to
that directory in the terminal/command prompt and run the command

node app.js

Then open a browser and go to the address

localhost:3000

type this command into the text bar

create-repo <target repo filepath> <source project filepath>

Ex. create-repo create-repo C:/Users/Tanner/Desktop/tmp C:/Users/Tanner/Desktop/tester

NOTE: use forward slashes(/) in filepath names

Sample Invocation & Results:


Features:
- Can create a repo with a snapshot of all files from a selected project tree
  using the "create-repo" command

Bugs:
- Trying to create a repo of a file tree containing files/folders which the
  user does not have permissions to copy/move will result in an error.