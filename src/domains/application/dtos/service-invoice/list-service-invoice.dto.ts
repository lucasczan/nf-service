import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";

export interface IListServiceInvoicesDTO {
    document: string;
    status?: string;
    name?: string;
    page: number;
    search?: string;
    recordsPerPage: number;
}

export type IListInvoicesParams = Pick<IListServiceInvoicesDTO, "document">;
export type IListInvoicesQuery = Omit<IListServiceInvoicesDTO, "document">;

export interface IListInvoicesResponseDTO {
    invoices: ServiceInvoice["props"][];
    pagination: {
        page: number;
        recordsPerPage: number;
        totalRecords: number;
        totalPages: number;
    };
    counters: {
        pending: number;
        success: number;
        failed: number;
        processing: number;
        canlled: number;
    };
}
