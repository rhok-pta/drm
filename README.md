Installing and Setup
====================

Requirements
------------

* Node.js
* npm (Node Package Manager)
* MongoDB

Installing
----------

Execute ```npm install -d``` in the root directory of the project. This automatically installs all the dependencies.

Seeding
-------

For testing purposes the database can be seeded with values.

To seed the database just run ```node seed.js```.

Bug: The seeding program doesn't finish but you can kill it after it says ```Database seeded```.

Running
-------

Make sure MongoDB is running.

Execute ```node app.js``` to run the application.

For development you can use ```nodemon``` which automatically restarts the server if it detects that a file changed. Install it using ```npm install -g nodemon```.
