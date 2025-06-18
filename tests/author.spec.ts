import { test, expect } from '@playwright/test';
import data from '../data/data.json';

const BASE_URL = `http://localhost:1337/api`;
const API_TOKEN = process.env.API_TOKEN;

const createHeaders = () => {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` };
};

test.describe('Testes da API de author', () => {
    test('POST /authors - deve criar um novo author', async ({ request }) => {
        const newAuthor = {
            name: 'Jane Doe'
        };

        const response = await request.post(`${BASE_URL}/authors`, {
            data: { data: newAuthor },
            headers: createHeaders(),
        });
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data.name).toBe(newAuthor.name);
    });

    test('GET /authors - deve retornar uma lista de authores', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/authors`, {
            headers: createHeaders(),
        });
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);

        const expectedAuthors = data.authors.map(author => author.name);
        const authors = responseBody.data.map(author => author.name);
        
        expect(authors.length).toBeGreaterThanOrEqual(expectedAuthors.length);
    });

    test('GET /authors - deve validar se um autor específico existe', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/authors`, {
            headers: createHeaders(),
        });
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);

        const authors = responseBody.data.map(author => author.name);

        expect(authors.includes('Jane Doe')).toBeTruthy();
    });
});
