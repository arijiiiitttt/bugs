# Explanation

`chunk.toString()` per chunk cannot decode a character whose bytes arrive in different chunks. A `StringDecoder("utf8")` keeps incomplete bytes between calls (and `decoder.end()` flushes the rest).
