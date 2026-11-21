# Explanation

In `model.js`, `save()` generated the id and timestamps but forgot `db.items.push(this.toDoc())`.

Changed file(s): `src/model.js`
