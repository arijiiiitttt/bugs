# Explanation

The auth middleware did not §return§ after sending 401, so §next()§ ran too. The language middleware only called §next()§ inside the §if§, so requests without the header hung. Add the return and set a default.
