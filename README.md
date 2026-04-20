# rubezh-2026

Сайт-визитка гонки **МОТОКРОСС «Новый Рубеж 2.0»** · Бердянск · 25 апреля 2026.

Stack: **Astro 4 + Tailwind** → GitHub Pages.
Данные участников тянутся из Google Sheet бота `@Race_registration_bot` **раз в час** через GitHub Action.

Публично отображается только: **ФИО + класс + номер** (если есть).
Телефоны / Telegram / оплата — не публикуются.

---

## Страницы

- `/` — визитка: hero, классы, расписание
- `/participants` — список стартующих (поиск + фильтр по классам)
- `/stats` — статистика по классам, регистрации по дням

## Локально

```bash
npm install
npm run dev        # http://localhost:4321/rubezh-2026
npm run build      # → dist/
```

Seed participants.json пуст — страницы отрисуются с плейсхолдерами.

## Sync (локальный тест)

```bash
cd scripts
pip install -r requirements.txt
# положи service-account.json рядом ИЛИ экспортируй JSON:
export GOOGLE_SERVICE_ACCOUNT_JSON='{ ... }'
python sync_participants.py
```

Скрипт автоопределяет лист (ищет заголовок "ФИО"/"Имя"), синонимы колонок: `ФИО/Имя`, `Класс/Категория`, `Номер/#`, `Дата/timestamp`.

---

## Деплой (настройка один раз)

### 1. Создать репо и запушить
```bash
gh repo create born2be4/rubezh-2026 --public --source . --remote origin
git add . && git commit -m "init: rubezh-2026 landing"
git push -u origin main
```

### 2. Включить Pages
`Settings → Pages → Build and deployment → Source: GitHub Actions`

### 3. Добавить секреты (`Settings → Secrets → Actions`)
| Secret | Значение |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | весь JSON service account одной строкой |
| `SPREADSHEET_ID` (optional) | `14q5nidaUeAUsxoxfDn_L1wJrJFRe-i2eB3eEQApthv8` (дефолт уже в скрипте) |
| `WORKSHEET_NAME` (optional) | имя листа, если автопоиск не нравится |

Service account должен иметь **read access** на таблицу (Share → email из JSON → Viewer).

### 4. Первый запуск
`Actions → Sync participants → Run workflow` — вручную, чтобы сразу дернуть.
Дальше — ежечасно по cron. Если были изменения → commit → автодеплой через `Deploy to GitHub Pages`.

---

## URL

- Prod: `https://born2be4.github.io/rubezh-2026/`

Если понадобится кастомный домен — положить `public/CNAME` с именем домена и настроить DNS CNAME → `born2be4.github.io`.

---

## Архитектура потоков

```
┌──────────────────┐     ┌─────────────┐     ┌──────────────┐
│ Telegram bot     │ →   │ Google      │ →   │ GH Action    │
│ @Race_reg...     │     │ Sheet       │     │ cron 1h      │
└──────────────────┘     └─────────────┘     └──────┬───────┘
                                                    ↓
                                          src/data/participants.json
                                                    ↓
                                          ┌──────────────────┐
                                          │ Astro build      │
                                          │ → GH Pages       │
                                          └──────────────────┘
```

Приватные данные (телефон, TG, оплата) **не покидают Google Sheet** — фильтруются в `sync_participants.py`.
