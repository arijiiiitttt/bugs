# Hint

Every operation does read -> check -> write with an `await` in between, so two operations can read the same old balance. You need to serialise the operations (a promise queue works).
