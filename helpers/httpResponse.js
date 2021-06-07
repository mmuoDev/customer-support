const send = (res, statusCode, message, data, metadata) => {
    let response = {
        status: true,
    }

    if (data) response.data = data
    if (metadata) response.metadata = metadata;

    statusCode = statusCode || 500;
    message = message || 'Server error';
    if (statusCode > 299) response = { ...response, status: false, error: { code: statusCode, message } };

    return res.status(statusCode).json(response);
}

module.exports = {
    send
};