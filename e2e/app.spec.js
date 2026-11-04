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
  // Tab never reaches the screen behind the sheet. (At the end of the tab order, newer Chromium
  // hands focus to the browser itself, like a native dialog, so focus may also sit on <body>.)
  let visitedDialog = false;
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const where = await page.evaluate(() => {
      const a = document.activeElement;
      if (a.closest('[role=dialog]')) return 'dialog';
      return a === document.body ? 'body' : 'background';
    });
    expect(where, `Tab #${i + 1}`).not.toBe('background');
    visitedDialog ||= where === 'dialog';
  }
  expect(visitedDialog).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Notifications' })).toBeFocused();
  await expect(page.locator('[inert]')).toHaveCount(0);
});

test('tappable cards work from the keyboard', async ({ page }) => {
  await page.goto('./#screen=home');
  await page.getByRole('button', { name: 'Learn the basics' }).focus();
  await page.keyboard.press('Enter');
  await expect(root(page)).toContainText('Six short reads');
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

// Routing (React Router, hash URLs)
const onboard = async (page) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', JSON.stringify({ onboarded: true })));
};

test('old #screen= links are rewritten to routes', async ({ page }) => {
  await page.goto('./#screen=investSuccess&flowers=1&amt=50');
  await expect(root(page)).toContainText('SGD 50.00 invested');
  await expect(page).toHaveURL(/#\/invest\/done\?demo&amt=50&flowers=1$/);

  await page.goto('./?b=1#screen=learnArticle&id=' + encodeURIComponent('What is investing?'));
  await expect(page).toHaveURL(/#\/learn\/investing\?demo$/);
  await expect(root(page)).toContainText('Investing means using some of your money');
});

test('new-style demo links seed state', async ({ page }) => {
  await page.goto('./#/save?demo&goal=' + encodeURIComponent('Trip to Japan:1000'));
  await expect(root(page)).toContainText('Saving for Trip to Japan');
  await expect(root(page)).toContainText('32% of SGD 1,000.00');
});

test('every screen has a URL that survives a reload', async ({ page }) => {
  await onboard(page);
  await page.goto('./?r=1#/save/goal');
  await expect(root(page)).toContainText('What are you saving for?');
  await page.reload();
  await expect(root(page)).toContainText('What are you saving for?');
  await page.goto('./?r=2#/learn/money');
  await expect(root(page)).toContainText('Where does my money go?');
});

test('browser back and forward walk the app history', async ({ page }) => {
  await onboard(page);
  await page.goto('./?h=1#/home');
  await tap(page, 'Learn');
  await page.getByRole('button', { name: 'What is risk?' }).click();
  await expect(page).toHaveURL(/#\/learn\/risk$/);
  await page.goBack();
  await expect(page).toHaveURL(/#\/learn$/);
  await expect(root(page)).toContainText('Six short reads');
  await page.goBack();
  await expect(page).toHaveURL(/#\/home$/);
  await page.goForward();
  await expect(root(page)).toContainText('Six short reads');
});

test('in-app Back on a directly opened screen goes up to its tab', async ({ page }) => {
  await onboard(page);
  await page.goto('./?d=1#/save/add');
  await expect(root(page)).toContainText('How much do you want to save?');
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page).toHaveURL(/#\/save$/);
  await expect(root(page)).toContainText('Savings Pot');
});

test('guards: onboarding and unknown routes', async ({ page }) => {
  await onboard(page);
  await page.goto('./?g=1#/welcome');
  await expect(page).toHaveURL(/#\/home$/);
  await page.goto('./?g=2#/no/such/screen');
  await expect(page).toHaveURL(/#\/home$/);

  await page.evaluate(() => localStorage.clear());
  await page.goto('./?g=3#/invest');
  await expect(page).toHaveURL(/#\/$/);
  await expect(root(page)).toContainText('VELA');
});

// Installable app and offline support
test('web app manifest and icons are served', async ({ page, request }) => {
  await page.goto('./');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const manifest = await (await request.get(href)).json();
  expect(manifest).toMatchObject({ short_name: 'VELA', display: 'standalone', start_url: './', scope: './' });
  expect(manifest.icons.some((i) => i.purpose === 'maskable')).toBe(true);
  for (const icon of manifest.icons) {
    const res = await request.get(icon.src);
    expect(res.ok(), icon.src).toBe(true);
  }
  expect((await request.get(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'))).ok()).toBe(true);
});

test('works offline after the first visit', async ({ page, context }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', JSON.stringify({ onboarded: true, name: 'Offline Olly' })));
  // Wait until the service worker has installed, precached the app and taken control of the page.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    }
  });

  await context.setOffline(true);
  await page.reload();
  await expect(root(page)).toContainText('Hi Offline Olly');
  await tap(page, 'Learn');
  await page.getByRole('button', { name: 'What is risk?' }).click();
  await expect(root(page)).toContainText('Risk is a word for how bumpy the ride might be.');
  await context.setOffline(false);
});

// Garden growth and Learn articles
test('planting adds a seedling that will bloom in three days', async ({ page }) => {
  await onboard(page);
  await page.goto('./?grow=1#/invest');
  await tap(page, 'Plant a flower');
  await tap(page, 'Invest SGD 50.00');
  await expect(root(page)).toContainText('Your first flower is planted.');
  await tap(page, 'See my garden');
  await tap(page, 'Invest');
  await expect(page.locator('[title="Seedling, blooms in 3 days"]')).toHaveCount(1);
  await expect(root(page)).toContainText('Next bloom in about 3 days');
});

test('an open app shows a flower growing as the days pass', async ({ page }) => {
  // Fake clock from the start, so the garden's once-a-minute refresh runs on it too. The flower is
  // planted at the clock's fixed start time: each new page restarts the fake clock from there.
  const start = new Date('2026-10-01T09:00:00').getTime();
  await page.clock.install({ time: start });
  await page.goto('./');
  await page.evaluate((plantedAt) => localStorage.setItem('vela:v1', JSON.stringify({
    onboarded: true, flowers: [{ kind: '🌻', plantedAt }],
  })), start);
  await page.goto('./?clock=1#/invest');
  await expect(page.locator('[title="Seedling, blooms in 3 days"]')).toHaveCount(1);

  await page.clock.fastForward('25:00:00');
  await expect(page.locator('[title="Sprout, blooms in 2 days"]')).toHaveCount(1);
  await page.clock.fastForward('24:00:00');
  await expect(page.locator('[title="Bud, blooms in 1 day"]')).toHaveCount(1);
  await page.clock.fastForward('24:00:00');
  await expect(page.locator('[title="In bloom"]')).toHaveCount(1);
  await expect(root(page)).not.toContainText('Next bloom');
});

test('gardens saved before growth existed stay in bloom', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', JSON.stringify({ onboarded: true, flowers: ['🌸', '🌺'] })));
  await page.goto('./?old=1#/home');
  await expect(root(page)).toContainText('2 blooms and growing.');
  await expect(page.locator('[title="In bloom"]')).toHaveCount(2);
});

test('six Learn articles, with related reads on Save and Invest', async ({ page }) => {
  await onboard(page);
  await page.goto('./?learn=1#/learn');
  for (const title of ['What is investing?', 'What is risk?', 'Where does my money go?', 'Small amounts grow', 'Rainy-day fund first', 'Dips are normal']) {
    await expect(page.getByRole('button', { name: title })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Small amounts grow' }).click();
  await expect(root(page)).toContainText('about SGD 64,000');

  await page.goto('./?learn=2#/save');
  await page.getByRole('button', { name: /rainy-day fund comes first/ }).click();
  await expect(page).toHaveURL(/#\/learn\/rainyday$/);
  await expect(root(page)).toContainText('three to six months');

  await page.goto('./?learn=3#/invest');
  await page.getByRole('button', { name: /Dips are normal/ }).click();
  await expect(page).toHaveURL(/#\/learn\/dips$/);
  await expect(root(page)).toContainText('Checking less often helps.');
});

// Goal-linked invest suggestions
const tip = (page) => page.getByRole('note', { name: 'Goal suggestion' });

test('a long-term goal suggests and pre-fills a monthly amount', async ({ page }) => {
  await onboard(page);
  await page.goto('./?goal=1#/save/goal');
  await page.fill('#goal-name', 'Flat');
  await page.getByLabel('Goal amount in SGD').fill('6000');
  await tap(page, '5 years');
  await tap(page, 'Save goal');
  await expect(root(page)).toContainText(/Flat · SGD 6,000.00 · by \w{3} \d{4}/);

  // 6,000 - 320 already saved = 5,680 over 60 months = 94.67, rounded up to 95
  await tap(page, 'Invest');
  await tap(page, 'Plant a flower');
  await expect(tip(page)).toContainText('about SGD 95 a month would get you there, before any growth');
  await expect(tip(page)).toContainText('A guide, not advice.');
  await expect(page.getByLabel('Investment amount in SGD')).toHaveValue('95');

  // Still the user's choice: change it, and the tip offers the suggestion back
  await tap(page, 'SGD 20');
  await tap(page, 'Use SGD 95');
  await expect(page.getByRole('button', { name: 'Invest SGD 95.00' })).toBeVisible();
});

test('a goal under 3 years away points to savings instead', async ({ page }) => {
  await page.goto('./#/invest/plant?demo&goal=' + encodeURIComponent('Trip to Japan:1000:') + new Date().getFullYear() + '-12');
  await expect(tip(page)).toContainText("That's less than 3 years away");
  await expect(page.getByLabel('Investment amount in SGD')).toHaveValue('50');
  await page.getByRole('button', { name: 'Why savings first →' }).click();
  await expect(page).toHaveURL(/#\/learn\/rainyday$/);
});

test('a goal without a date offers to add one; no goal, no tip', async ({ page }) => {
  await page.goto('./#/invest/plant?demo&goal=Laptop:1500');
  await expect(tip(page)).toContainText('Add a date to your goal');
  await page.getByRole('button', { name: 'Add a date →' }).click();
  await expect(page).toHaveURL(/#\/save\/goal$/);

  await page.goto('./?n=1#/invest/plant?demo');
  await expect(root(page)).toContainText('How much do you want to invest?');
  await expect(tip(page)).toHaveCount(0);
});

// Withdrawals
test('take money out of the Savings Pot', async ({ page }) => {
  await onboard(page);
  await page.goto('./?w=1#/save');
  await tap(page, 'Take money out');
  await page.getByLabel(/Amount to take out of your Savings Pot/).fill('400');
  await expect(root(page)).toContainText("That's more than you have. There's SGD 320.00 in your Savings Pot.");
  await expect(page.getByRole('button', { name: 'Take out' })).toBeDisabled();

  await page.getByLabel(/Amount to take out of your Savings Pot/).fill('40');
  await tap(page, 'Take out SGD 40.00');
  await expect(root(page)).toContainText('SGD 40.00 is back in your balance.');

  // Back can't repeat the withdrawal
  await page.goBack();
  await expect(root(page)).toContainText('280.00');
  await expect(root(page)).not.toContainText('How much do you want to take out');

  await tap(page, 'Home');
  await expect(root(page)).toContainText('1,280.00');
  await expect(root(page)).toContainText('Taken out of your Savings Pot');
  await expect(root(page)).toContainText('+SGD 40.00');
});

test('take money out of the garden, and the garden follows', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', JSON.stringify({
    onboarded: true, invested: 150, flowers: ['🌸', '🌺', '🌻'],
  })));
  await page.goto('./?w=2#/invest');
  await tap(page, 'Take money out');
  await page.getByLabel(/Amount to take out of your garden/).fill('60');
  await expect(root(page)).toContainText('2 flowers will go, newest first.');
  await expect(page.locator('[title^="Leaving"]')).toHaveCount(2);
  await expect(root(page)).toContainText('Usually arrives in 1–3 working days');
  await tap(page, 'Take out SGD 60.00');
  await expect(root(page)).toContainText("Your garden keeps growing with what's left.");

  await tap(page, 'Back to Home');
  await tap(page, 'Invest');
  await expect(root(page)).toContainText('SGD 90.00');
  await expect(page.locator('[title="In bloom"]')).toHaveCount(1);

  // Take it all: every flower goes, and the button disappears
  await tap(page, 'Take money out');
  await tap(page, 'Take it all');
  await expect(root(page)).toContainText('All your flowers will go. Your first seed stays.');
  await tap(page, 'Take out SGD 90.00');
  await expect(root(page)).toContainText("Your first seed is still here whenever you're ready.");
  await tap(page, 'Back to Home');
  await tap(page, 'Invest');
  await expect(page.locator('[title="In bloom"]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Take money out' })).toHaveCount(0);
});

test('no Take money out button when there is nothing to take', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('vela:v1', JSON.stringify({ onboarded: true, savings: 0, invested: 0 })));
  await page.goto('./?w=3#/save');
  await expect(root(page)).toContainText('Savings Pot');
  await expect(page.getByRole('button', { name: 'Take money out' })).toHaveCount(0);
  await page.goto('./?w=4#/invest');
  await expect(root(page)).toContainText('Your Garden');
  await expect(page.getByRole('button', { name: 'Take money out' })).toHaveCount(0);
});
