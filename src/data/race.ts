export interface RaceClass {
  id: string;
  name: string;
  description: string;
  color: string; // tailwind class for accent
  icon: string;  // emoji/glyph
}

export const RACE = {
  title: 'Новый Рубеж',
  version: '2.0',
  subtitle: 'Мотокросс',
  edition: 'II этап',
  city: 'Бердянск',
  date: '25 апреля 2026',
  dateShort: '25.04.2026',
  dateISO: '2026-04-25',
  registrationBot: 'https://t.me/Race_registration_bot',
  paymentUrl: 'https://messenger.online.sberbank.ru/sl/Bg0r0SOoMu7nuz7Xd',
  organizer: 'Мотоклуб «Новый Рубеж»',
  email: 'race@newfrontier.moto',
};

export const CLASSES: RaceClass[] = [
  {
    id: 'kids',
    name: 'Дети',
    description: '50–85 cc · до 12 лет',
    color: 'from-yellow-400 to-orange-500',
    icon: '🧒',
  },
  {
    id: 'ladies',
    name: 'Леди',
    description: 'Женский зачёт',
    color: 'from-pink-500 to-rose-600',
    icon: '🏁',
  },
  {
    id: 'master',
    name: 'Мастер 45±',
    description: 'Ветераны',
    color: 'from-slate-300 to-slate-500',
    icon: '🛠',
  },
  {
    id: 'amateur',
    name: 'Любители',
    description: 'Непрофессиональный зачёт',
    color: 'from-emerald-500 to-teal-600',
    icon: '⚙️',
  },
  {
    id: 'open',
    name: 'Открытый',
    description: 'Без ограничений',
    color: 'from-red-500 to-red-700',
    icon: '🔥',
  },
];

export function classById(id: string): RaceClass | undefined {
  return CLASSES.find(c => c.id === id);
}

export function classByName(name: string): RaceClass | undefined {
  const n = name.trim().toLowerCase();
  return CLASSES.find(c => c.name.toLowerCase() === n || n.includes(c.name.toLowerCase()));
}

export const SCHEDULE = [
  { time: '08:00', event: 'Открытие паддока · техкомиссия' },
  { time: '09:00', event: 'Регистрация участников' },
  { time: '09:30', event: 'Брифинг' },
  { time: '10:00', event: 'НАЧАЛО · Тренировки + заезды' },
  { time: '16:30', event: 'Награждение' },
];

export interface Partner { id: string; name: string; url?: string; }
export const PARTNERS: Partner[] = [
  { id: 'voskhozhdenie', name: 'Восхождение' },
  { id: 'bse',           name: 'BSE' },
  { id: 'dr21',          name: 'DR21 · Dirt Riders' },
  { id: 'mvc',           name: 'МВЦ Мариуполь' },
];
