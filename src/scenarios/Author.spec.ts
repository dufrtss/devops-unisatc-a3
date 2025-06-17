import { test, expect } from '@playwright/test';
import data from '../../data/data.json';

const baseURL = `http://localhost:1337/api`;

test.describe('Testes da API de Autor', () => {
    test('POST /authors - deve criar um novo autor', async ({ request }) => {
        const novoAutor = {
            name: 'Jane Doe',
            email: 'janedoe@example.com',
            avatar: 'janedoe.jpg',
        };

        const response = await request.post(`${baseURL}/authors`, {
            data: { data: novoAutor },
        });
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data.attributes.name).toBe(novoAutor.name);
        expect(responseBody.data.attributes.email).toBe(novoAutor.email);
        expect(responseBody.data.attributes.avatar).toBe(novoAutor.avatar);
    });

    test('GET /authors - deve retornar uma lista de autores', async ({ request }) => {
        const response = await request.get(`${baseURL}/authors`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);

        // Valida se os autores retornados correspondem aos do arquivo data.json
        const autoresEsperados = data.authors.map(autor => autor.name);
        const autoresRetornados = responseBody.data.map((autor: any) => autor.attributes.name);
        expect(autoresRetornados).toEqual(expect.arrayContaining(autoresEsperados));
    });

    test('GET /authors - deve validar se um autor específico existe', async ({ request }) => {
        const response = await request.get(`${baseURL}/authors`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);

        const autorEsperado = data.authors.find(autor => autor.name === 'David Doe');
        const autoresRetornados = responseBody.data.map((autor: any) => autor.attributes.name);
        expect(autoresRetornados).toContain(autorEsperado?.name);
    });
});
