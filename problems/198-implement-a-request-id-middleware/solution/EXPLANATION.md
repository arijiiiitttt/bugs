# Explanation

Validate the header with the regex, fall back to §randomUUID()§, set §req.id§ and §res.setHeader("x-request-id", id)§, then §next()§.
