import { test, expect } from '@playwright/test';

const baseURL = `http://localhost:1337/api`;

test.describe('Testes da API de Categoria', () => {
    test('GET /categories - deve retornar uma lista de categorias', async ({ request }) => {
        const response = await request.get(`${baseURL}/categories`);
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);

        responseBody.data.forEach((categoria: any) => {
            expect(categoria.attributes).toHaveProperty('name');
            expect(categoria.attributes).toHaveProperty('slug');
            expect(categoria.attributes).toHaveProperty('description');
        });
    });

    test('POST /categories - deve criar uma nova categoria', async ({ request }) => {
        const novaCategoria = {
            name: 'Categoria Exemplo',
            slug: 'categoria-exemplo',
            description: 'Descrição de exemplo',
        };

        const response = await request.post(`${baseURL}/categories`, {
            data: { data: novaCategoria },
        });
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(responseBody.data.attributes.name).toBe(novaCategoria.name);
        expect(responseBody.data.attributes.slug).toBe(novaCategoria.slug);
        expect(responseBody.data.attributes.description).toBe(novaCategoria.description);
    });
});
