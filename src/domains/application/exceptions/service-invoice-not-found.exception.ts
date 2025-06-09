import { ServiceInvoiceException } from "src/domains/enterprise/exceptions/service-invoice.exception";
class ServiceInovoiceNotFoundException extends ServiceInvoiceException {
	constructor() {
		super("invoice not found", 404);
		this.name = "ServiceInvoiceNotFoundException";
	}
}
export { ServiceInovoiceNotFoundException };
