import chai from 'chai';
import api from '../test.config';
import {
  normalUser, adminUser
} from '../__mocks__/auth.mocks';
import { bus } from '../__mocks__/bus.mocks';

const { expect } = chai;
let adminToken,
  userToken;

describe('Bus controller', () => {
  it('should login an admin', async () => {
    const server = await api.post('/api/v1/auth/signin')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(adminUser);
    adminToken = server.body.data.token;
    expect(server.statusCode).to.equal(200);
  });

  it('should create a new bus', async () => {
    const server = await api.post('/api/v1/buses')
      .type('form')
      .set('Content-Type', 'application/json')
      .set('x-access-token', adminToken)
      .send(bus);
    expect(server.statusCode).to.equal(201);
  });

  it('should not create a new bus if token is not present', async () => {
    const server = await api.post('/api/v1/buses')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(bus);
    expect(server.statusCode).to.equal(403);
  });

  it('should signin a user', async () => {
    const server = await api.post('/api/v1/auth/signin')
      .type('form')
      .set('Content-Type', 'application/json')
      .send(normalUser);
    userToken = server.body.data.token;
    expect(server.statusCode).to.equal(200);
  });

  it('should not create a new bus if user is not an admin', async () => {
    const server = await api.post('/api/v1/buses')
      .type('form')
      .set('Content-Type', 'application/json')
      .set('x-access-token', userToken)
      .send(bus);
    expect(server.statusCode).to.equal(403);
  });

  it('should not create a new bus if plate number exists', async () => {
    const server = await api.post('/api/v1/buses')
      .type('form')
      .set('Content-Type', 'application/json')
      .set('x-access-token', adminToken)
      .send(bus);
    expect(server.statusCode).to.equal(409);
  });
});
