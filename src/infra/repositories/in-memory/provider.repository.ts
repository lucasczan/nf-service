import type { IProviderRepository } from "src/domains/application/repositories/provider.repository";
import { Provider } from "src/domains/enterprise/entities/provider";

class InMemoryProviderRepository implements IProviderRepository {
	private static instance: InMemoryProviderRepository | null = null;
	private providers: Provider["props"][] = [];

	private constructor() {}

	async findById(id: string): Promise<Provider | null> {
		const foundProvider = this.providers.find((provider) => provider.id === id);
		if (!foundProvider) {
			return null;
		}
		return Promise.resolve(
			Provider.create(foundProvider, foundProvider.id) || null,
		);
	}

	async findByDocument(document: string): Promise<Provider | null> {
		const foundProvider = this.providers.find(
			(provider) => provider.document === document,
		);

		if (!foundProvider) {
			return null;
		}

		const find = Provider.create(foundProvider, foundProvider.id) || null;
		return find;
	}

	async create(provider: Provider): Promise<Provider> {
		this.providers.push(provider.props);
		return provider;
	}

	async update(provider: Provider): Promise<Provider> {
		const index = this.providers.findIndex((p) => p.id === provider.id);
		if (index >= 0) {
			this.providers[index] = provider.props;
		}
		return provider;
	}

	static getInstance(): InMemoryProviderRepository {
		if (!InMemoryProviderRepository.instance) {
			InMemoryProviderRepository.instance = new InMemoryProviderRepository();
		}
		return InMemoryProviderRepository.instance;
	}
}

export { InMemoryProviderRepository };
