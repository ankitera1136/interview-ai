/**
 * Wraps an async Express route handler and forwards any thrown errors
 * to Express's global error handler via next(err).
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = asyncHandler
