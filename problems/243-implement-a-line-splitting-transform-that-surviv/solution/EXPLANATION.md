# Explanation

`rest += decoder.write(chunk); const lines = rest.split("\n"); rest = lines.pop();` - the last element is the (possibly empty) unfinished line. `flush` pushes `rest` if it is not empty.
