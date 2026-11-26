"""Regenerate the embedded archive links from each language manifest."""
from html import escape
import json
from pathlib import Path
import re
from datetime import date

docs = Path(__file__).resolve().parent / "docs"
for language in ("en", "pt-br"):
    directory = docs / language
    manifest = json.loads((directory / "issues.json").read_text(encoding="utf-8"))
    entries = {}
    for entry in manifest:
        day = entry["date"]
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", day) or date.fromisoformat(day).isoformat() != day:
            raise ValueError(f"Invalid issue date: {day}")
        if not (directory / "issues" / f"{day}.pdf").is_file():
            raise FileNotFoundError(f"{language}: {day}.pdf")
        if day in entries:
            raise ValueError(f"{language}: duplicate date {day}")
        entries[day] = entry["title"]
    links = "\n".join(
        f'<li><a href="./issues/{day}.pdf">{day} · {escape(entries[day])}</a></li>'
        for day in sorted(entries, reverse=True)
    )
    page = directory / "index.html"
    html, count = re.subn(r'(<ul id="archive">).*?(</ul>)', lambda match: match[1] + "\n" + links + "\n" + match[2],
                          page.read_text(encoding="utf-8"), flags=re.S)
    if count != 1:
        raise ValueError(f"{language}: archive markup missing or duplicated")
    page.write_text(html, encoding="utf-8")
