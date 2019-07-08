import chai from 'chai';
import api from './test.config';

const { expect } = chai;

describe('API', () => {
  it('should connect to the Server', async () => {
    const server = await api.get('/api/v1');
    expect(server.statusCode).to.equal(200);
    expect(server.body.message).to.equal('Welcome Save A Seat API');
  });
});
