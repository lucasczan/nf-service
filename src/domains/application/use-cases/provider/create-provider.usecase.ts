import { Provider } from "src/domains/enterprise/entities/provider";
import type { ICreateProviderDTO } from "../../dtos/create-provider.dto";
import type { IProviderRepository } from "../../repositories/provider.repository";
import { ProviderAlreadyExists } from "../../exceptions/provider-already-exists.exception";

class CreateProviderUseCase {
    constructor(private providerRepository: IProviderRepository) {}

    async execute(
        createProviderDTO: ICreateProviderDTO
    ): Promise<Provider["props"]> {
        const existingProvider = await this.providerRepository.findByDocument(
            createProviderDTO.document
        );

        if (existingProvider) throw new ProviderAlreadyExists();

        const provider = Provider.create(createProviderDTO);
        const createdProvider = await this.providerRepository.create(provider);
        return createdProvider.props;
    }
}
export { CreateProviderUseCase };
