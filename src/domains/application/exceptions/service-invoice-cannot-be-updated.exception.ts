import { AppException } from "src/core/exceptions/app.exception";

class ServiceInvoiceCannotBeUpdatedException extends AppException {
    constructor(message?:string) {
        super(message ?? "Service invoice cannot be updated.", 400);
    }
}

export { ServiceInvoiceCannotBeUpdatedException };