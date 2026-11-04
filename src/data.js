/* ---------- Data ---------- */
export const FLOWERS = ['🌸', '🌺', '🌻', '🌼', '💐'];
export const MIN_INVEST = 10;

export const RISKS = {
  tortoise: { key: 'tortoise', emoji: '🐢', label: 'Tortoise', vibe: 'Play it safe', profile: 'Steady' },
  fox:      { key: 'fox',      emoji: '🦊', label: 'Fox',      vibe: 'Balanced',     profile: 'Balanced' },
  rocket:   { key: 'rocket',   emoji: '🚀', label: 'Rocket',   vibe: 'Go bold',      profile: 'Adventurous' },
};

export const ARTICLES = {
  investing: {
    icon: '🌱',
    title: 'What is investing?',
    blurb: 'What it means to put your money to work.',
    body: [
      "Investing means using some of your money to buy small slices of companies and other assets that tend to grow in value over time.",
      "Instead of sitting still in your account, your money goes to work and can earn a little more over time. That growth is the point of it.",
      "You don't need to be rich or clever to start. SGD 50 is enough to plant your first flower. Small, regular amounts add up more than you'd think.",
      "What matters most is starting early and staying calm. Given enough time, even small amounts can grow a long way.",
    ],
  },
  risk: {
    icon: '🦊',
    title: 'What is risk?',
    blurb: 'Why a balanced choice suits most beginners.',
    body: [
      "Risk is a word for how bumpy the ride might be. Some choices stay steady. Others move up and down a lot from one day to the next.",
      "A steadier choice grows more slowly but feels calm. A bolder choice can grow faster, though you'll see bigger ups and downs along the way.",
      "For most people starting out, a balanced choice in the middle tends to feel comfortable. It grows enough to matter without too many sharp swings.",
      "Whatever you pick, the dips are normal. They happen to everyone and rarely mean you did anything wrong.",
    ],
  },
  money: {
    icon: '💸',
    title: 'Where does my money go?',
    blurb: 'Plain language, no jargon.',
    body: [
      "When you invest through Vela, your money is spread across many well-known companies and assets, so it never rides on a single bet.",
      "Spreading it out like this is called diversifying. It just means you don't put all your eggs in one basket, which softens the bumps.",
      "Your money is never locked away. You can take it out whenever you like, and you'll always see exactly how much you have.",
      "Every flower in your garden stands for a real piece of your money as it grows.",
    ],
  },
  compound: {
    icon: '🌳',
    title: 'Small amounts grow',
    blurb: 'Why starting early matters more than starting big.',
    body: [
      "When your money grows, the growth starts growing too. Next year you earn a little on this year's money and on this year's growth. Over many years, that snowballs.",
      "Here's an example. Say you put in SGD 50 a month, and it grows 5% a year. That rate is just for the example; real growth goes up and down and isn't guaranteed.",
      "Start at 23 and keep going until 60, and you'll have put in about SGD 22,200. With that growth, it could become about SGD 64,000.",
      "Start ten years later, at 33, and you'll have put in SGD 16,200. It could become about SGD 34,000. Waiting ten years costs you about SGD 30,000 of growth.",
      "The amount matters less than the time. Starting small, and starting now, gives your money the longest time to grow.",
    ],
  },
  rainyday: {
    icon: '☔',
    title: 'Rainy-day fund first',
    blurb: 'Keep a cushion before you invest more.',
    body: [
      "A rainy-day fund is money kept aside for surprises: a broken phone, a medical bill, a few weeks between jobs.",
      "Keep it in savings, not investments. Savings stay the same size, so the money is there in full on the day you need it.",
      "A good target is three to six months of what you spend. If that sounds like a lot, start with one month and build from there.",
      "Once you have a cushion, a dip in your investments is just a dip. You won't have to sell at a bad time to pay a bill.",
      "Your Savings Pot is a good home for it. Set it as your goal, and watch the bar fill up.",
    ],
  },
  dips: {
    icon: '🎢',
    title: 'Dips are normal',
    blurb: 'What to do when your investments go down.',
    body: [
      "Investments go up and down. Some weeks are red. Some years are red. That's normal, and it happens to everyone.",
      "Over long stretches, the ups have tended to outweigh the downs. But no one can say when a dip will start or end.",
      "Selling during a dip turns a drop on paper into a real loss. People who stayed put have usually done better than people who jumped in and out.",
      "Checking less often helps. Daily numbers are noisy; once a month is plenty. Your garden only cares that you keep planting.",
      "If a dip keeps you up at night, that's useful to know too. You can choose a steadier style in Settings at any time.",
    ],
  },
};

/* ---------- Themes (CSS variables) ---------- */
export const THEMES = {
  light: {
    label: 'Light', swatch: '#FFF8F5',
    vars: { '--bg': '#FFF8F5', '--card': '#FFFFFF', '--text': '#1C1C1C', '--subtle': '#7A8899',
            '--navy': '#1B2D4F', '--border': '#ECE3DD', '--soft': '#FBEEE8' },
  },
  dark: {
    label: 'Dark', swatch: '#0D1B2A',
    vars: { '--bg': '#0D1B2A', '--card': '#15273C', '--text': '#FFF8F5', '--subtle': '#92A1B4',
            '--navy': '#15273C', '--border': '#24364E', '--soft': '#1A2E45' },
  },
  moss: {
    label: 'Moss', swatch: '#0E1F17',
    vars: { '--bg': '#0E1F17', '--card': '#163022', '--text': '#EAF5EE', '--subtle': '#86AC95',
            '--navy': '#163022', '--border': '#244A33', '--soft': '#1B3A28' },
  },
};
