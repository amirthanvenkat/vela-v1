import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import { PhoneFrame, useFrameMode } from './components/PhoneFrame';
import { AppCtx } from './context';
import { FLOWERS, RISKS, THEMES } from './data';
import { BOOT, BOOT_SCREEN, INSTANT, ROUTE, STORE_KEY, SAVED, bootGoal, seedActivity } from './lib/boot';
import { SCREEN_TAB, ONBOARDING, NAV_HIDDEN, DARK_TOP, TABS } from './routes';
import { Home } from './screens/Home';
import { InvestHome, InvestConfirm, InvestSuccess } from './screens/Invest';
import { LearnHome, LearnArticle } from './screens/Learn';
import { Splash, Welcome, RiskQuestion, NameInput, GardenIntro } from './screens/Onboarding';
import { SaveHome, AddMoney, SetGoal, SaveConfirm } from './screens/Save';
import { Settings } from './screens/Settings';

function initialStack() {
  if (BOOT_SCREEN) return [{ screen: BOOT_SCREEN, params: { amt: Number(BOOT.amt) || undefined, id: BOOT.id } }];
  if (SAVED && SAVED.onboarded) {
    const tab = TABS.some((t) => t.key === ROUTE) ? ROUTE : 'home';
    return [{ screen: tab, params: {} }];
  }
  return [{ screen: 'splash', params: {} }];
}

function renderScreen(screen, params) {
  switch (screen) {
    case 'splash': return <Splash />;
    case 'welcome': return <Welcome />;
    case 'risk': return <RiskQuestion />;
    case 'retakeRisk': return <RiskQuestion retake />;
    case 'name': return <NameInput />;
    case 'gardenIntro': return <GardenIntro />;
    case 'home': return <Home />;
    case 'save': return <SaveHome />;
    case 'addMoney': return <AddMoney />;
    case 'setGoal': return <SetGoal />;
    case 'saveConfirm': return <SaveConfirm amt={params.amt} />;
    case 'invest': return <InvestHome />;
    case 'investConfirm': return <InvestConfirm />;
    case 'investSuccess': return <InvestSuccess amt={params.amt} />;
    case 'learn': return <LearnHome />;
    case 'learnArticle': return <LearnArticle id={params.id} />;
    case 'settings': return <Settings />;
    default: return <Home />;
  }
}

function App() {
  const S = SAVED || {};
  const bootFlowers = FLOWERS.slice(0, parseInt(BOOT.flowers, 10) || 0);
  // Persistent app state (mocked demo data, optionally seeded via BOOT deep link)
  const [name, setName] = useState(S.name || BOOT.name || 'Maya');
  const [balance, setBalance] = useState(S.balance ?? 1240.0);
  const [savings, setSavings] = useState(S.savings ?? 320.0);
  const [risk, setRisk] = useState(RISKS[S.risk] ? S.risk : RISKS[BOOT.risk] ? BOOT.risk : 'fox');
  const [flowers, setFlowers] = useState(S.flowers || bootFlowers);
  const [invested, setInvested] = useState(S.invested ?? bootFlowers.length * 50);
  const [theme, setTheme] = useState(THEMES[S.theme] ? S.theme : THEMES[BOOT.theme] ? BOOT.theme : 'light');
  const [goal, setGoal] = useState(S.goal !== undefined ? S.goal : bootGoal());
  const [activity, setActivity] = useState(S.activity || seedActivity);
  const [seenAt, setSeenAt] = useState(S.seenAt || 0);
  const [onboarded, setOnboarded] = useState(!!S.onboarded);
  const frame = useFrameMode();
  const [overlayEl, setOverlayEl] = useState(null);

  useEffect(() => {
    if (INSTANT) return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({
        name, balance, savings, risk, flowers, invested, theme, goal, activity, seenAt, onboarded,
      }));
    } catch (e) { /* private mode or storage blocked: the demo still works, it just won't remember */ }
  }, [name, balance, savings, risk, flowers, invested, theme, goal, activity, seenAt, onboarded]);

  // Navigation stack, mirrored into browser history so the back button stays inside the app.
  // Each history entry carries a snapshot of the stack; popstate restores it.
  const [stack, setStack] = useState(initialStack);
  const [dir, setDir] = useState(1);
  const stackRef = useRef(stack);
  const seqRef = useRef(0);
  const onboardedRef = useRef(onboarded);
  onboardedRef.current = onboarded;

  const commit = useCallback((next, direction, mode = 'push') => {
    stackRef.current = next;
    setDir(direction);
    setStack(next);
    if (mode === 'push') seqRef.current += 1;
    const top = next[next.length - 1].screen;
    try { window.history[mode === 'push' ? 'pushState' : 'replaceState']({ vela: true, stack: next, seq: seqRef.current }, '', '#/' + top); } catch (e) {}
  }, []);

  useEffect(() => {
    // Tag the entry we booted on (deep links keep their URL so a refresh reproduces them).
    // After a refresh, keep the entry's position so back/forward animations still point the right way.
    const prev = window.history.state;
    seqRef.current = prev && prev.vela ? prev.seq : 0;
    try { window.history.replaceState({ vela: true, stack: stackRef.current, seq: seqRef.current }, '', INSTANT ? undefined : '#/' + stackRef.current[0].screen); } catch (e) {}
    const onPop = (e) => {
      const st = e.state;
      if (!st || !st.vela) return;
      let next = st.stack;
      // Once onboarded, don't let the back button drop you into the onboarding screens again.
      if (onboardedRef.current && ONBOARDING.includes(next[next.length - 1].screen)) {
        next = [{ screen: 'home', params: {} }];
        try { window.history.replaceState({ ...st, stack: next }, '', '#/home'); } catch (err) {}
      }
      setDir(st.seq < seqRef.current ? -1 : 1);
      seqRef.current = st.seq;
      stackRef.current = next;
      setStack(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const current = stack[stack.length - 1];
  const tab = SCREEN_TAB[current.screen] || null;
  const showNav = tab !== null && !ONBOARDING.includes(current.screen) && !NAV_HIDDEN.includes(current.screen);

  // { replace: true } swaps out the current screen (used after a confirm step, so Back can't resubmit it).
  const navigate = useCallback((screen, direction = 1, params = {}, { replace = false } = {}) => {
    const base = replace ? stackRef.current.slice(0, -1) : stackRef.current;
    commit([...base, { screen, params }], direction, replace ? 'replace' : 'push');
  }, [commit]);
  const back = useCallback(() => {
    const s = stackRef.current;
    if (s.length > 1 && window.history.state && window.history.state.vela) window.history.back();
    else commit(s.length > 1 ? s.slice(0, -1) : [{ screen: SCREEN_TAB[s[0].screen] || 'home', params: {} }], -1, 'replace');
  }, [commit]);
  const goTab = useCallback((tabKey) => commit([{ screen: tabKey, params: {} }], 1), [commit]);
  const resetTo = useCallback((screen) => commit([{ screen, params: {} }], 1, 'replace'), [commit]);
  const finishOnboarding = useCallback(() => { setOnboarded(true); commit([{ screen: 'home', params: {} }], 1, 'replace'); }, [commit]);

  const log = (type, label, amount) =>
    setActivity((a) => [{ id: Date.now() + '-' + a.length, type, label, amount, at: Date.now() }, ...a].slice(0, 30));
  const addToSavings = useCallback((amt) => {
    setSavings((s) => s + amt); setBalance((b) => b - amt);
    log('save', 'Moved to your Savings Pot', amt);
  }, []);
  const plantFlower = useCallback((amt) => {
    setFlowers((f) => [...f, FLOWERS[f.length % FLOWERS.length]]);
    setBalance((b) => b - amt); setInvested((i) => i + amt);
    log('invest', 'Planted a flower', amt);
  }, []);
  const setGoalTo = useCallback((g) => {
    setGoal(g);
    if (g) log('goal', `Goal set: ${g.name}`, g.target);
  }, []);
  const markSeen = useCallback(() => setSeenAt(Date.now()), []);
  const resetDemo = useCallback(() => {
    try { window.localStorage.removeItem(STORE_KEY); } catch (e) {}
    window.location.replace(window.location.pathname + window.location.search);
  }, []);

  const ctx = {
    name, setName, balance, savings, addToSavings, risk, setRisk, flowers, plantFlower, invested,
    goal, setGoalTo, activity, seenAt, markSeen, overlayEl, theme, setTheme, current: { ...current, tab },
    navigate, back, goTab, resetTo, finishOnboarding, resetDemo,
  };

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0.6 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-30%' : '30%', opacity: 0 }),
  };

  const screen = (
    <div className={'relative w-full overflow-hidden ' + (frame ? 'h-full' : 'h-[100dvh] max-w-[420px]')}
      style={{ ...THEMES[theme].vars, '--safe-bottom': frame ? '34px' : 'env(safe-area-inset-bottom, 0px)', background: 'var(--bg)' }}>
      <AnimatePresence custom={dir} mode="wait" initial={false}>
        <motion.div key={current.screen + JSON.stringify(current.params)}
          custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
          transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0">
          {renderScreen(current.screen, current.params)}
        </motion.div>
      </AnimatePresence>

      {showNav && <BottomNav />}
      <div ref={setOverlayEl} className="pointer-events-none absolute inset-0 z-40" />
    </div>
  );

  return (
    <AppCtx.Provider value={ctx}>
      <MotionConfig reducedMotion="user">
        {frame ? (
          <PhoneFrame light={theme !== 'light' || DARK_TOP.includes(current.screen)}>{screen}</PhoneFrame>
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ background: '#0a0f17' }}>{screen}</div>
        )}
      </MotionConfig>
    </AppCtx.Provider>
  );
}
export default App;
