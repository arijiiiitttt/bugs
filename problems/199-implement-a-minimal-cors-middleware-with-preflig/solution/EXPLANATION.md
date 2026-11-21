# Explanation

Echo the origin only when allowed, always set §Vary§, short-circuit preflights with §res.status(204).end()§ and attach the allow-* headers only for allowed origins.
