import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.STRAPI_BASE_URL || 'http://127.0.0.1:1337/api';
const API_TOKEN = process.env.API_TOKEN;

const createHeaders = () => {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_TOKEN}` };
};

test.describe('Testes da API de Categoria', () => {
    test('GET /categories - deve retornar uma lista de categorias', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/categories`, {
            headers: createHeaders(),
        });
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);

        responseBody.data.forEach((category: any) => {
            expect(category.id).toBeDefined();
        });
    });

    test('POST /categories - deve criar uma nova categoria', async ({ request }) => {
        const newCategory = {
            name: 'Categoria Teste'
        };

        const response = await request.post(`${BASE_URL}/categories`, {
            data: { data: newCategory },
            headers: createHeaders(),
        });
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data.name).toBe(newCategory.name);
    });
});
