export const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    const errorResponse = {
        error: {
            message: err.message || 'Internal server error',
            code: 'INTERNAL_ERROR'
        }
    };
    res.status(500).json(errorResponse);
};
export const notFoundHandler = (_req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            code: 'NOT_FOUND'
        }
    });
};
