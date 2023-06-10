const { expect } = require('chai');
const request = require('supertest');
const { Genre, Book } = require('../src/models/index');
const app = require('../src/app');

describe('/genres', () => {
  before(async () => {
    await Genre.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Genre.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /genres', () => {
      it('creates a new genre in the database', async () => {
        const response = await request(app).post('/genres').send({
          genre: 'Horror',
        });
        const newGenreRecord = await Genre.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.genre).to.equal('Horror');
        expect(newGenreRecord.genre).to.equal('Horror');
      });
    });
    it('throws an error if genre is null', async () => {
      const response = await request(app).post('/genres').send();
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('No genre provided.');
    });
  });

  describe('with records in the database', () => {
    let genres;
    beforeEach(async () => {
      genres = await Promise.all([
        Genre.create({
          genre: 'Horror',
        }),
        Genre.create({
          genre: 'Fantasy',
        }),
      ]);
      await Promise.all([
        Book.create({
          title: 'Frankenstein',
          ISBN: '435634563456',
          GenreId: genres[0].id,
        }),
        Book.create({
          title: 'The Lord of the Rings',
          ISBN: '23045823459349',
          GenreId: genres[1].id,
        }),
      ]);
    });

    describe('GET /genres', () => {
      it('gets all genres records and associated books', async () => {
        const response = await request(app).get('/genres');

        expect(response.status).to.equal(200);
        expect(response.body[0].Books[0].title).to.equal('Frankenstein');
        response.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);
          expect(genre.genre).to.equal(expected.genre);
        });
      });
    });
    describe('GET /genres/:id', () => {
      it('gets genre record by id and associated books', async () => {
        const genre = genres[0];
        const response = await request(app).get(`/genres/${genre.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal(genre.genre);
        expect(response.body.Books[0].title).to.equal('Frankenstein');
      });
      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).get('/genres/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });

    describe('PATCH /genres/:id', () => {
      it('updates genre and returns the updated record', async () => {
        const genre = genres[0];
        const response = await request(app)
          .patch(`/genres/${genre.id}`)
          .send({ genre: 'Horror' });
        const updatedGenreRecord = await Genre.findByPk(genre.id, {
          raw: true,
        });
        expect(response.status).to.equal(200);
        expect(response.body.genre).to.equal('Horror');
        expect(updatedGenreRecord.genre).to.equal('Horror');
      });
      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app)
          .patch('/genres/12345')
          .send({ genre: 'Horror' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });

    describe('DELETE /genres/:id', () => {
      it('deletes genre record by id', async () => {
        const genre = genres[0];
        const response = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const response = await request(app).delete('/genres/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });
  });
});
