import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Navigate, useLocation, useNavigate, useNavigationType, useParams, useRoutes } from 'react-router';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { BottomNav } from './components/BottomNav';
import { PhoneFrame, useFrameMode } from './components/PhoneFrame';
import { AppCtx, useApp } from './context';
import { FLOWERS, RISKS, THEMES } from './data';
import { BOOT, INSTANT, STORE_KEY, SAVED, bootGoal, seedActivity } from './lib/boot';
import { demoFlowers, normalizeFlowers } from './lib/garden';
import { SCREEN_TAB, ONBOARDING, NAV_HIDDEN, DARK_TOP, SCREEN_PATHS, pathFor, screenFromPath } from './routes';
import { Home } from './screens/Home';
import { InvestHome, InvestConfirm, InvestSuccess } from './screens/Invest';
import { LearnHome, LearnArticle } from './screens/Learn';
import { Splash, Welcome, RiskQuestion, NameInput, GardenIntro } from './screens/Onboarding';
import { SaveHome, AddMoney, SetGoal, SaveConfirm } from './screens/Save';
import { Settings } from './screens/Settings';

// One route per screen. `search` is passed in (not read from the live URL) so a screen that is
// sliding out keeps showing its own params, e.g. the amount on a confirmation screen.
function ScreenRoute({ screen, search }) {
  const { onboarded } = useApp();
  const { id } = useParams();
  if (!INSTANT) {
    // Once onboarded, Back can't drop you into onboarding again; before that, the app starts at the splash.
    if (onboarded && ONBOARDING.includes(screen)) return <Navigate to="/home" replace />;
    if (!onboarded && !ONBOARDING.includes(screen)) return <Navigate to="/" replace />;
  }
  const amt = Number(new URLSearchParams(search).get('amt')) || undefined;
  return renderScreen(screen, { id, amt });
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
  const bootFlowers = demoFlowers(FLOWERS, parseInt(BOOT.flowers, 10) || 0,
    (BOOT.ages || '').split(',').filter(Boolean).map(Number).filter((d) => d >= 0), Date.now());
  // Persistent app state (mocked demo data, optionally seeded via BOOT deep link)
  const [name, setName] = useState(S.name || BOOT.name || 'Maya');
  const [balance, setBalance] = useState(S.balance ?? 1240.0);
  const [savings, setSavings] = useState(S.savings ?? 320.0);
  const [risk, setRisk] = useState(RISKS[S.risk] ? S.risk : RISKS[BOOT.risk] ? BOOT.risk : 'fox');
  const [flowers, setFlowers] = useState(() => (S.flowers ? normalizeFlowers(S.flowers) : bootFlowers));
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

  // Navigation runs on React Router (hash URLs). Screens call these helpers by screen name.
  const location = useLocation();
  const navType = useNavigationType();
  const routerNavigate = useNavigate();
  const found = screenFromPath(location.pathname);
  const current = found ? found.screen : 'home';
  const tab = SCREEN_TAB[current] || null;
  const showNav = tab !== null && !ONBOARDING.includes(current) && !NAV_HIDDEN.includes(current);

  // Slide direction: pushes carry it in location state; for Back/Forward (POP) compare the router's
  // history index with the previous one. Computed once per location so re-renders can't flip it.
  const historyIdx = () => (window.history.state && window.history.state.idx) || 0;
  const prevIdx = useRef(historyIdx());
  const dir = useMemo(() => {
    if (navType === 'POP') return historyIdx() < prevIdx.current ? -1 : 1;
    return (location.state && location.state.dir) || 1;
  }, [location.key]);
  useEffect(() => { prevIdx.current = historyIdx(); }, [location.key]);

  // { replace: true } swaps out the current screen (used after a confirm step, so Back can't resubmit it).
  const navigate = useCallback((screen, direction = 1, params = {}, { replace = false } = {}) => {
    routerNavigate(pathFor(screen, params), { replace, state: { dir: direction } });
  }, [routerNavigate]);
  const back = useCallback(() => {
    // Go back through the app's own history; if this screen was opened directly, go up to its tab.
    if (historyIdx() > 0) routerNavigate(-1);
    else routerNavigate(pathFor(SCREEN_TAB[current] || 'home'), { replace: true, state: { dir: -1 } });
  }, [routerNavigate, current]);
  const goTab = useCallback((tabKey) => navigate(tabKey), [navigate]);
  const resetTo = useCallback((screen) => navigate(screen, 1, {}, { replace: true }), [navigate]);
  const finishOnboarding = useCallback(() => { setOnboarded(true); navigate('home', 1, {}, { replace: true }); }, [navigate]);

  const routes = useMemo(() => [
    ...Object.entries(SCREEN_PATHS).map(([screen, path]) => ({
      path, element: <ScreenRoute screen={screen} search={location.search} />,
    })),
    { path: '*', element: <Navigate to="/" replace /> },
  ], [location.search]);
  const element = useRoutes(routes, location);

  const log = (type, label, amount) =>
    setActivity((a) => [{ id: Date.now() + '-' + a.length, type, label, amount, at: Date.now() }, ...a].slice(0, 30));
  const addToSavings = useCallback((amt) => {
    setSavings((s) => s + amt); setBalance((b) => b - amt);
    log('save', 'Moved to your Savings Pot', amt);
  }, []);
  const plantFlower = useCallback((amt) => {
    setFlowers((f) => [...f, { kind: FLOWERS[f.length % FLOWERS.length], plantedAt: Date.now() }]);
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
    goal, setGoalTo, activity, seenAt, markSeen, overlayEl, theme, setTheme, onboarded, current: { screen: current, tab },
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
        <motion.div key={location.pathname + location.search}
          custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
          transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0">
          {element}
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
          <PhoneFrame light={theme !== 'light' || DARK_TOP.includes(current)}>{screen}</PhoneFrame>
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ background: '#0a0f17' }}>{screen}</div>
        )}
      </MotionConfig>
    </AppCtx.Provider>
  );
}
export default App;
