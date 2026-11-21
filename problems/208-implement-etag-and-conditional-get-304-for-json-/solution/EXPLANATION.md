# Explanation

Compute the tag from the serialized body, compare against the normalized list from §If-None-Match§, answer §res.status(304).end()§ on a hit and §res.type("application/json").send(text)§ otherwise.
