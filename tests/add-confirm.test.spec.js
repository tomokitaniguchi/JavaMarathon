import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://dev.marathon.rplearn.net/tomoki_taniguchi/customer/add-confirm.html?companyName=%E3%83%86%E3%82%B9%E3%83%88%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE&industry=IT&contact=0123456789&location=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%96%B0%E5%AE%BF%E5%8C%BA');
  await page.getByRole('button', { name: '送信' }).click();
});