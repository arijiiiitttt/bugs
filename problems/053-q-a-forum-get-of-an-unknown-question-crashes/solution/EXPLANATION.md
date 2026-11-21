# Explanation

The `if (!item)` branch was missing in `getItem`, so `item.populate()` threw.

Changed file(s): `src/controller.js`
