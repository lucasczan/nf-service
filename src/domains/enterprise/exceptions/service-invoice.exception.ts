import { EntityException } from "./entity.exception";

class ServiceInvoiceException extends EntityException {
	constructor(message: string, statusCode?: number) {
		super(`Invoice: ${message}`, statusCode);
		this.name = "ServiceInvoiceException";
	}
}

export { ServiceInvoiceException };
