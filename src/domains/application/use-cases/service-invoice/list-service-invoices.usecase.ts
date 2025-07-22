import type {
    IListServiceInvoicesDTO,
    IListInvoicesResponseDTO,
} from "../../dtos/service-invoice/list-service-invoice.dto";
import type { IInvoiceRepository } from "../../repositories/invoice.repository";

class ListServiceInvoicesUseCase {
    constructor(private invoiceRepository: IInvoiceRepository) { }

    async execute(
        filters: IListServiceInvoicesDTO
    ): Promise<IListInvoicesResponseDTO> {
        const { page, recordsPerPage } = filters;

        const { invoices, totalRecords, totalStatus } =
            await this.invoiceRepository.list(filters);

        return {
            invoices: invoices.map((inv) => inv.props),
            counters: totalStatus,
            pagination: {
                page,
                recordsPerPage,
                totalRecords: totalRecords,
                totalPages: Math.ceil(totalRecords / recordsPerPage),
            },
        };
    }
}

export { ListServiceInvoicesUseCase };
