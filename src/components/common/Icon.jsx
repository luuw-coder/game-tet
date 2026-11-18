const P = {
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z',
  bell: 'M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7z M10 20a2 2 0 0 0 4 0',
  sliders: 'M4 7h10 M18 7h2 M4 17h2 M10 17h10 M14 5v4 M6 15v4',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5L19 19 M5 19l1.5-1.5 M17.5 6.5L19 5',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4',
  send: 'M4 12l16-8-6 16-3-7-7-1z',
  close: 'M6 6l12 12 M18 6L6 18',
  logout: 'M10 4H5v16h5 M15 8l4 4-4 4 M19 12H9',
};
export default function Icon({ name, size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}

export function Logo({ size = 30 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <g fill="var(--accent-ink)"><circle cx="11" cy="11" r="3.2" /><circle cx="21" cy="11" r="3.2" /><circle cx="11" cy="21" r="3.2" /><circle cx="21" cy="21" r="3.2" /></g>
    </svg>
  );
}

export const Avatar = ({ name, size = 'sm' }) => (
  <span className={`avatar ${size}`} aria-hidden="true">{(name || '?').trim().charAt(0).toUpperCase()}</span>
);
