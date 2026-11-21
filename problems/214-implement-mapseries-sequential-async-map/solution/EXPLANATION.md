# Explanation

`for (const item of items) out.push(await fn(item, i++));` - `await` in the loop body serialises the calls and stops at the first rejection.
