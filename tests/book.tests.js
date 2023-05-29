const { expect } = require('chai');
const request = require('supertest');
const { Book } = require('../src/models/index');
const app = require('../src/app');

describe('/books', () => {
  before(async () => {
    await Book.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Book.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /books', () => {
      it('creates a new book in the database', async () => {
        const response = await request(app).post('/books').send({
          title: 'Ready Player One',
          author: 'Ernest Cline',
          genre: 'Science Fiction',
          ISBN: '9780307887436',
        });
        expect(response.status).to.equal(201);
        expect(response.body.title).to.equal('Ready Player One');

        const newBookRecord = await Book.findByPk(1);

        expect(newBookRecord.author).to.equal('Ernest Cline');
        expect(newBookRecord.genre).to.equal('Science Fiction');
        expect(newBookRecord.ISBN).to.equal('9780307887436');
      });
    });
  });
  describe('with records in the database', () => {
    let books;
    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: 'Red Rising',
          author: 'Pierce Brown',
          genre: 'Science Fiction',
          ISBN: '9781444758979',
        }),
        Book.create({
          title: 'Ready Player One',
          author: 'Ernest Cline',
          genre: 'Science Fiction',
          ISBN: '9780307887436',
        }),
      ]);
    });
    describe('GET /books', () => {
      it('returns all books in the database', async () => {
        const response = await request(app).get('/books');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(2);

        response.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.genre).to.equal(expected.genre);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });
    });
    describe('GET /books/{id}', () => {
      it('gets book record by id', async () => {
        const book = books[0];
        const response = await request(app).get(`/books/${book.id}`);

        expect(response.status).to.equal(200);
        expect(book.title).to.equal('Red Rising');
        expect(book.author).to.equal('Pierce Brown');
        expect(book.genre).to.equal('Science Fiction');
        expect(book.ISBN).to.equal('9781444758979');
      });
      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).get('/books/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
    describe('PUT /books/:id', () => {
      it('replaces the book and returns the updated record', async () => {
        const book = books[0];
        const response = await request(app).put(`/books/${book.id}`).send({
          title: 'new title',
          author: 'new author',
          genre: 'new genre',
          ISBN: 'new isbn',
        });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });
        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal('new title');
        expect(updatedBookRecord.author).to.equal('new author');
        expect(updatedBookRecord.genre).to.equal('new genre');
        expect(updatedBookRecord.ISBN).to.equal('new isbn');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).put(`/books/12345`).send({
          title: 'new title',
          author: 'new author',
          genre: 'new genre',
          ISBN: 'new isbn',
        });
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
    describe('PATCH /books/:id', () => {
      it('updates the book and returns the updated record', async () => {
        const book = books[0];
        const response = await request(app).patch(`/books/${book.id}`).send({
          title: 'new title',
        });
        const updatedBookRecord = await Book.findByPk(book.id, {
          raw: true,
        });

        expect(response.status).to.equal(200);
        expect(updatedBookRecord.title).to.equal('new title');
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).patch(`/books/12345`).send({
          title: 'new title',
          author: 'new author',
          genre: 'new genre',
          ISBN: 'new isbn',
        });
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
    describe('DELETE /books/:id', () => {
      it('deletes book record by id', async () => {
        const book = books[0];
        const response = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it('returns a 404 if the book does not exist', async () => {
        const response = await request(app).delete('/books/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The book could not be found.');
      });
    });
  });
});
