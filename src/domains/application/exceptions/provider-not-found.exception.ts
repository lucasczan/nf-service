import { ProviderException } from "src/domains/enterprise/exceptions/provider.exception";

class ProviderNotFoundException extends ProviderException {
	constructor() {
		super("Provider not found", 404);
		this.name = "ProviderNotFoundException";
	}
}
export { ProviderNotFoundException };
