# Explanation

Prune from the front while `ts[0] <= t - windowMs`; allow if `ts.length < limit` and push `t`. `remaining` prunes then returns `limit - ts.length`.
