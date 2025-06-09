import { AppException } from "src/core/exceptions/app.exception";


class ServiceInovoiceAlreadyCancelledException extends AppException {
    constructor() {
        super("Service invoice already cancelled", 400);
    }
}

export { ServiceInovoiceAlreadyCancelledException };