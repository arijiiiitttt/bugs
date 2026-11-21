# Explanation

1. **"My events" hides my drafts**: The filter also required `public: true`; owners must see all of their items.

2. **`GET /mine` is treated as an id**: The dynamic route `/:id` was declared before `/mine`, so "mine" was captured as an id. Declare static routes first.

3. **Unknown routes do not return the JSON 404**: The catch-all 404 middleware was removed from `app.js`.

4. **Malformed JSON causes a 500**: The error handler lost its `entity.parse.failed` branch.

5. **Authenticated requests hang forever**: The middleware never called `next()`.
