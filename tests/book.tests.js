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
    });
  });
});
