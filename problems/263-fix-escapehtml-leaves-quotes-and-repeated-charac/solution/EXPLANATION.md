# Explanation

Use a single §replace(/[&<>"']/g, ch => map[ch])§ (one pass avoids double escaping), handle §null§, and escape the author in the attribute as well.
