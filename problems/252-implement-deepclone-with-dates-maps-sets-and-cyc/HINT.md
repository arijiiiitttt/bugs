# Hint

Keep a `WeakMap` from original to clone, and register the new container in it **before** recursing into children.
