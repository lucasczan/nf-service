import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";
import type { ICreateInvoiceDTO } from "../../dtos/service-invoice/create-service-invoice.dto";
import type { IProviderRepository } from "../../repositories/provider.repository";
import type { IInvoiceRepository } from "../../repositories/invoice.repository";
import { ProviderNotFoundException } from "../../exceptions/provider-not-found.exception";

class CreateServiceInvoiceUseCase {
    constructor(
        private providerRepository: IProviderRepository,
        private invoiceRepository: IInvoiceRepository
    ) {}

    async execute(
        createInvoiceDTO: ICreateInvoiceDTO
    ): Promise<ServiceInvoice["props"]> {
        const provider = await this.providerRepository.findByDocument(
            createInvoiceDTO.provider.document
        );

        if (!provider) throw new ProviderNotFoundException();

        const invoice = ServiceInvoice.create({
            issueDate: createInvoiceDTO.issueDate,
            provider: {
                document: provider.document,
                municipal_registration: provider.municipal_registration,
                municipality_code: provider.props.address.municipality_code,
            },
            customer: createInvoiceDTO.customer,
            service: createInvoiceDTO.service,
        });

        const createdInvoide = await this.invoiceRepository.create(invoice);

        return createdInvoide.props;
    }
}

export { CreateServiceInvoiceUseCase };
