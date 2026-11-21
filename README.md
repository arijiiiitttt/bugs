<h1 align="center">Node.js Practice Pack</h1>
<p align="center">
 289 HackerRank-style Node.js problems. Fix the bug or build from the spec, and let the tests tell you when you are done.
</p>

<p align="center">
  <a href="#setup"><img alt="Node" src="https://img.shields.io/badge/runtime-node%2020%2B-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" /></a>
  <a href="#tracks"><img alt="Express" src="https://img.shields.io/badge/api-express-000000?style=flat-square&logo=express&logoColor=white" /></a>
  <a href="#testing-and-checking-your-work"><img alt="node:test" src="https://img.shields.io/badge/tests-node%3Atest-339933?style=flat-square&logo=nodedotjs&logoColor=white" /></a>
  <a href="#difficulty-levels"><img alt="Problems" src="https://img.shields.io/badge/problems-289-2563EB?style=flat-square" /></a>
  <a href="#setup"><img alt="No database" src="https://img.shields.io/badge/database-none%20needed-6B7280?style=flat-square" /></a>
</p>


> **⚠️ Honest framing.** This is a self-made practice set, not an official HackerRank product, and the problems are not copies of real assessment questions. Every problem was machine-checked: its starter code **fails** its tests and its reference solution **passes** them. The difficulty labels and suggested times are my estimates, not measured data. The Express API track is by far the largest and strongest part (216 of 289 problems). The other tracks are smaller and still growing, and **File system, HTTP and "Debugging & fixing" are not in the pack yet**. The tests are visible, so they are a learning tool and not a hidden-test simulation.


## Table of contents

1. [Setup](#setup)
2. [Your first problem](#your-first-problem)
3. [Commands](#commands)
4. [Inside a problem folder](#inside-a-problem-folder)
5. [The two kinds of problems](#the-two-kinds-of-problems)
6. [Tracks](#tracks)
7. [The Express API project](#the-express-api-project)
8. [Difficulty levels](#difficulty-levels)
9. [How to practise](#how-to-practise)
10. [Testing and checking your work](#testing-and-checking-your-work)
11. [Troubleshooting](#troubleshooting)
12. [Project layout](#project-layout)




## Setup

You need **Node.js 20+** (built and tested on Node 22). No database, no internet connection and no API keys are required: everything runs locally and in memory.

```bash
cd nodejs-practice-pack

# 1. install the only dependency (Express)
npm install

# 2. see every problem
npm run list

# 3. run the tests of problem 001
npm test -- 001
```

| Situation | Result |
|---|---|
| Fresh install, run any problem | Tests **fail**. That is the starting point. |
| Edit `src/`, run again | Failures go down as you fix things |
| All tests green | Problem solved |
| No `npm install` | Express problems cannot start (`Cannot find package 'express'`) |
| Windows PowerShell | Set variables first: `$env:DEBUG=1; npm test -- 001` |


## Your first problem

Problem **001** is the one this pack is modelled on: a blog backend where creating a post always fails.

1. Open `problems/001-blog-platform-creating-a-post-always-fails/README.md` and read the spec.
2. Run `npm test -- 001` and read the first failing test. It shows the exact request and the response it expected.
3. Open `src/controller.js`, find the bug, fix it.
4. Run the tests again until they all pass.
5. Read `solution/EXPLANATION.md` and compare it with your fix.

**Things to try**

- Run `DEBUG=1 npm test -- 001` to print the server-side error. One `ReferenceError` or `TypeError` often points straight at the faulty line.
- Run `npm test -- 001 --watch` and keep it open while you edit. Every save re-runs the tests.
- Finish problem 001, then do `npm run list -- blog` and try the other blog problems.
- Solve a bug in the blog domain, then look for the same bug in the recipe or marketplace version. It is the same mistake with different field names.


## Commands

| Command | What it does |
|---|---|
| `npm run list` | Every problem: number, difficulty, track, title |
| `npm run list -- hard` | Filter by difficulty: `easy`, `medium`, `hard` |
| `npm run list -- blog` | Filter by any word in the track or title (`async`, `recipe`, `stream`, `auth`) |
| `npm run list -- hard express` | Filters can be combined |
| `npm test -- 042` | Run the tests of problem 042 (`42` and `042` both work) |
| `npm test -- 042 --watch` | Re-run on every file save |
| `DEBUG=1 npm test -- 042` | Express problems: also print server-side errors |
| `npm run solution -- 042` | Run the tests against the reference solution. This is the "peek" button. |


## Inside a problem folder

```
problems/042-blog-platform-creating-a-post-always-fails/
  README.md              the task: overview, API spec, rules, examples
  src/                   the code you edit
  test/                  the tests: read them, never edit them
  HINT.md                a nudge in the right direction
  solution/
    EXPLANATION.md       what the bug was, or how the solution works
    ...                  the corrected or complete source files
```

| Rule | Why |
|---|---|
| Edit **only** `src/` | The tests are the judge |
| Read the problem README completely | The spec lists exact status codes, messages and field names, and the tests check them |
| Open `HINT.md` after about 10 minutes of being stuck | Struggling a little is how the skill sticks |
| Read `solution/EXPLANATION.md` after you pass | Comparing fixes is where much of the learning happens |


## The two kinds of problems

| Kind | What you get | What you do |
|---|---|---|
| **Fix the bug** | Working-looking code that is broken. The README gives only the **symptom**, for example "creating a post always fails with 500", never the cause. | Read the code, find the bug, fix it. Hard problems hide several independent bugs. |
| **Implement from spec** | Files with stubs that throw `Not implemented`, plus a written spec | Write the function, middleware or class so it meets the spec |

The Express API track is almost entirely *fix the bug*. The utility, algorithm and async tracks mix both kinds.


## Tracks

| Track | Easy | Medium | Hard | Total |
|---|---|---|---|---|
| Express API bug-fix | 80 | 86 | 50 | 216 |
| Express middleware & routing | 8 | 7 | 1 | 16 |
| Async & promises | 9 | 11 | 4 | 24 |
| Events & streams | 4 | 4 | 0 | 8 |
| Core JS utilities | 5 | 2 | 2 | 9 |
| Algorithms & data structures | 5 | 3 | 0 | 8 |
| Security & auth | 5 | 3 | 0 | 8 |
| **Total** | **116** | **116** | **57** | **289** |

| Track | What you practise |
|---|---|
| **Express API bug-fix** | Reading an unfamiliar REST backend: create, read, list, update, delete, auth, pagination, ownership, validation |
| **Express middleware & routing** | Logger, rate limiter with an injected clock, body-size limit, error handler, validation, response envelopes. Tested against a real local server. |
| **Async & promises** | Retry with backoff, concurrency limits, mutex, timeouts, `AbortSignal`, event-loop ordering, `forEach` + `async`, missing `await` |
| **Events & streams** | Custom `EventEmitter` modules, `Transform` streams, `pipeline` error handling, async iterators |
| **Core JS utilities** | `deepClone`, `deepEqual`, `groupBy`, LRU cache, query-string parsing, plus pitfalls like `==`, `parseInt` and sort comparators |
| **Algorithms & data structures** | Interview-style problems with edge cases and performance checks |
| **Security & auth** | HMAC token signing and verification, constant-time comparison, HTML escaping, role-based access control |


## The Express API project

The 216 Express problems all use the same small project, modelled on the "Blog Platform (MERN): Post Creation" task. A bug is injected into a working version.

```
app.js          Express app, JSON parsing, 404 and error handling
routes.js       the route table
middleware.js   x-user-id authentication
controller.js   handlers: create, read, list, mine, update, delete
model.js        a tiny Mongoose-like model on an in-memory store
store.js        seed data and reset(), used by the tests
```

It appears in **8 domains**, so you cannot just memorise where the bugs live:

| Domain | Problems | Owner field | Example fields |
|---|---|---|---|
| Blog Platform | 32 | `author` | `title`, `content`, `excerpt`, `category`, `tags`, `readTime` |
| Event Board | 27 | `organizer` | `name`, `agenda`, `teaser`, `type`, `capacity` |
| Online Academy | 27 | `instructor` | `title`, `syllabus`, `blurb`, `level`, `durationHours` |
| Library Catalog | 27 | `lister` | `title`, `plot`, `blurb`, `genre`, `pages` |
| Project Tracker | 26 | `assignee` | `title`, `details`, `summary`, `priority`, `estimateHours` |
| Recipe Sharing App | 26 | `chef` | `name`, `instructions`, `summary`, `cuisine`, `cookTime` |
| Marketplace | 26 | `seller` | `name`, `description`, `summary`, `department`, `stock` |
| Q&A Forum | 25 | `asker` | `title`, `body`, `preview`, `topic`, `votes` |

**Seed data.** Four users (John, Sarah, Mike, Emma) and six items per domain. Item 5 is hidden, and ownership is spread across users, which is what the ownership tests rely on. Authentication is the `x-user-id` header.

**Kinds of bugs**

| Area | Examples |
|---|---|
| Create | Variables never read from `req.body`, a typo in `save()`, wrong status code, missing excerpt fallback, the client controlling `published` or the owner |
| Read, list, "mine" | Missing id validation, 500 instead of 404, wrong sort order, pagination offset errors, no page-size cap, case-sensitive search, route order (`/:id` swallowing `/mine`) |
| Update, delete | Missing ownership check, changes not saved, wrong item deleted, mass assignment of the owner field |
| Auth, app level | Wrong header name, `next()` never called, unknown users let through, malformed JSON causing a 500 |
| Model layer | Timestamps overwritten, user data leaked, missing enum validation |

Hard problems combine **4 to 7** of these bugs in one project. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.


## Difficulty levels

| Level | What to expect | Suggested time |
|---|---|---|
| **Easy** | One clear bug, or a short function | 10 to 15 min |
| **Medium** | A subtler bug, or a spec with several rules and edge cases | 20 to 30 min |
| **Hard** | Several bugs in one project, or tricky semantics | 30 to 45 min |

Problems are numbered in order of track and difficulty. The 20 newest Hard problems (270 to 289) are extra multi-bug Express tasks, so use `npm run list -- hard` to find them.


## How to practise

1. **Warm up** on Easy Express problems until reading an unfamiliar controller feels routine.
2. **Time yourself** like a real assessment, with no hints for the first 10 minutes.
3. **Read the failing test first.** It tells you the request that was sent and the response that was expected. Then find the line responsible.
4. **Use `DEBUG=1`** on Express problems to see the real error behind a 500.
5. **Repeat a bug in another domain.** The same mistake with different field names is the fastest way to make it stick.
6. **Move to Hard** once Medium problems take you under 20 minutes.
7. **Review.** After each solve, read the explanation, even if your fix passed. There is often a cleaner way.


## Testing and checking your work

The tests use Node's built-in runner (`node:test`), so there is no Jest or Mocha to install. The Express tests start the app on a random local port and call it with `fetch`, then reset the in-memory database before every test.

| What was checked | How |
|---|---|
| The starter code fails | Every problem's tests were run against the unsolved code |
| The solution passes | Every problem's tests were run against the reference solution |
| Timing-sensitive tests | Run with generous timers so they do not flake on a slow machine |

To confirm a problem is solvable, or to see what a passing run looks like:

```bash
npm run solution -- 001
```


## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find package 'express'` | Run `npm install` in the pack folder |
| `No problem found for "5"` | Use a number from `npm run list`. Leading zeros are optional. |
| Tests hang | A request never got a response. In Express problems, look for a middleware that never calls `next()` or a handler that never sends a response. |
| `ERR_MODULE_NOT_FOUND` | Imports need the file extension: `import x from './x.js'` |
| Want to start a problem over | Extract that problem's `src/` from the zip again |
| Tests pass but the README says otherwise | Trust the README spec, then open an issue with the problem number |


## Project layout

```
nodejs-practice-pack/
  README.md          this file
  package.json       npm scripts and the Express dependency
  problems.json      index of all problems
  problems/          the 289 problems
  lib/testkit.js     test helpers (do not edit)
  scripts/           the runner behind npm test and npm run list
```
