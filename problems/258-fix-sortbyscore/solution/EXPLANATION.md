# Explanation

A comparator must return a number (negative/zero/positive), not a boolean. Sort a copy: `[...players].sort((a,b) => b.score - a.score || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))`.
