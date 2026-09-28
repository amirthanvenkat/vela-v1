import { IconBubble, Button, Card, ScreenHeader } from '../components/ui';
import { useApp } from '../context';
import { ARTICLES } from '../data';

/* ---- Learn flow ---- */
export function LearnHome() {
  const { navigate } = useApp();
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-nav" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="Learn" />
      <div className="space-y-3 px-5">
        <p className="text-[14px]" style={{ color: 'var(--subtle)' }}>Three short reads, in plain language.</p>
        {Object.values(ARTICLES).map((a) => (
          <Card key={a.title} onClick={() => navigate('learnArticle', 1, { id: a.title })} label={a.title} className="flex items-center gap-3">
            <IconBubble size={50} tone="glass">{a.icon}</IconBubble>
            <div className="flex-1">
              <p className="font-serif text-[16px] font-semibold" style={{ color: 'var(--text)' }}>{a.title}</p>
              <p className="text-[12.5px]" style={{ color: 'var(--subtle)' }}>{a.blurb}</p>
            </div>
            <span aria-hidden="true" style={{ color: 'var(--subtle)' }}>→</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LearnArticle({ id }) {
  const { back } = useApp();
  const a = Object.values(ARTICLES).find((x) => x.title === id) || ARTICLES.investing;
  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-nav" style={{ background: 'var(--bg)' }}>
      <ScreenHeader title="" onBack={back} />
      <div className="px-6">
        <IconBubble size={84} tone="glass">{a.icon}</IconBubble>
        <h1 className="mt-5 font-serif text-[30px] font-semibold leading-tight" style={{ color: 'var(--text)' }}>{a.title}</h1>
        <div className="mt-4 space-y-4">
          {a.body.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed" style={{ color: 'var(--text)' }}>{p}</p>
          ))}
        </div>
        <div className="mt-8">
          <Button variant="outline" onClick={back}>Got it</Button>
        </div>
      </div>
    </div>
  );
}
