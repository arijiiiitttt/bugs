# Explanation

The handler used `req.body.author || req.user._id`. The owner must always be `req.user._id`.

Changed file(s): `src/controller.js`
