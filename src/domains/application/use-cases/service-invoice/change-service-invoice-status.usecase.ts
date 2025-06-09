import {
    SERVICE_INVOICE_STATUS_ENUM,
    ServiceInvoice,
} from "src/domains/enterprise/entities/service-invoice";
import type { IInvoiceRepository } from "../../repositories/invoice.repository";
import { ServiceInovoiceNotFoundException } from "../../exceptions/service-invoice-not-found.exception";
import { InvalidServiceInvoiceStatusException } from "../../exceptions/invalid-service-invoice-status.exception";

class ChangeServiceInvoiceStatusUseCase {
    constructor(private invoiceRepository: IInvoiceRepository) {}

    async execute(
        serviceInvoiceId: ServiceInvoice["id"],
        data: SERVICE_INVOICE_STATUS_ENUM
    ): Promise<ServiceInvoice["props"]> {
        if (!Object.values(SERVICE_INVOICE_STATUS_ENUM).includes(data)) {
            throw new InvalidServiceInvoiceStatusException();
        }

        const findedInvoice = await this.invoiceRepository.findById(
            serviceInvoiceId
        );

        if (!findedInvoice) {
            throw new ServiceInovoiceNotFoundException();
        }

        findedInvoice.status = data;

        const updatedInvoice = await this.invoiceRepository.update(
            serviceInvoiceId,
            findedInvoice
        );

        return updatedInvoice.props;
    }
}

export { ChangeServiceInvoiceStatusUseCase };
