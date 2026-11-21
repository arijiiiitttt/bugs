# Explanation

Refill lazily: §tokens = min(capacity, tokens + (now-last)/1000*refillPerSec)§; if §tokens < 1§ answer 429 with §ceil((1 - tokens) / refillPerSec)§, else subtract 1.
