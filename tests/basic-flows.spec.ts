import { test, expect } from '@playwright/test';

test.describe('Marmita Ordering Flow', () => {
  test('should complete a basic order flow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Restaurante da Juliana/);

    const marmitaMédiaLink = page.getByRole('link', { name: /Marmita Média/i });
    await marmitaMédiaLink.click();


    await expect(page).toHaveURL(/.*cardapio.*/);

    await expect(page.getByText('Escolha os acompanhamentos')).toBeVisible();

    const meatOption = page.getByText(/Frango/i).first();
    await meatOption.click();

    const addBtn = page.getByRole('button', { name: /Adicionar/i });
    await addBtn.click();

    await expect(page).toHaveURL(/.*carrinho.*/);
    await expect(page.getByText(/Marmita Média/i)).toBeVisible();

    const checkoutBtn = page.getByRole('button', { name: /Continuar/i });
    await checkoutBtn.click();

    await expect(page).toHaveURL(/.*checkout.*/);

    await page.getByRole('button', { name: /Balcão/i }).click();

    await page.getByRole('button', { name: /Pix/i }).click();

    await expect(page.getByText(/Chave Pix:/i)).toBeVisible();

    await page.evaluate(() => {
        window.open = () => null;
    });

    const sendOrderBtn = page.getByRole('button', { name: /Enviar Pedido/i });
    await expect(sendOrderBtn).toBeEnabled();
    await sendOrderBtn.click();

    await expect(page).toHaveURL(/\/$/);
  });

  test('should handle delivery and verify fee', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Marmita Média/i }).click();
    await page.getByText(/Frango/i).first().click();
    await page.getByRole('button', { name: /Adicionar/i }).click();

    await page.getByRole('button', { name: /Continuar/i }).click();
    await expect(page).toHaveURL(/.*checkout.*/);

    await expect(page.locator('span.text-2xl.font-bold.text-primary')).toHaveText('R$ 20,00');

    await page.getByRole('button', { name: /Entrega/i }).click();
    
    await expect(page.getByLabel(/Nome da rua/i)).toBeVisible();
    await expect(page.getByLabel(/Número/i)).toBeVisible();

    await expect(page.locator('p.text-sm.text-amber-900')).toContainText('Taxa de entrega:');
    await expect(page.locator('p.text-sm.text-amber-900 strong')).toHaveText('R$ 2,00');

    await expect(page.locator('span.text-amber-600').filter({ hasText: 'R$ 2,00' })).toBeVisible();

    await expect(page.locator('span.text-primary.text-2xl')).toHaveText('R$ 22,00');
  });

  test('should add extra charge for mini marmita with bisteca', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Marmita Mini/i }).click();
    
    await page.getByText(/Bisteca de boi/i).click();

    await expect(page.getByText('R$ 18,00')).toBeVisible();

    await page.getByRole('button', { name: /Adicionar/i }).click();
    await page.getByRole('button', { name: /Continuar/i }).click();

    await expect(page.locator('span.text-2xl.font-bold.text-primary')).toHaveText('R$ 18,00');
  });

  test('should show change options for cash payment', async ({ page }) => {
    await page.goto('/');
    const isClosed = await page.getByText(/Fechado hoje/i).isVisible();
    if (isClosed) return;

    await page.getByRole('link', { name: /Marmita Média/i }).click();
    await page.getByText(/Frango/i).first().click();
    await page.getByRole('button', { name: /Adicionar/i }).click();
    await page.getByRole('button', { name: /Continuar/i }).click();

    await page.getByRole('button', { name: /Dinheiro/i }).click();

    await expect(page.getByText(/Precisa de troco\?/i)).toBeVisible();

    await page.getByRole('button', { name: /Sim/i }).click();

    await expect(page.getByText(/Troco para quanto\?/i)).toBeVisible();
    await expect(page.getByPlaceholder(/R\$/i)).toBeVisible();
  });
});
