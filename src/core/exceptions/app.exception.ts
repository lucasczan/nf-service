class AppException extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'AppException';
        this.statusCode = statusCode;
    }
}

export { AppException };
