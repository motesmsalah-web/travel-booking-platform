import type { Config } from 'tailwindcss';
const config: Config = { darkMode: ['class'], content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { fontFamily: { cairo: ['var(--font-cairo)', 'sans-serif'] }, colors: { navy: '#0B1F3A', gold: '#C8A24A' }, boxShadow: { soft: '0 18px 50px rgba(11,31,58,.12)' } } }, plugins: [] };
export default config;
