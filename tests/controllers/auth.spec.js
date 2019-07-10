import chai from 'chai';
import api from '../test.config';
import {
  normalUser, noEmail, adminUser, wrongEmail, wrongPassword
} from '../__mocks__/auth.mocks';

const { expect } = chai;

describe('Auth controller', () => {
  it('should signup a new user', async () => {
    const server = await api.post('/api/v1/auth/signup')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(normalUser);
    expect(server.statusCode).to.equal(201);
  });

  it('should signup a new admin', async () => {
    const server = await api.post('/api/v1/auth/signup')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(adminUser);
    expect(server.statusCode).to.equal(201);
    expect(server.body.data.is_admin).to.equal(true);
  });

  it('should not signup user if email already exists', async () => {
    const server = await api.post('/api/v1/auth/signup')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(normalUser);
    expect(server.statusCode).to.equal(409);
  });

  it('should not signup user with incomplete credentials', async () => {
    const server = await api.post('/api/v1/auth/signup')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(noEmail);
    expect(server.statusCode).to.equal(401);
  });

  it('should signin a user', async () => {
    const server = await api.post('/api/v1/auth/signin')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(normalUser);
    expect(server.statusCode).to.equal(200);
  });

  it('should not signin user with incomplete email or password fields', async () => {
    const server = await api.post('/api/v1/auth/signin')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(noEmail);
    expect(server.statusCode).to.equal(401);
  });

  it('should not signin user with wrong email', async () => {
    const server = await api.post('/api/v1/auth/signin')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(wrongEmail);
    expect(server.statusCode).to.equal(404);
  });

  it('should not signin user with wrong password', async () => {
    const server = await api.post('/api/v1/auth/signin')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(wrongPassword);
    expect(server.statusCode).to.equal(403);
  });
});
