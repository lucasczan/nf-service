import { Injectable } from "@nestjs/common";
import { ICreateInvoiceDTO } from "src/domains/application/dtos/service-invoice/create-service-invoice.dto";
import { IListServiceInvoicesDTO } from "src/domains/application/dtos/service-invoice/list-service-invoice.dto";
import { CreateServiceInvoiceUseCase } from "src/domains/application/use-cases/service-invoice/create-invoice.usecase";
import { ListServiceInvoicesUseCase } from "src/domains/application/use-cases/service-invoice/list-service-invoices.usecase";
import {
    SERVICE_INVOICE_STATUS_ENUM,
    ServiceInvoice,
} from "src/domains/enterprise/entities/service-invoice";
import { ChangeServiceInvoiceStatusUseCase } from "src/domains/application/use-cases/service-invoice/change-service-invoice-status.usecase";
import { ServiceInvoiceMongooseRepository } from "src/infra/repositories/mongooose-repository/service-invoice-mongoose.repository";
import { ProviderMongooseRepository } from "src/infra/repositories/mongooose-repository/provider-mongoose.repository";
import { getMongoConnection } from "src/infra/database/connection/connection";
import { EmmitServiceInvoiceUseCase } from "src/domains/application/use-cases/service-invoice/emmit-service-invoice.usecase";
import { IEmmitInvoiceDTO } from "src/domains/application/dtos/service-invoice/emmit-service-invoice.dto";
import { CancelServiceInvoiceUseCase } from "src/domains/application/use-cases/service-invoice/cancel-service-invoice.usecase";
import { IUpdateServiceInvoiceDTO } from "src/domains/application/dtos/service-invoice/update-service-invoice.dto";
import { UpdateServiceInvoiceUseCase } from "src/domains/application/use-cases/service-invoice/update-service-invoice.usecase";

@Injectable()
class InvoiceService {
    constructor() {}

    async createInvoice(
        createInvoiceDTO: ICreateInvoiceDTO
    ): Promise<ServiceInvoice["props"]> {
        const connection = await getMongoConnection();
        const serviceInvoiceRepository = new ServiceInvoiceMongooseRepository(
            connection
        );

        const providerRepository = new ProviderMongooseRepository(connection);
        const useCase = new CreateServiceInvoiceUseCase(
            providerRepository,
            serviceInvoiceRepository
        );

        const newInvoice = await useCase.execute(createInvoiceDTO);
        return newInvoice;
    }

    async listInvoices(filters: IListServiceInvoicesDTO) {
        const connection = await getMongoConnection();
        const serviceInvoiceRepository = new ServiceInvoiceMongooseRepository(
            connection
        );

        const useCase = new ListServiceInvoicesUseCase(
            serviceInvoiceRepository
        );
        const invoices = await useCase.execute(filters);
        return invoices;
    }

    async changeServiceInvoiceStatus(
        id: ServiceInvoice["id"],
        status: SERVICE_INVOICE_STATUS_ENUM
    ): Promise<ServiceInvoice["props"]> {
        const connection = await getMongoConnection();

        const serviceInvoiceRepository = new ServiceInvoiceMongooseRepository(
            connection
        );

        const useCase = new ChangeServiceInvoiceStatusUseCase(
            serviceInvoiceRepository
        );

        const updatedInvoice = await useCase.execute(id, status);

        return updatedInvoice;
    }

    async emmitInvoice(emmitServiceInvoiceDTO: IEmmitInvoiceDTO) {
        const connection = await getMongoConnection();
        const serviceInvoiceRepository = new ServiceInvoiceMongooseRepository(
            connection
        );

        const useCase = new EmmitServiceInvoiceUseCase(
            serviceInvoiceRepository
        );

        const invoice = await useCase.execute(emmitServiceInvoiceDTO);

        return invoice;
    }

    async cancelServiceInvoice(serviceInvoiceId: string) {
        const connection = await getMongoConnection();
        const serviceInvoiceRepository = new ServiceInvoiceMongooseRepository(
            connection
        );
    
        const useCase = new CancelServiceInvoiceUseCase(serviceInvoiceRepository);

        await useCase.execute(serviceInvoiceId);
    }

    async updateServiceInvoice(serviceInvoiceId:ServiceInvoice['id'] ,data: IUpdateServiceInvoiceDTO) {
        const connection = await getMongoConnection();
        const serviceInvoiceRepository = new ServiceInvoiceMongooseRepository(
            connection
        );

        const useCase = new UpdateServiceInvoiceUseCase(
            serviceInvoiceRepository,
        );

        const updatedInvoice = await useCase.execute(serviceInvoiceId,data);

        return updatedInvoice;
    }

}

export { InvoiceService };
