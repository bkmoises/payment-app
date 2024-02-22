class HttpResponse {
  static success(message, data) {
    const response = {
      statusCode: 200,
      message: message,
    };

    if (data) response.data = data;

    return response;
  }

  static created(data) {
    return {
      statusCode: 201,
      data,
    };
  }

  static deleted() {
    return {
      statusCode: 204,
    };
  }

  static notFound(message) {
    return {
      statusCode: 404,
      error: message,
    };
  }
}

class HttpError extends Error {
  static internal(message) {
    const error = new HttpError(message);
    error.error = message;
    error.statusCode = 500;
    return error;
  }

  static badRequest(message) {
    const error = new HttpError(message);
    error.error = message;
    error.statusCode = 400;
    return error;
  }
}

module.exports = { HttpResponse, HttpError };
