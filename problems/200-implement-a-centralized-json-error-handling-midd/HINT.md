# Hint

Check §res.headersSent§ first. Clamp the status to the 400-599 range, otherwise a thrown §{ status: 200 }§ would turn the error into a success.
