# Explanation

Binding the nonce to the session id with an HMAC means a token stolen from one session is useless in another, and no server-side storage is needed.
