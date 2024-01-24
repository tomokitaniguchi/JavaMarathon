import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://dev.marathon.rplearn.net/tomoki_taniguchi/customer/add.html');
  await page.getByLabel('会社名:').click();
  await page.getByLabel('会社名:').fill('テスト株式会社');
  await page.getByLabel('業種:').click();
  await page.getByLabel('業種:').fill('IT');
  await page.getByLabel('連絡先:').click();
  await page.getByLabel('連絡先:').fill('0123456789');
  await page.getByLabel('所在地:').click();
  await page.getByLabel('所在地:').fill('東京都新宿区');
  await page.getByRole('button', { name: '確認' }).click();
  await page.getByRole('button', { name: '送信' }).click();
});