import { useState, useEffect } from 'react';
import { BOOT } from '../lib/boot';

/* ======================================================================
   PHONE FRAME (desktop only)
====================================================================== */
export const SCREEN_W = 390, SCREEN_H = 844, BEZEL = 12;
export const DEVICE_W = SCREEN_W + BEZEL * 2, DEVICE_H = SCREEN_H + BEZEL * 2;
export const FRAME_QUERY = '(min-width: 600px) and (min-height: 640px)';

export function useFrameMode() {
  const forced = BOOT.frame === '0' ? false : BOOT.frame === '1' ? true : null;
  const [on, setOn] = useState(() => forced ?? window.matchMedia(FRAME_QUERY).matches);
  useEffect(() => {
    if (forced !== null) return;
    const mq = window.matchMedia(FRAME_QUERY);
    const onChange = (e) => setOn(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return on;
}

// Scale the whole device so it always fits the browser window; the screen inside stays 390x844.
export function useFitScale() {
  const calc = () => Math.min(1, (window.innerHeight - 72) / DEVICE_H, (window.innerWidth - 32) / DEVICE_W);
  const [scale, setScale] = useState(calc);
  useEffect(() => {
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return scale;
}

export function StatusBar({ light }) {
  const c = light ? '#FFFFFF' : '#1C1C1C';
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-50 flex h-[47px] items-center justify-between pl-[34px] pr-[26px] pt-[6px]"
      style={{ color: c, transition: 'color .3s' }} aria-hidden="true">
      <span className="text-[16px] font-semibold tracking-[-0.01em]" style={{ fontFamily: '"DM Sans", system-ui' }}>9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .4 10.3 10.3 0 0 0 .8 3.3L2 4.6a8.5 8.5 0 0 1 6-2.4z" />
          <path d="M8 5.6c1.4 0 2.6.5 3.6 1.4l1.2-1.3A7 7 0 0 0 8 3.8a7 7 0 0 0-4.8 1.9L4.4 7c1-.9 2.2-1.4 3.6-1.4z" />
          <path d="M8 9.1c.5 0 1 .2 1.3.5L8 11.6 6.7 9.6c.3-.3.8-.5 1.3-.5z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45" />
        </svg>
      </div>
    </div>
  );
}

export function PhoneFrame({ light, children }) {
  const scale = useFitScale();
  const side = (style) => (
    <div className="absolute w-[3px] rounded-sm" style={{ background: 'linear-gradient(90deg,#4a4f58,#2a2d33)', ...style }} />
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(1100px 620px at 50% -10%, #1f3358 0%, #0a0f17 62%)' }}>
      <div style={{ width: DEVICE_W * scale, height: DEVICE_H * scale }}>
        <div className="relative" style={{ width: DEVICE_W, height: DEVICE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {/* Side buttons */}
          {side({ left: -3, top: 118, height: 32 })}
          {side({ left: -3, top: 178, height: 62 })}
          {side({ left: -3, top: 252, height: 62 })}
          {side({ right: -3, top: 208, height: 96 })}
          {/* Bezel */}
          <div className="absolute inset-0 rounded-[58px]"
            style={{ background: 'linear-gradient(145deg,#30343c 0%,#111318 45%,#22252b 100%)', padding: BEZEL,
                     boxShadow: '0 0 0 1.5px #454a53, 0 0 0 3px #111317, 0 50px 90px -24px rgba(0,0,0,.8), 0 24px 40px -20px rgba(0,0,0,.6), inset 0 0 3px rgba(255,255,255,.18)' }}>
            {/* Screen */}
            <div className="relative overflow-hidden rounded-[46px] bg-black"
              style={{ width: SCREEN_W, height: SCREEN_H, isolation: 'isolate', transform: 'translateZ(0)' }}>
              {children}
              <StatusBar light={light} />
              <div className="pointer-events-none absolute left-1/2 top-[11px] z-50 h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
              <div className="pointer-events-none absolute bottom-[8px] left-1/2 z-50 h-[5px] w-[134px] -translate-x-1/2 rounded-full"
                style={{ background: light ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.8)', transition: 'background .3s' }} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-5 text-[12px] tracking-wide" style={{ color: '#6f7d90' }}>
        VELA prototype · open it on your phone for the full experience
      </p>
    </div>
  );
}
