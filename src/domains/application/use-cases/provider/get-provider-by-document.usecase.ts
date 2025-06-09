import type { Provider } from "src/domains/enterprise/entities/provider";
import type { IProviderRepository } from "../../repositories/provider.repository";
import { ProviderException } from "src/domains/enterprise/exceptions/provider.exception";

class GetProviderByDocumentUseCase {
	constructor(private providerRepository: IProviderRepository) {}
	async execute(document: string): Promise<Provider["props"]> {
		const provider = await this.providerRepository.findByDocument(document);
		if (!provider) {
			throw new ProviderException("Provider not found with the given document");
		}
		return provider.props;
	}
}
export { GetProviderByDocumentUseCase };
