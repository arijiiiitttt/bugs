# Fix: concurrent withdrawals overdraw the account (race condition)

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
`Account` in `src/account.js` keeps its balance in an **asynchronous** store (`await store.read()` / `await store.write(value)`).

- `balance()` resolves with the current balance.
- `deposit(amount)` adds money and resolves with the new balance.
- `withdraw(amount)` removes money and resolves with the new balance, or rejects with `Error('Insufficient funds')` if the balance is too small.
- `amount` must be a positive number, otherwise reject with a `RangeError`.

### Symptom
Under load customers can withdraw more than they own, and concurrent deposits get lost: ten parallel `deposit(10)` calls on an empty account give a balance of 10 instead of 100.

### Requirements
Operations on the **same** account must behave as if they ran one after another, **in the order they were called** - even when the caller does not await them. A failing operation (for example insufficient funds) must not block the operations queued behind it.

## How to work

```bash
npm test -- 233     # run the tests of this problem (replace 233 by the problem number)
```

- Implement the code in `src/account.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 233` show the reference solution.
