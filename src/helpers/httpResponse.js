class HttpResponse {
  static Success(message, data) {
    const response = {
      statusCode: 200,
      message: message,
    };

    if (data) response.data = data;

    return response;
  }

  static Created(data) {
    return {
      statusCode: 201,
      data,
    };
  }

  static Deleted() {
    return {
      statusCode: 204,
    };
  }

  static BadRequest(message) {
    return {
      statusCode: 400,
      error: message,
    };
  }

  static NotFound(message) {
    return {
      statusCode: 404,
      error: message,
    };
  }
}

class HttpError extends Error {
  constructor(message) {
    super(message);
    this.error = message;
    this.statusCode = 500;
  }
}

module.exports = { HttpResponse, HttpError };
