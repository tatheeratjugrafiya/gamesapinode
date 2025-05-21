export default class ApiResponse {
    static success(data = null, message = 'Success', statusCode = 200) {
        return {
            status: statusCode,
            success: true,
            message,
            data
        };
    }

    static error(message = 'Error', statusCode = 400, errors = null) {
        return {
            status: statusCode,
            success: false,
            message,
            errors
        };
    }

    static validationError(errors) {
        return {
            status: 422,
            success: false,
            message: 'Validation Error',
            errors
        };
    }

    static unauthorized(message = 'Unauthorized') {
        return {
            status: 401,
            success: false,
            message
        };
    }

    static forbidden(message = 'Forbidden') {
        return {
            status: 403,
            success: false,
            message
        };
    }

    static notFound(message = 'Not Found') {
        return {
            status: 404,
            success: false,
            message
        };
    }
}
 