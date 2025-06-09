import { Provider } from "src/domains/enterprise/entities/provider";

interface IProviderRepository {
	create(Provider: Provider): Promise<Provider>;
	findByDocument(document: string): Promise<Provider | null>;
	findById(id: string): Promise<Provider | null>;
	update(provider: Provider): Promise<Provider>;
}

export type { IProviderRepository };
