import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";
import type { IListServiceInvoicesDTO } from "../dtos/service-invoice/list-service-invoice.dto";

export interface IListServiceInvoiceRepositoryReturn {
    invoices: ServiceInvoice[];
    totalRecords: number;
    totalStatus: {
        pending: number;
        success: number;
        failed: number;
        processing: number;
        canlled: number;
    };
}
interface IInvoiceRepository {
    create(invoice: ServiceInvoice): Promise<ServiceInvoice>;
    list(
        filters: IListServiceInvoicesDTO
    ): Promise<IListServiceInvoiceRepositoryReturn>;
    findById(id: ServiceInvoice["id"]): Promise<ServiceInvoice | null>;
    update(
        id: ServiceInvoice["id"],
        data: ServiceInvoice
    ): Promise<ServiceInvoice>;
}

export type { IInvoiceRepository };
