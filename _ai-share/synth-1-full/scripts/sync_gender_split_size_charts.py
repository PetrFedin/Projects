#!/usr/bin/env python3
"""Build women's base JSON + men's *-men.json from sizes.ts + outerwear-men + dresses + women outerwear."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "public/data"
SIZES_TS = ROOT / "src/lib/sizes.ts"

SCALE_KEYS = ("IT", "FR", "EU", "US", "RU", "Alpha", "height")


def _parse_block(const_name: str) -> list[dict[str, str]]:
    text = SIZES_TS.read_text(encoding="utf-8")
    m = re.search(rf"const {const_name} = \[(.*?)\]\s*as const;", text, re.S)
    if not m:
        raise SystemExit(f"{const_name} not found")
    keys = (
        "IT", "FR", "EU", "US", "RU", "Alpha", "height",
        "bust", "waist", "hips", "shoulder", "sleeve",
        "armCircumference", "length",
    )
    rows: list[dict[str, str]] = []
    for line in m.group(1).strip().split("\n"):
        line = line.strip().rstrip(",")
        if not line.startswith("{"):
            continue
        d: dict[str, str] = {}
        for key in keys:
            mm = re.search(rf"{key}:\s*'([^']*)'", line)
            if mm:
                d[key] = mm.group(1)
        rows.append(d)
    return rows


def parse_range(s: str) -> tuple[float, float] | None:
    s = s.replace("–", "-")
    m = re.match(r"(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)", s)
    if not m:
        return None
    return (
        float(m[1].replace(",", ".")),
        float(m[2].replace(",", ".")),
    )


def fmt(lo: float, hi: float) -> str:
    a, b = round(lo), round(hi)
    if a > b:
        a, b = b, a
    return f"{a}–{b}"


def mid(r: tuple[float, float]) -> float:
    return (r[0] + r[1]) / 2


def shirt_tz_fields(bust: str, arm_circ: str) -> dict[str, str]:
    b = parse_range(bust)
    if not b:
        return {}
    ac = parse_range(arm_circ) if arm_circ else None
    if ac:
        return {
            "neckCircumference": fmt(b[0] * 0.405 - 1, b[1] * 0.412 + 0.5),
            "armholeDepth": fmt(b[0] * 0.22, b[1] * 0.26),
            "bicepsCircumference": fmt(ac[0] + 4, ac[1] + 6),
            "wristCircumference": fmt(b[0] * 0.185, b[1] * 0.2),
            "cuffOpening": fmt(mid(ac) * 0.88, mid(ac) * 0.95),
        }
    return {
        "neckCircumference": fmt(b[0] * 0.405 - 1, b[1] * 0.412 + 0.5),
        "armholeDepth": fmt(b[0] * 0.22, b[1] * 0.26),
        "bicepsCircumference": fmt(b[0] * 0.35, b[1] * 0.39),
        "wristCircumference": fmt(b[0] * 0.185, b[1] * 0.2),
        "cuffOpening": fmt(b[0] * 0.31, b[1] * 0.34),
    }


def scale_range(s: str, factor: float) -> str:
    p = parse_range(s)
    if not p:
        return s
    return fmt(p[0] * factor, p[1] * factor)


def shift_range(s: str, dlo: float, dhi: float | None = None) -> str:
    if dhi is None:
        dhi = dlo
    p = parse_range(s)
    if not p:
        return s
    return fmt(p[0] + dlo, p[1] + dhi)


def build_men(outer: list[dict[str, str]], shirts: list[dict[str, str]]) -> dict[str, list[dict[str, str]]]:
    suits = outer.copy()

    tops: list[dict[str, str]] = []
    for o, sh in zip(outer, shirts, strict=True):
        tz = shirt_tz_fields(sh["bust"], sh["armCircumference"])
        tops.append(
            {
                "IT": o["IT"],
                "FR": o["FR"],
                "EU": o["EU"],
                "US": o["US"],
                "RU": o["RU"],
                "Alpha": o["Alpha"],
                "height": o["height"],
                "bust": o["bust"],
                "waist": o["waist"],
                "hips": o["hips"],
                "shoulder": o["shoulder"],
                "sleeve": sh["sleeve"],
                "length": sh["length"],
                "neckCircumference": tz["neckCircumference"],
                "armholeDepth": tz["armholeDepth"],
                "bicepsCircumference": tz["bicepsCircumference"],
                "wristCircumference": tz["wristCircumference"],
                "armCircumference": sh["armCircumference"],
                "cuffOpening": tz["cuffOpening"],
            }
        )

    knit: list[dict[str, str]] = []
    for o, sh in zip(outer, shirts, strict=True):
        knit.append(
            {
                "IT": o["IT"],
                "FR": o["FR"],
                "EU": o["EU"],
                "US": o["US"],
                "RU": o["RU"],
                "Alpha": o["Alpha"],
                "height": o["height"],
                "bust": o["bust"],
                "waist": o["waist"],
                "hips": o["hips"],
                "length": sh["length"],
                "shoulder": o["shoulder"],
                "sleeve": sh["sleeve"],
                "neckCircumference": o["neckCircumference"],
                "armholeDepth": o["armholeDepth"],
                "bicepsCircumference": o["bicepsCircumference"],
                "wristCircumference": o["wristCircumference"],
                "hemCircumference": o["hemCircumference"],
            }
        )

    def _load_leg_template(primary: str, fallback: str) -> list[dict[str, str]]:
        p = DATA / f"size-chart-{primary}.json"
        if p.exists():
            return json.loads(p.read_text(encoding="utf-8"))
        return json.loads((DATA / f"size-chart-{fallback}.json").read_text(encoding="utf-8"))

    old_j = _load_leg_template("jeans-men", "jeans")
    old_tr = _load_leg_template("trousers-men", "trousers")
    old_sp = _load_leg_template("sportswear-men", "sportswear")

    jeans: list[dict[str, str]] = []
    trousers: list[dict[str, str]] = []
    for i, o in enumerate(outer):
        jb = old_j[i] if i < len(old_j) else old_j[-1]
        tb = old_tr[i] if i < len(old_tr) else old_tr[-1]
        jeans.append(
            {
                "IT": o["IT"],
                "FR": o["FR"],
                "EU": o["EU"],
                "US": o["US"],
                "RU": o["RU"],
                "Alpha": o["Alpha"],
                "height": o["height"],
                "waist": o["waist"],
                "hips": o["hips"],
                "rise": jb["rise"],
                "inseam": jb["inseam"],
                "thighCircumference": jb["thighCircumference"],
            }
        )
        trousers.append(
            {
                "IT": o["IT"],
                "FR": o["FR"],
                "EU": o["EU"],
                "US": o["US"],
                "RU": o["RU"],
                "Alpha": o["Alpha"],
                "height": o["height"],
                "waist": o["waist"],
                "hips": o["hips"],
                "rise": tb["rise"],
                "inseam": tb["inseam"],
                "kneeWidth": tb["kneeWidth"],
            }
        )

    sport: list[dict[str, str]] = []
    for i, o in enumerate(outer):
        sp = old_sp[i] if i < len(old_sp) else old_sp[-1]
        sport.append(
            {
                "IT": o["IT"],
                "FR": o["FR"],
                "EU": o["EU"],
                "US": o["US"],
                "RU": o["RU"],
                "Alpha": o["Alpha"],
                "height": o["height"],
                "bust": o["bust"],
                "waist": o["waist"],
                "hips": o["hips"],
                "rise": sp["rise"],
                "inseam": sp["inseam"],
                "thighCircumference": sp["thighCircumference"],
                "neckCircumference": o["neckCircumference"],
                "armholeDepth": o["armholeDepth"],
                "bicepsCircumference": o["bicepsCircumference"],
                "frontRise": sp["frontRise"],
                "backRise": sp["backRise"],
                "legOpening": sp["legOpening"],
                "flyLength": sp["flyLength"],
                "kneeCircumference": sp["kneeCircumference"],
                "outseamEstimate": sp["outseamEstimate"],
            }
        )

    return {
        "suits-men": suits,
        "tops-men": tops,
        "knitwear-men": knit,
        "jeans-men": jeans,
        "trousers-men": trousers,
        "sportswear-men": sport,
    }


def build_women(
    dress: list[dict[str, str]],
    shirt_w: list[dict[str, str]],
    out_w: list[dict[str, str]],
    men_j: list[dict[str, str]],
    men_tr: list[dict[str, str]],
    men_sp: list[dict[str, str]],
) -> dict[str, list[dict[str, str]]]:
    tops: list[dict[str, str]] = []
    for dr, sh in zip(dress, shirt_w, strict=True):
        tz = shirt_tz_fields(dr["bust"], sh["armCircumference"])
        tops.append(
            {
                "IT": dr["IT"],
                "FR": dr["FR"],
                "EU": dr["EU"],
                "US": dr["US"],
                "RU": dr["RU"],
                "Alpha": dr["Alpha"],
                "height": dr["height"],
                "bust": dr["bust"],
                "waist": dr["waist"],
                "hips": dr["hips"],
                "shoulder": sh["shoulder"],
                "sleeve": sh["sleeve"],
                "length": sh["length"],
                "armCircumference": sh["armCircumference"],
                "neckCircumference": tz["neckCircumference"],
                "armholeDepth": tz["armholeDepth"],
                "bicepsCircumference": tz["bicepsCircumference"],
                "wristCircumference": tz["wristCircumference"],
                "cuffOpening": tz["cuffOpening"],
            }
        )

    suits: list[dict[str, str]] = []
    for dr, ow in zip(dress, out_w, strict=True):
        row = dict(ow)
        for k in (*SCALE_KEYS, "bust", "waist", "hips"):
            row[k] = dr[k]
        suits.append(row)

    knit: list[dict[str, str]] = []
    for dr, sh, ow in zip(dress, shirt_w, out_w, strict=True):
        knit.append(
            {
                "IT": dr["IT"],
                "FR": dr["FR"],
                "EU": dr["EU"],
                "US": dr["US"],
                "RU": dr["RU"],
                "Alpha": dr["Alpha"],
                "height": dr["height"],
                "bust": dr["bust"],
                "waist": dr["waist"],
                "hips": dr["hips"],
                "length": sh["length"],
                "shoulder": sh["shoulder"],
                "sleeve": sh["sleeve"],
                "neckCircumference": ow["neckCircumference"],
                "armholeDepth": ow["armholeDepth"],
                "bicepsCircumference": ow["bicepsCircumference"],
                "wristCircumference": ow["wristCircumference"],
                "hemCircumference": dr["hemCircumference"],
            }
        )

    def hip_ratio(i: int) -> float:
        mp = parse_range(men_j[i]["hips"])
        wp = parse_range(dress[i]["hips"])
        if not mp or not mp[1] or mid(mp) == 0:
            return 1.0
        return mid(wp) / mid(mp)

    jeans: list[dict[str, str]] = []
    trousers: list[dict[str, str]] = []
    for i, dr in enumerate(dress):
        rj = hip_ratio(i)
        mj = men_j[i] if i < len(men_j) else men_j[-1]
        mtr = men_tr[i] if i < len(men_tr) else men_tr[-1]
        jeans.append(
            {
                "IT": dr["IT"],
                "FR": dr["FR"],
                "EU": dr["EU"],
                "US": dr["US"],
                "RU": dr["RU"],
                "Alpha": dr["Alpha"],
                "height": dr["height"],
                "waist": dr["waist"],
                "hips": dr["hips"],
                "rise": scale_range(mj["rise"], rj**0.35),
                "inseam": shift_range(mj["inseam"], -2),
                "thighCircumference": scale_range(mj["thighCircumference"], rj),
            }
        )
        trousers.append(
            {
                "IT": dr["IT"],
                "FR": dr["FR"],
                "EU": dr["EU"],
                "US": dr["US"],
                "RU": dr["RU"],
                "Alpha": dr["Alpha"],
                "height": dr["height"],
                "waist": dr["waist"],
                "hips": dr["hips"],
                "rise": scale_range(mtr["rise"], rj**0.35),
                "inseam": shift_range(mtr["inseam"], -2),
                "kneeWidth": scale_range(mtr["kneeWidth"], rj),
            }
        )

    sport: list[dict[str, str]] = []
    for i, dr in enumerate(dress):
        rj = hip_ratio(i)
        sp = men_sp[i] if i < len(men_sp) else men_sp[-1]
        tz = shirt_tz_fields(dr["bust"], shirt_w[i]["armCircumference"])
        sport.append(
            {
                "IT": dr["IT"],
                "FR": dr["FR"],
                "EU": dr["EU"],
                "US": dr["US"],
                "RU": dr["RU"],
                "Alpha": dr["Alpha"],
                "height": dr["height"],
                "bust": dr["bust"],
                "waist": dr["waist"],
                "hips": dr["hips"],
                "rise": scale_range(sp["rise"], rj**0.35),
                "inseam": shift_range(sp["inseam"], -2),
                "thighCircumference": scale_range(sp["thighCircumference"], rj),
                "neckCircumference": tz["neckCircumference"],
                "armholeDepth": tz["armholeDepth"],
                "bicepsCircumference": scale_range(sp["bicepsCircumference"], rj**0.5),
                "frontRise": scale_range(sp["frontRise"], rj**0.35),
                "backRise": scale_range(sp["backRise"], rj**0.35),
                "legOpening": scale_range(sp["legOpening"], rj**0.5),
                "flyLength": sp["flyLength"],
                "kneeCircumference": scale_range(sp["kneeCircumference"], rj),
                "outseamEstimate": shift_range(sp["outseamEstimate"], -2),
            }
        )

    return {
        "suits": suits,
        "tops": tops,
        "knitwear": knit,
        "jeans": jeans,
        "trousers": trousers,
        "sportswear": sport,
    }


def main() -> None:
    outer_m = json.loads((DATA / "size-chart-outerwear-men.json").read_text(encoding="utf-8"))
    shirt_m = _parse_block("rawShirtRowsMen")
    dress = json.loads((DATA / "size-chart-dresses.json").read_text(encoding="utf-8"))
    out_w = json.loads((DATA / "size-chart-outerwear.json").read_text(encoding="utf-8"))
    shirt_w = _parse_block("rawShirtRowsWomen")

    for a, b in (
        (len(outer_m), len(shirt_m)),
        (len(dress), len(shirt_w)),
        (len(dress), len(out_w)),
    ):
        if a != b:
            raise SystemExit(f"length mismatch {a} vs {b}")

    men_parts = build_men(outer_m, shirt_m)
    for name, rows in men_parts.items():
        (DATA / f"size-chart-{name}.json").write_text(
            json.dumps(rows, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    women_parts = build_women(
        dress,
        shirt_w,
        out_w,
        men_parts["jeans-men"],
        men_parts["trousers-men"],
        men_parts["sportswear-men"],
    )
    for name, rows in women_parts.items():
        (DATA / f"size-chart-{name}.json").write_text(
            json.dumps(rows, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print("OK: wrote men's *-men.json and women's suits/tops/knitwear/jeans/trousers/sportswear.json")


if __name__ == "__main__":
    main()
