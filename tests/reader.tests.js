const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models/index');
const app = require('../src/app');

describe('/readers', () => {
  before(async () => {
    await Reader.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe('with no records in the database', () => {
    describe('POST /readers', () => {
      it('creates a new reader in the database', async () => {
        const response = await request(app).post('/readers').send({
          name: 'Darrow',
          email: 'redrising@gmail.com',
          password: 'howler123',
        });
        const newReaderRecord = await Reader.findByPk(response.body.id, {
          raw: true,
        });

        expect(response.status).to.equal(201);
        expect(response.body.name).to.equal('Darrow');
        expect(newReaderRecord.name).to.equal('Darrow');
        expect(newReaderRecord.email).to.equal('redrising@gmail.com');
        expect(newReaderRecord.password).to.equal('howler123');
      });
    });
    it('throws an error if username is null', async () => {
      const response = await request(app).post('/readers').send({
        email: 'Slytherin@hogwarts.co.uk',
        password: 'Potter12345',
      });
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('No username provided.');
    });
    it('throws an error if email address is invalid', async () => {
      const response = await request(app).post('/readers').send({
        name: 'Malfoy',
        email: 'Slytherin',
        password: 'Potter12345',
      });
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal('Invalid email provided.');
    });
    it('throws an error if password < 8 characters', async () => {
      const response = await request(app).post('/readers').send({
        name: 'Malfoy',
        email: 'Slytherin@hogwarts.co.uk',
        password: 'Potter',
      });
      expect(response.status).to.equal(400);
      expect(response.body.error).to.equal(
        'Password should be between 8 and 99 characters'
      );
    });
    it('does not return password', async () => {
      const response = await request(app).post('/readers').send({
        name: 'Malfoy',
        email: 'Slytherin@hogwarts.co.uk',
        password: 'Potter12345',
      });
      expect(response.status).to.equal(201);
      expect(response.body.password).to.equal(undefined);
    });
  });

  describe('with records in the database', () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: 'Darrow',
          email: 'redrising@gmail.com',
          password: 'howler123',
        }),
        Reader.create({
          name: 'Arya Stark',
          email: 'vmorgul@me.com',
          password: 'thenorthremembers',
        }),
        Reader.create({
          name: 'Rubeus Hagrid',
          email: 'grounds@hogwarts.co.uk',
          password: 'fluffy123',
        }),
      ]);
    });

    describe('GET /readers', () => {
      it('gets all readers records', async () => {
        const response = await request(app).get('/readers');

        expect(response.status).to.equal(200);

        response.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(!reader.password);
        });
      });
      it('does not return passwords', async () => {
        const response = await request(app).get('/readers');
        response.body.forEach((reader) => {
          readers.find((a) => a.id === reader.id);

          expect(reader.password).to.equal(undefined);
        });
      });
    });
    describe('GET /readers/:id', () => {
      it('gets reader record by id', async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(reader.name);
        expect(response.body.email).to.equal(reader.email);
      });
      it('does not return password', async () => {
        const reader = readers[0];
        const response = await request(app).get(`/readers/${reader.id}`);
        expect(response.body.password).to.equal(undefined);
      });
      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).get('/readers/12345');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });

    describe('PATCH /readers/:id', () => {
      it('updates reader and returns the updated record', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });
        expect(response.status).to.equal(200);
        expect(response.body.email).to.equal('miss_e_bennet@gmail.com');
        expect(updatedReaderRecord.email).to.equal('miss_e_bennet@gmail.com');
      });
      it('does not return password', async () => {
        const reader = readers[0];
        const response = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: 'miss_e_bennet@gmail.com' });
        expect(response.body.password).to.equal(undefined);
      });
      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app)
          .patch('/readers/12345')
          .send({ email: 'some_new_email@gmail.com' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });

    describe('DELETE /readers/:id', () => {
      it('deletes reader record by id', async () => {
        const reader = readers[0];
        const response = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(response.status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      it('returns a 404 if the reader does not exist', async () => {
        const response = await request(app).delete('/readers/12345');
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The item could not be found.');
      });
    });
  });
});
