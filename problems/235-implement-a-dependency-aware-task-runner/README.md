# Implement a dependency-aware task runner

**Track:** Async & promises &nbsp;|&nbsp; **Difficulty:** Hard &nbsp;|&nbsp; **Stack:** Node.js (ES modules, no extra dependencies)

## Task

## Overview
Implement `runTasks(tasks)` in `src/runTasks.js`. `tasks` is an object `name -> { deps?: string[], run(depResults) }`. `run` is an async (or sync) function that receives an object with the results of its dependencies (`{ depName: value }`).

`runTasks` resolves with an object `name -> result` for all tasks.

### Rules
- A task starts as soon as **all** its dependencies have finished; independent tasks run **concurrently**.
- Every task runs at most once, even if many tasks depend on it.
- Before running anything, validate the graph: reject with `Error('Unknown dependency: <name>')` for a dependency that is not a task, and with `Error('Cycle detected')` for circular dependencies. No task may run in these cases.
- If a task fails, `runTasks` rejects with that error and tasks that depend on it (directly or not) are never started.

## How to work

```bash
npm test -- 235     # run the tests of this problem (replace 235 by the problem number)
```

- Implement the code in `src/runTasks.js`. Never edit the tests.
- Stuck? Open `HINT.md`. Done? `solution/EXPLANATION.md` and `npm run solution -- 235` show the reference solution.
