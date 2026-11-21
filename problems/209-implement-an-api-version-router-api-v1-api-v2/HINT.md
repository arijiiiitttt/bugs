# Hint

A router is a function §(req, res, next)§. Use §router.use("/:version", ...)§ so Express strips the prefix, then delegate to the chosen router.
