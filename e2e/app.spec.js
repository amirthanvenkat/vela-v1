import { test, expect } from '@playwright/test';

const root = (page) => page.locator('#root');
const tap = async (page, name) => {
  await page.getByRole('button', { name, exact: true }).first().click();
  await page.waitForTimeout(400); // screen slide transition
};

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e; });
});

test('onboarding, money guards, goals, investing and back navigation', async ({ page }) => {
  await page.goto('./');
  await expect(root(page)).toContainText('Investing without', { timeout: 5000 });
  await tap(page, 'Get Started');
  await page.getByRole('radio', { name: /Rocket/ }).click();
  await tap(page, 'This is me');
  await page.fill('input', 'Alex');
  await tap(page, "Let's go →");
  await tap(page, 'Start growing');
  await expect(root(page)).toContainText('Hi Alex');
  await expect(page).toHaveURL(/#\/home$/);

  // Saving more than the balance is blocked
  await tap(page, 'Save');
  await tap(page, 'Add Money');
  await page.fill('input', '5000');
  await expect(root(page)).toContainText("That's more than you have");
  await expect(page.getByRole('button', { name: 'Save now' })).toBeDisabled();
  await page.fill('input', '40');
  await tap(page, 'Save now');
  await expect(root(page)).toContainText('SGD 40.00 saved.');

  // Back skips the used form
  await page.goBack();
  await expect(root(page)).toContainText('360.00');
  await expect(root(page)).not.toContainText('How much do you want to save?');

  // Goal progress
  await page.getByRole('button', { name: 'Set a goal' }).click();
  await page.fill('#goal-name', 'Laptop');
  await tap(page, 'SGD 1,000');
  await tap(page, 'Save goal');
  await expect(root(page)).toContainText('Saving for Laptop');
  await expect(root(page)).toContainText('36% of SGD 1,000.00');

  // Invest a chosen amount
  await tap(page, 'Invest');
  await page.getByRole('button', { name: 'Plant a new flower' }).click();
  await page.fill('input', '5');
  await expect(root(page)).toContainText('smallest flower is SGD 10');
  await tap(page, 'SGD 20');
  await tap(page, 'Invest SGD 20.00');
  await expect(root(page)).toContainText('SGD 20.00 invested');

  // Back can't resubmit the investment
  await page.goBack();
  await expect(root(page)).toContainText('1 flower so far');
  await expect(root(page)).not.toContainText('How much do you want to invest?');

  await tap(page, 'Home');
  await expect(root(page)).toContainText('1,180.00');
  await expect(root(page)).toContainText('SGD 20.00 growing');
  await expect(root(page)).toContainText('Planted a flower');

  // Progress survives a reload
  await page.reload();
  await expect(root(page)).toContainText('Hi Alex');
  await expect(root(page)).toContainText('1,180.00');

  // Reset demo
  await tap(page, 'You');
  await tap(page, 'Reset');
  await tap(page, 'Tap to confirm');
  await expect(root(page)).not.toContainText('Alex');
  expect(await page.evaluate(() => localStorage.getItem('vela:v1') || '')).not.toContain('Alex');
});

test('notifications sheet is modal and returns focus', async ({ page }) => {
  await page.goto('./#screen=home');
  await page.getByRole('button', { name: /Notifications/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Notifications' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Notifications' })).toBeFocused();
  await expect(page.locator('[inert]')).toHaveCount(0);
});

test('tappable cards work from the keyboard', async ({ page }) => {
  await page.goto('./#screen=home');
  await page.getByRole('button', { name: 'Learn the basics' }).focus();
  await page.keyboard.press('Enter');
  await expect(root(page)).toContainText('Three short reads');
});

test('deep links ignore and keep saved progress', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', '{"sentinel":1}'));
  await page.goto('./?x=1#screen=home&name=Zed');
  await expect(root(page)).toContainText('Hi Zed');
  expect(await page.evaluate(() => localStorage.getItem('vela:v1'))).toBe('{"sentinel":1}');
});

test('phone frame on desktop, full screen on phones', async ({ browser }) => {
  const desk = await browser.newPage({ viewport: { width: 1280, height: 700 } });
  await desk.goto('./#screen=home');
  await expect(desk.getByText('open it on your phone')).toBeVisible();
  const size = await desk.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
  expect(size).toEqual([1280, 700]); // scaled to fit, no page scroll
  await desk.goto('./?f=0#screen=home&frame=0');
  await expect(desk.getByText('open it on your phone')).toHaveCount(0);

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await phone.goto('./#screen=home');
  await expect(phone.getByRole('navigation', { name: 'Main' })).toBeVisible();
  await expect(phone.getByText('open it on your phone')).toHaveCount(0);
});

// Deep links render end states instantly, so these start from a normal (onboarded) boot.
const investFromHome = async (page) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', JSON.stringify({ onboarded: true })));
  await page.reload();
  await tap(page, 'Invest');
  await tap(page, 'Plant a flower');
  await tap(page, 'Invest SGD 50.00');
  await expect(root(page)).toContainText('SGD 50.00 invested');
};

test('confetti plays after investing', async ({ page }) => {
  await investFromHome(page);
  await expect(page.getByTestId('confetti')).toHaveCount(1);
});

test('no confetti with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await investFromHome(page);
  await page.waitForTimeout(800);
  await expect(page.getByTestId('confetti')).toHaveCount(0);
});
