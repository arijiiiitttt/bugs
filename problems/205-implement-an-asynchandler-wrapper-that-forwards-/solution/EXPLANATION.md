# Explanation

§try { await fn(req,res,next) } catch (e) { next(e) }§ covers sync throws, rejections and non-promise returns.
