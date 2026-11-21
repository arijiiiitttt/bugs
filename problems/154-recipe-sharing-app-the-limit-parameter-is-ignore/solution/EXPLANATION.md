# Explanation

`pageSize` was hard-coded to 10 instead of `Math.min(limit, 50)`.

Changed file(s): `src/controller.js`
