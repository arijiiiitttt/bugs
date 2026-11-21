# Hint

Keep the unfinished tail of the text in a variable; split the new text on `\n` and keep the last piece for the next chunk. A `StringDecoder` handles split UTF-8 characters. Emit the tail in `flush`.
