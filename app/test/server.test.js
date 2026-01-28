const request = require('supertest');
const app = require('../server');

describe('Health Check Endpoint', () => {
  test('GET /health returns 200 and healthy status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });
});

describe('Info Endpoint', () => {
  test('GET /api/info returns application information', async () => {
    const response = await request(app).get('/api/info');
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('devops-platform');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('environment');
    expect(response.body.author).toBe('Ethan Do');
  });
});

describe('Quote Endpoints', () => {
  test('GET /api/quote returns a random quote', async () => {
    const response = await request(app).get('/api/quote');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('text');
    expect(response.body).toHaveProperty('author');
  });

  test('GET /api/quotes returns all quotes', async () => {
    const response = await request(app).get('/api/quotes');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('Error Handling', () => {
  test('GET /nonexistent returns 404', async () => {
    const response = await request(app).get('/nonexistent');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not found');
  });
});
