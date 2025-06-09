import { Provider } from "src/domains/enterprise/entities/provider";
import { IProviderRepository } from "../../repositories/provider.repository";
import { ProviderException } from "src/domains/enterprise/exceptions/provider.exception";
import { IUpdateProviderDTO } from "../../dtos/update-provider.dto";

class UpdateProviderUseCase {
    constructor(private providerRepository: IProviderRepository) {}
    async execute(
        updateProviderDTO: IUpdateProviderDTO,
        id: Provider["_id"]
    ): Promise<Provider["props"]> {
        const findProvider = await this.providerRepository.findById(id);

        if (!findProvider) {
            throw new ProviderException("Provider not found with given id");
        }
        
        if (updateProviderDTO.document) {
            findProvider.document = updateProviderDTO.document;
        }

        if (updateProviderDTO.municipal_registration) {
            findProvider.municipal_registration =
                updateProviderDTO.municipal_registration;
        }

        if (updateProviderDTO.municipality_code) {
            findProvider.props.address.municipality_code =
                updateProviderDTO.municipality_code;
        }

        const updatedProvider = await this.providerRepository.update(
            findProvider
        );
        return updatedProvider.props;
    }
}

export { UpdateProviderUseCase };
