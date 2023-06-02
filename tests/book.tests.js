const { expect } = require('chai');
const request = require('supertest');
const { Book, Genre, Author, Reader } = require('../src/models/index');
const app = require('../src/app');

describe('/books', () => {
  let books;
  beforeEach(async () => {
    await Book.sequelize.sync({ force: true });
    await Book.destroy({ where: {} });

    const genre1 = await Genre.create({ genre: 'Dystopian' });
    const author1 = await Author.create({ author: 'Pierce Brown' });
    const reader1 = await Reader.create({
      name: 'Tom',
      email: 'tom@aol.com',
      password: 'supersecret12345',
    });
    const genre2 = await Genre.create({ genre: 'Sci-Fi' });
    const author2 = await Author.create({ author: 'Ernest Cline' });
    const reader2 = await Reader.create({
      name: 'Amy',
      email: 'Amy@aol.com',
      password: 'supersecret12345',
    });
    books = await Promise.all([
      Book.create({
        title: 'Red Rising',
        ISBN: '9781444758979',
        GenreId: genre1.id,
        AuthorId: author1.id,
        ReaderId: reader1.id,
      }),
      Book.create({
        title: 'Ready Player One',
        ISBN: '9780307887436',
        GenreId: genre2.id,
        AuthorId: author2.id,
        ReaderId: reader2.id,
      }),
    ]);
  });
  describe('GET /books', () => {
    it('returns all books and associated readers, genres and authors in the database', async () => {
      const response = await request(app).get('/books');

      expect(response.status).to.equal(200);
      expect(response.body[0].title).to.equal('Red Rising');
      expect(response.body[0].Reader.name).to.equal('Tom');
      expect(response.body[0].Genre.genre).to.equal('Dystopian');
      expect(response.body[0].Author.author).to.equal('Pierce Brown');

      response.body.forEach((book) => {
        const expected = books.find((a) => a.id === book.id);

        expect(book.title).to.equal(expected.title);
        expect(book.author).to.equal(expected.author);
        expect(book.ISBN).to.equal(expected.ISBN);
        expect(book.GenreId).to.equal(expected.GenreId);
        expect(book.AuthorId).to.equal(expected.AuthorId);
        expect(book.ReaderId).to.equal(expected.ReaderId);
      });
    });
  });
  describe('GET /books/{id}', () => {
    it('returns book by id with all associated readers, genres and authors', async () => {
      const book = books[0];
      const response = await request(app).get(`/books/${book.id}`);

      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal('Red Rising');
      expect(response.body.Reader.name).to.equal('Tom');
      expect(response.body.Genre.genre).to.equal('Dystopian');
      expect(response.body.Author.author).to.equal('Pierce Brown');
    });
    it('returns a 404 if the book does not exist', async () => {
      const response = await request(app).get('/books/12345');

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('The item could not be found.');
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
      expect(response.body.title).to.equal('new title');
      expect(updatedBookRecord.title).to.equal('new title');
    });

    it('returns a 404 if the book does not exist', async () => {
      const response = await request(app).patch(`/books/12345`).send({
        title: 'new title',
        author: 'new author',
        ISBN: 'new isbn',
      });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('The item could not be found.');
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
      expect(response.body.error).to.equal('The item could not be found.');
    });
  });
});
