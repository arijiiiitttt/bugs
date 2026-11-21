# Explanation

1. **Users can create events in someone else's name**: The handler used `req.body.organizer || req.user._id`. The owner must always be `req.user._id`.

2. **The organizer object leaks private user data**: `toJSON()` returned the whole user record instead of picking the 4 public fields.

3. **Owners can be changed through the update endpoint**: `organizer` was added to the `UPDATABLE` whitelist (mass assignment). The owner must never change.

4. **Unknown user ids crash the server**: The middleware did not check that the user exists, so `req.user` was `undefined` and handlers crashed.
