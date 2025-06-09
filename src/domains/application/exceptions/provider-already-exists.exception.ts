import { ProviderException } from "src/domains/enterprise/exceptions/provider.exception";

class ProviderAlreadyExists extends ProviderException {
	constructor() {
		super("Provider already Exists.", 403);
		this.name = "ProviderAlreadyExistsException";
	}
}
export { ProviderAlreadyExists };
