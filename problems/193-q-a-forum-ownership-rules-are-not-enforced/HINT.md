# Hint

There are **4 separate bugs**. Fix them one at a time: run the tests, take the first failure, fix its cause, repeat.

- What does the README say about users that are not the owner?
- What does the README say about non-owners?
- The bug is in the model. Look at the index passed to `splice`.
- Changing a document in memory is not the same as saving it.
