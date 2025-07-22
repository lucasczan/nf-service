import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";

export interface IListServiceInvoicesDTO {
    external_id: string;
    status?: string;
    name?: string;
    page: number;
    search?: string;
    recordsPerPage: number;
}

export type IListInvoicesParams = Pick<IListServiceInvoicesDTO, "external_id">;
export type IListInvoicesQuery = Omit<IListServiceInvoicesDTO, "external_id">;

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
