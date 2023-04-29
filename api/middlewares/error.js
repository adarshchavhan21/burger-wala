
exports.error = (err, req, res, next) => {
    const error = new Error();
    const status= err.status|| 500;
    const message = err.message || 'Internal server error';

    res.status(status).send({
        success: false,
        message,
        error: err.stack
    });
}