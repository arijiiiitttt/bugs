# Hint

A multi-byte UTF-8 character can be split across two chunks. Decoding every chunk on its own breaks it. Look at `string_decoder` or concatenate the Buffers first.
