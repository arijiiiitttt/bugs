# Explanation

The catch-all 404 middleware was registered before the routes so it always answered first. Move it to the end.
