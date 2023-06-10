const { expect } = require('chai');
const request = require('supertest');
const { Author, Book } = require('../src/models/index');
const app = require('../src/app');

describe('/authors', () => {
  before(async () => {
    await Author.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Author.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /authors', () => {
      it('creates a new author in the database', async () => {
        const response = await request(app).post('/authors').send({
          author: 'Stephen King',
        });
        const newAuthorRecord = await Author.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.author).to.equal('Stephen King');
        expect(newAuthorRecord.author).to.equal('Stephen King');
      });
    });
    it('throws an error if author is null', async () => {
      const response = await request(app).post('/authors').send();
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('No author provided.');
    });
  });

  describe('with records in the database', () => {
    let authors;

    beforeEach(async () => {
      authors = await Promise.all([
        Author.create({
          author: 'Stephen King',
        }),
        Author.create({
          author: 'Agatha Christie',
        }),
        Author.create({
          author: 'George Orwell',
        }),
      ]);
      await Promise.all([
        Book.create({
          title: 'Frankenstein',
          ISBN: '435634563456',
          AuthorId: authors[0].id,
        }),
        Book.create({
          title: 'The Lord of the Rings',
          ISBN: '23045823459349',
          AuthorId: authors[1].id,
        }),
      ]);
    });

    describe('GET /authors', () => {
      it('gets all authors records and associated books', async () => {
        const response = await request(app).get('/authors');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
        expect(response.body[0].Books[0].title).to.equal('Frankenstein');

        response.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);

          expect(author.name).to.equal(expected.name);
        });
      });
    });
    describe('GET /authors/:id', () => {
      it('gets author record by id and associated books', async () => {
        const author = authors[0];
        const response = await request(app).get(`/authors/${author.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal(author.author);
        expect(response.body.Books[0].title).to.equal('Frankenstein');
      });
      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).get('/authors/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });

    describe('PATCH /authors/:id', () => {
      it('updates author and returns the updated record', async () => {
        const author = authors[0];
        const response = await request(app)
          .patch(`/authors/${author.id}`)
          .send({ author: 'Roald Dahl' });
        const updatedAuthorRecord = await Author.findByPk(author.id, {
          raw: true,
        });
        expect(response.status).to.equal(200);
        expect(response.body.author).to.equal('Roald Dahl');
        expect(updatedAuthorRecord.author).to.equal('Roald Dahl');
      });
      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app)
          .patch('/authors/12345')
          .send({ author: 'Roald Dahl' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });

    describe('DELETE /authors/:id', () => {
      it('deletes author record by id', async () => {
        const author = authors[0];
        const response = await request(app).delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it('returns a 404 if the author does not exist', async () => {
        const response = await request(app).delete('/authors/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });
  });
});
