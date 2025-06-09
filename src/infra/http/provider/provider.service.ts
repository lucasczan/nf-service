import { Injectable } from "@nestjs/common";
import { ICreateProviderDTO } from "src/domains/application/dtos/create-provider.dto";
import { IUpdateProviderDTO } from "src/domains/application/dtos/update-provider.dto";
import { CreateProviderUseCase } from "src/domains/application/use-cases/provider/create-provider.usecase";
import { GetProviderByDocumentUseCase } from "src/domains/application/use-cases/provider/get-provider-by-document.usecase";
import { UpdateProviderUseCase } from "src/domains/application/use-cases/provider/update-provider.usecase";
import { Provider } from "src/domains/enterprise/entities/provider";
import { getMongoConnection } from "src/infra/database/connection/connection";
import { ProviderMongooseRepository } from "src/infra/repositories/mongooose-repository/provider-mongoose.repository";

@Injectable()
class ProviderService {
	async createProvider(
		createProviderDTO: ICreateProviderDTO,
	): Promise<Provider["props"]> {
        const connection = await getMongoConnection()
        const providerRepository = new ProviderMongooseRepository(connection)
		const useCase = new CreateProviderUseCase(providerRepository);
		const newUser = await useCase.execute(createProviderDTO);
		return newUser;
	}

	async getProviderByDocument(document: string): Promise<Provider["props"]> {
        const connection = await getMongoConnection()
        const providerRepository = new ProviderMongooseRepository(connection)
		const useCase = new GetProviderByDocumentUseCase(providerRepository);
		const getProvider = await useCase.execute(document);
		return getProvider;
	}

	async updatedProvider(
		id: string,
		updateProviderDTO: IUpdateProviderDTO,
	): Promise<Provider["props"]> {
        const connection = await getMongoConnection()
        const providerRepository = new ProviderMongooseRepository(connection)
		const useCase = new UpdateProviderUseCase(providerRepository);
		const updatedProvider = await useCase.execute(updateProviderDTO, id);
		return updatedProvider;
	}
}

export { ProviderService };
