import { SERVICE_INVOICE_STATUS_ENUM } from "src/domains/enterprise/entities/service-invoice";
import { ServiceInovoiceNotFoundException } from "../../exceptions/service-invoice-not-found.exception";
import { IInvoiceRepository } from "../../repositories/invoice.repository";
import { ServiceInovoiceAlreadyCancelledException } from "../../exceptions/service-invoice-already-cancelled.exception";
import { ServiceInvoiceCannotBeCannceledException } from "../../exceptions/service-invoice-cannot-be-cannceled";

class CancelServiceInvoiceUseCase {
    constructor(private readonly serviceInvoiceRepository: IInvoiceRepository) {}
    async execute(serviceInvoiceId: string) {
        const serviceInvoice = await this.serviceInvoiceRepository.findById(serviceInvoiceId);
        const statusPermittedToCancel = [SERVICE_INVOICE_STATUS_ENUM.PENDING, SERVICE_INVOICE_STATUS_ENUM.PROCESSING];

        if (!serviceInvoice) {
            throw new ServiceInovoiceNotFoundException();
        }

        if(serviceInvoice.status === SERVICE_INVOICE_STATUS_ENUM.CANCELLED) {
            throw new ServiceInovoiceAlreadyCancelledException();
        }

        if(!statusPermittedToCancel.includes(serviceInvoice.status)) {
            throw new ServiceInvoiceCannotBeCannceledException();
        }

        serviceInvoice.status = SERVICE_INVOICE_STATUS_ENUM.CANCELLED;

        await this.serviceInvoiceRepository.update(serviceInvoice.id, serviceInvoice);
    }
}

export { CancelServiceInvoiceUseCase };