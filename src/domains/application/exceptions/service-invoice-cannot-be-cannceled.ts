import { AppException } from "src/core/exceptions/app.exception";

class ServiceInvoiceCannotBeCannceledException extends AppException {
    constructor() {
        super("Service invoice cannot be cannceled", 400);
    }
}

export { ServiceInvoiceCannotBeCannceledException };