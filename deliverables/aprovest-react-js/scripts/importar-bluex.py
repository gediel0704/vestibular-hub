import json, glob, re, collections

AREA = {
    "portuguese": ("Linguagens", "Português"),
    "english": ("Linguagens", "Inglês"),
    "mathematics": ("Matematica", "Matemática"),
    "history": ("Humanas", "História"),
    "geography": ("Humanas", "Geografia"),
    "philosophy": ("Humanas", "Filosofia"),
    "physics": ("Natureza", "Física"),
    "biology": ("Natureza", "Biologia"),
    "chemistry": ("Natureza", "Química"),
}
FONTE = {
    "USP": ("FUVEST", "https://www.fuvest.br/vestibular-da-usp/provas-e-gabaritos/"),
    "UNICAMP": ("Unicamp", "https://www.comvest.unicamp.br/vestibulares-anteriores/provas-e-gabaritos/"),
}

def esc(t):
    return "'" + t.replace("'", "''") + "'"

rows = []
stats = collections.Counter()
for f in sorted(glob.glob("/tmp/bluex/questions/*/*/*.json")):
    q = json.load(open(f))
    if q.get("has_associated_images"):
        continue  # sem as imagens oficiais, o enunciado fica incompleto
    uni, year = f.split("/questions/")[1].split("/")[:2]
    exam, url = FONTE[uni]
    subjects = [s for s in (q.get("subject") or []) if s in AREA]
    if not subjects:
        continue
    area, topic = AREA[subjects[0]]
    alts = []
    for a in q.get("alternatives", []):
        m = re.match(r"^([a-eA-E])\)\s*(.*)$", a.strip(), re.S)
        if not m:
            break
        alts.append({"key": m.group(1).upper(), "text": m.group(2).strip()})
    if len(alts) < 2:
        continue
    keys = {a["key"] for a in alts}
    answer = (q.get("answer") or "").strip().upper()
    if answer not in keys:
        continue
    statement = q["question"].strip()
    if "[IMAGE" in statement:
        continue
    title = f"{exam} {year} — Questão {q['number']}"
    choices = json.dumps(alts, ensure_ascii=False)
    meta = json.dumps({"bluex_id": q["id"], "assuntos_originais": subjects}, ensure_ascii=False)
    rows.append(
        "(" + ",".join([
            "'question'", esc(title), esc(exam), esc(area), esc(topic), "3",
            esc(statement), esc(choices), esc(answer), "''", esc(url),
            str(int(year)), "'oficial'", "true", esc(meta),
        ]) + ")"
    )
    stats[(exam, area)] += 1

sql = (
    "INSERT INTO public.academic_items "
    "(kind,title,exam,subject,topic,difficulty,statement,choices,correct_key,explanation,source_url,source_year,origin,published,metadata) VALUES\n"
    + ",\n".join(rows) + ";\n"
)
open("/tmp/bluex-import/import.sql", "w").write(sql)
print("questões geradas:", len(rows))
for k, v in sorted(stats.items()):
    print(k, v)
