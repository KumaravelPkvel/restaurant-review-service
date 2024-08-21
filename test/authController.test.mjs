import * as chai  from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import supertest from 'supertest';
import express from 'express';
import * as authController from '../src/controllers/authController.mjs';
import db from '../src/config/db.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { expect } = chai;
chai.use(sinonChai);

const app = express();
app.use(express.json());
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);

const request = supertest(app);

describe('Auth Controller', () => {
  let dbStub, bcryptStub, jwtStub;

  beforeEach(() => {
    dbStub = sinon.stub(db, 'execute');
    bcryptStub = sinon.stub(bcrypt, 'hash');
    jwtStub = sinon.stub(jwt, 'sign').returns('test_token');
});


  afterEach(() => {
    sinon.restore();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      dbStub.onFirstCall().resolves([[]]); // No existing user
      bcryptStub.resolves('hashed_password');
      dbStub.onSecondCall().resolves([{ insertId: 1 }]);

      const res = await request.post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'User registered successfully');
      expect(dbStub).to.have.been.calledTwice;
      expect(bcryptStub).to.have.been.calledOnce;
    });

    it('should return 400 if user already exists', async () => {
      dbStub.resolves([[{ id: 1, email: 'test@example.com' }]]);

      const res = await request.post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'User already exists');
      expect(dbStub).to.have.been.calledOnce;
    });
  });

  describe('login', () => {
    it('should log in an existing user', async () => {
      dbStub.resolves([[{ id: 1, email: 'test@example.com', password: 'hashed_password' }]]);
      sinon.stub(bcrypt, 'compare').resolves(true);
      jwtStub.resolves('test_token');

      const res = await request.post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).to.equal(200);
    });

    it('should return 400 if credentials are invalid', async () => {
      dbStub.resolves([[]]);

      const res = await request.post('/api/auth/login').send({
        email: 'wrong@example.com',
        password: 'password123'
      });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Invalid credentials');
      expect(dbStub).to.have.been.calledOnce;
    });
  });

  describe('logout', () => {
    it('should log out a user', async () => {
      const res = await request.post('/api/auth/logout');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'User logged out successfully');
    });
  });
});
