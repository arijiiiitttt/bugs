# Explanation

Sort a copy by start (`a[0]-b[0]`), compare `s <= last[1]` and set `last[1] = Math.max(last[1], e)`, and push copies (`[s, e]`) so inputs are never touched.
