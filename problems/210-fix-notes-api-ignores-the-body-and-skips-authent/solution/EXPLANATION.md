# Explanation

The router was mounted before §express.json()§ and the auth middleware, so neither ran for it. Register body parsing and authentication first, then mount the router.
