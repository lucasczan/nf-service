import { SERVICE_INVOICE_STATUS_ENUM, ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";
import { IInvoiceRepository } from "../../repositories/invoice.repository";
import { ServiceInovoiceNotFoundException } from "../../exceptions/service-invoice-not-found.exception";
import { IUpdateServiceInvoiceDTO } from "../../dtos/service-invoice/update-service-invoice.dto";
import { ServiceInvoiceCannotBeUpdatedException } from "../../exceptions/service-invoice-cannot-be-updated.exception";

class UpdateServiceInvoiceUseCase {
    constructor(private readonly serviceInvoiceRepository: IInvoiceRepository) {}

    async execute(serviceInvoiceId: ServiceInvoice["id"], data: IUpdateServiceInvoiceDTO) {
        const {customer, service } = data;
        const statusAllowed = [SERVICE_INVOICE_STATUS_ENUM.FAILED, SERVICE_INVOICE_STATUS_ENUM.PENDING, SERVICE_INVOICE_STATUS_ENUM]

        if(!customer && !service) {
            throw new ServiceInvoiceCannotBeUpdatedException('You must provade service or customer property.');
        }
        
        const serviceInvoice = await this.serviceInvoiceRepository.findById(serviceInvoiceId);
      
    
        if(!serviceInvoice) {
            throw new ServiceInovoiceNotFoundException();
        }
        
          
        if(!statusAllowed.includes(serviceInvoice?.status)) {
            throw new ServiceInvoiceCannotBeUpdatedException(`You can not update an invoice in ${serviceInvoice.status} status.`)
        }

        if(customer) {
            serviceInvoice.customer = customer;
        }

        if(service) {
            serviceInvoice.service = service;
        }

        const updatedServiceInvoice = await this.serviceInvoiceRepository.update(serviceInvoiceId, serviceInvoice);
        return updatedServiceInvoice.props;
    }
}

export { UpdateServiceInvoiceUseCase };