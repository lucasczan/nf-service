import { Provider } from "src/domains/enterprise/entities/provider";
import type { ICreateProviderDTO } from "../../dtos/create-provider.dto";
import type { IProviderRepository } from "../../repositories/provider.repository";
import { ProviderAlreadyExists } from "../../exceptions/provider-already-exists.exception";

class CreateProviderUseCase {
    constructor(private providerRepository: IProviderRepository) { }

    async execute(
        createProviderDTO: ICreateProviderDTO
    ): Promise<Provider["props"]> {
        const existingProviderPromise = this.providerRepository.findByDocument(
            createProviderDTO.document
        );

        const findByExternalIdPromise = this.providerRepository.findByExternalId(
            createProviderDTO.external_id
        );

        const [existingProvider, existingExternalIdProvider] = await Promise.all([
            existingProviderPromise,
            findByExternalIdPromise
        ]);

        if (existingProvider || existingExternalIdProvider) throw new ProviderAlreadyExists();

        const provider = Provider.create(createProviderDTO);
        const createdProvider = await this.providerRepository.create(provider);
        return createdProvider.props;
    }
}
export { CreateProviderUseCase };
