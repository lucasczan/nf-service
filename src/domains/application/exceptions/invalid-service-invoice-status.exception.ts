import { ServiceInvoiceException } from "src/domains/enterprise/exceptions/service-invoice.exception";

class InvalidServiceInvoiceStatusException extends ServiceInvoiceException {
	constructor() {
		super("Invalid status for service invoice", 400);
		this.name = "ServiceInvoiceNotFoundException";
	}
}
export { InvalidServiceInvoiceStatusException };
