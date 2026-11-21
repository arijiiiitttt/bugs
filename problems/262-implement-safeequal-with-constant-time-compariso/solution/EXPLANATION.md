# Explanation

Convert inputs to Buffers, digest each with §createHash("sha256")§ and compare the digests with §timingSafeEqual§. This hides both content and length differences.
