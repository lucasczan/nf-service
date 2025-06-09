import { Connection, Model } from "mongoose";
import { ProviderNotFoundException } from "src/domains/application/exceptions/provider-not-found.exception";
import { IProviderRepository } from "src/domains/application/repositories/provider.repository";
import { Provider } from "src/domains/enterprise/entities/provider";
import {
    ProviderDocument,
    ProviderSchema,
} from "src/infra/database/schemas/provider.schema";

export class ProviderMongooseRepository implements IProviderRepository {
    private readonly providerModel: Model<ProviderDocument>;

    constructor(connection: Connection) {
        this.providerModel = connection.model<ProviderDocument>(
            "Provider",
            ProviderSchema
        );
    }

    async create(provider: Provider): Promise<Provider> {
        const providerCreated = await this.providerModel.create(provider.props);
        return this.toDomain(providerCreated);
    }

    async findById(id: string): Promise<Provider | null> {
        const provider = await this.providerModel.findOne({ id });
        if (!provider) throw new ProviderNotFoundException();
        return this.toDomain(provider);
    }

    async findByDocument(document: string): Promise<Provider | null> {
        const foundProvider = await this.providerModel.findOne({ document });
        return foundProvider ? this.toDomain(foundProvider) : null;
    }

    async update(provider: Provider): Promise<Provider> {
        const updated = await this.providerModel.findOneAndUpdate(
            { id: provider.id },
            provider.props,
            { new: true }
        );

        if (!updated) {
            throw new ProviderNotFoundException();
        }

        return this.toDomain(updated);
    }

    toDomain(provider: ProviderDocument): Provider {
        const providerData = provider.toObject();

        const domainServiceProvider = Provider.create(
            {
                ...providerData,
                created_at: providerData.created_at.toISOString(),
                updated_at: providerData.updated_at.toISOString(),
            },
            providerData.id
        );
        return domainServiceProvider;
    }
}
