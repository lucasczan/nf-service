import { ServiceInovoiceNotFoundException } from "src/domains/application/exceptions/service-invoice-not-found.exception";
import { IInvoiceRepository } from "src/domains/application/repositories/invoice.repository";
import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";

class InMemoryServiceInvoiceRepository implements IInvoiceRepository {
    private static instance: InMemoryServiceInvoiceRepository | null = null;

    invoices: ServiceInvoice["props"][] = [];

    private constructor() {}

    findById(id: ServiceInvoice["id"]): Promise<ServiceInvoice | null> {
        throw new Error("Method not implemented.");
    }
    update(
        id: ServiceInvoice["id"],
        data: Partial<ServiceInvoice>
    ): Promise<ServiceInvoice> {
        throw new Error("Method not implemented.");
    }

    async create(invoice: ServiceInvoice): Promise<ServiceInvoice> {
        this.invoices.push(invoice.props);
        return Promise.resolve(invoice);
    }

    //@ts-expect-error
    async list(filters: {
        document: string;
        page: number;
        recordsPerPage: number;
    }): Promise<ServiceInvoice[]> {
        const filteredInvoices = this.invoices.filter(
            (invoice) => invoice.provider.document === filters.document
        );

        const invoicesDomain = filteredInvoices.map((invoice) => {
            return ServiceInvoice.create(invoice, invoice.id);
        });

        return invoicesDomain;
    }

    static getInstance(): InMemoryServiceInvoiceRepository {
        if (!InMemoryServiceInvoiceRepository.instance) {
            InMemoryServiceInvoiceRepository.instance =
                new InMemoryServiceInvoiceRepository();
        }
        return InMemoryServiceInvoiceRepository.instance;
    }
}

export { InMemoryServiceInvoiceRepository };
