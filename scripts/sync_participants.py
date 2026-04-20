#!/usr/bin/env python3
"""
sync_participants.py
Забирает список участников из Google Sheet бота,
фильтрует публичные поля (ФИО + класс + номер) и пишет src/data/participants.json.

ENV (две поддерживаемые схемы):
  A) GOOGLE_SERVICE_ACCOUNT_JSON — весь JSON service account
  B) GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY (base64 или raw PEM)
  SPREADSHEET_ID  — ID таблицы (default: race bot sheet)
  WORKSHEET_NAME  — имя листа (default: auto — первый с 'ФИО'/'Имя')
"""
from __future__ import annotations
import base64, json, os, sys, re
from datetime import datetime, timezone
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials

ROOT = Path(__file__).resolve().parents[1]
OUT  = ROOT / "src" / "data" / "participants.json"

SPREADSHEET_ID = os.environ.get("SPREADSHEET_ID", "1KcB8loBBpQaionRSkIJrcsLIsMiYHIUpFDm9jKWIMOw")
WORKSHEET_NAME = os.environ.get("WORKSHEET_NAME", "Лист1")
# Публично — только подтверждённые записи.
ALLOWED_STATUSES = {"подтверждено"}
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# синонимы колонок (любые из этих имён подойдут)
NAME_KEYS   = {"фио", "имя", "name", "full name", "full_name", "участник"}
CLASS_KEYS  = {"класс", "class", "категория", "зачёт", "зачет"}
NUMBER_KEYS = {"номер", "#", "number", "num", "start", "старт"}
DATE_KEYS   = {"дата", "date", "registeredat", "registered_at", "timestamp", "время"}

def _decode_private_key(raw: str) -> str:
    s = raw.strip()
    if "BEGIN PRIVATE KEY" in s:
        return s.replace("\\n", "\n")
    # base64 PEM
    try:
        return base64.b64decode(s).decode("utf-8")
    except Exception:
        return s

def load_creds():
    raw = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON")
    email = os.environ.get("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    pkey  = os.environ.get("GOOGLE_PRIVATE_KEY")
    if raw:
        info = json.loads(raw)
    elif email and pkey:
        info = {
            "type": "service_account",
            "project_id": email.split("@")[-1].split(".")[0],
            "private_key": _decode_private_key(pkey),
            "client_email": email,
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    else:
        fp = ROOT / "scripts" / "service-account.json"
        if not fp.exists():
            print("ERROR: no creds (JSON/email+key/service-account.json)", file=sys.stderr)
            sys.exit(1)
        info = json.loads(fp.read_text())
    return Credentials.from_service_account_info(info, scopes=SCOPES)

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip()).lower()

def pick(row_dict: dict, keys: set[str]) -> str | None:
    for k, v in row_dict.items():
        if norm(k) in keys and v not in (None, ""):
            return str(v).strip()
    return None

def main():
    creds = load_creds()
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SPREADSHEET_ID)

    # выбираем лист
    ws = None
    if WORKSHEET_NAME:
        ws = sh.worksheet(WORKSHEET_NAME)
    else:
        # ищем первый лист с ФИО/Имя в заголовке
        for w in sh.worksheets():
            header = [norm(c) for c in w.row_values(1)]
            if any(h in NAME_KEYS for h in header):
                ws = w
                break
        if ws is None:
            ws = sh.sheet1

    rows = ws.get_all_records()  # list[dict]
    participants = []
    pending = 0  # на проверке — счётчик без ФИО
    for r in rows:
        name  = pick(r, NAME_KEYS)
        klass = pick(r, CLASS_KEYS)
        if not name or not klass:
            continue
        # фильтр: валидное ФИО (минимум 2 слова по 2+ символа)
        parts = [p for p in re.split(r"\s+", name) if len(p) >= 2]
        if len(parts) < 2:
            continue
        status = (pick(r, {"статус", "status"}) or "").lower()
        if status == "на проверке":
            pending += 1
            continue
        if status not in ALLOWED_STATUSES:
            continue
        num  = pick(r, NUMBER_KEYS)
        date = pick(r, DATE_KEYS)
        participants.append({
            "name": name,
            "class": klass,
            "number": num,
            "status": status or None,
            "registeredAt": date,
        })

    payload = {
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": f"gsheet:{SPREADSHEET_ID[:8]}…/{ws.title}",
        "total": len(participants),
        "pending": pending,
        "participants": participants,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"[ok] wrote {len(participants)} participants → {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
