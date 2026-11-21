# Explanation

§router.use("/:version", (req,res,next) => ...)§ picks §versions[req.params.version]§ with §Object.hasOwn§ and calls it as §target(req, res, next)§.
