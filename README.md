# Book Library

This is an app designed to perform CRUD requests on a locally-hosted PostgreSQL database. 

The dependencies for this project are node, Sequelize, postgres, express, supertest, mocha, chai and docker.

## Installation

Pull and run a docker image of PostgreSQL:

`docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres`

Navigate to the desired directory in your terminal and clone the project to your machine:

`git clone https://github.com/JordsCodes/book-library`

Navigate to the root directory of the project in your terminal and initialise node:

`npm install`

The user will also need to set their environment variables. See the attached `.env.example` for an example. The environment variable file should be named `.env`. 

If the user would like to access the testing suite, they should create an additional `.env.test` file, ensuring that the database names in both of these files are different.

Now that the project is running, we can make CRUD requests to the routes specified in the routes files for genres, authors, readers and books.

## Usage

Navigate to the root directory of the project in your terminal and run:

`npm start`

To view the tables, I recommend using pgAdmin4.

To make requests, I recommend using Postman.

If desired, the user can also access the testing suite by running:

`npm test`

The database is relational. It accounts for books, genres, authors and readers tables. Books can reference genres, authors and readers tables by reference to the latters primary keys. Authors, genres and readers can reference books by reference to the Book's foreign keys.

The user should first add genres, authors and readers to their database. Books may only contain one genre, author and reader. Genres, authors and readers can however contain many books. 

### Create Requests

To add a genre, author or reader to the database, make a POST request to:

`http://localhost:3000/{genre, author or reader here}`

Request body:

`{
    "{genre, author or reader here}": "{genre, author or reader here}"
}`


To add a book to the database, make a POST request to: 

`http://localhost:3000/books`


Request body:

`{
    "title": "Charlie and the Chocolate Factory",
    "ISBN": "12345678910,
    "GenreId: "1",
    "AuthorId: "1",
    "ReaderId: "1",
}`

Note that the GenreId, AuthorId, and ReaderId properties of Books can be left null and updated via patch request later.

### Read Requests

To read all of a given table from the database, make a GET request to:

`http://localhost:3000/{books, authors, readers or genres here}`

To read a specific artist or album from the database, append the above route with the desired id:

`http://localhost:3000/{books, authors, readers or genres here}/{id}`

### Update Requests

To update an album or an artist, make an PATCH request to the desired id:

`http://localhost:3000/{books, authors, readers or genres here}/{id}`


`{
    "GenreId": "3"
}`

Please note that no entry's "id" property can be patched, due to it's functionality as a primary key. 


### Delete Requests

To delete an entry, make a DELETE request to the desired id:

`http://localhost:3000/{books, authors, readers or genres here}/{id}`

### Notes

At present, the testing suite does not account for the possibility of genres, authors and readers returning several books. This is a bug connected to the async nature of the testing suite - sometimes values are returned in the "incorrect" order. This functionality has been tested and confirmed as functioning in Postman however.

## Credits

Command Shift:

https://github.com/CommandShiftHQ

Jordan Noble:

https://twitter.com/JordsCodes

https://www.linkedin.com/in/jordan-noble-a9b931267/




