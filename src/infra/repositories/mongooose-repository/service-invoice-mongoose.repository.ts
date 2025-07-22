import { Connection, Model } from "mongoose";
import {
    IInvoiceRepository,
    IListServiceInvoiceRepositoryReturn,
} from "src/domains/application/repositories/invoice.repository";
import { IListServiceInvoicesDTO } from "src/domains/application/dtos/service-invoice/list-service-invoice.dto";
import {
    SERVICE_INVOICE_STATUS_ENUM,
    ServiceInvoice,
} from "src/domains/enterprise/entities/service-invoice";
import {
    ServiceInvoiceDocument,
    ServiceInvoiceSchema,
} from "src/infra/database/schemas/service-invoice.schema";
import { ServiceInovoiceNotFoundException } from "src/domains/application/exceptions/service-invoice-not-found.exception";

class ServiceInvoiceMongooseRepository implements IInvoiceRepository {
    private readonly model: Model<ServiceInvoiceDocument>;

    constructor(connection: Connection) {
        this.model = connection.model<ServiceInvoiceDocument>(
            "ServiceInvoice",
            ServiceInvoiceSchema
        );
    }

    async create(invoice: ServiceInvoice): Promise<ServiceInvoice> {
        const created = await this.model.create(invoice.props);
        return this.toDomain(created);
    }

    async list(
        filters: IListServiceInvoicesDTO
    ): Promise<IListServiceInvoiceRepositoryReturn> {
        const { external_id, page, recordsPerPage, name, search, status } =
            filters;

        const skip = (page - 1) * recordsPerPage;

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const query: any = { "provider.external_id": external_id };

        if (status) query.status = status;

        if (search) {
            const searchNumber = Number(search);
            // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
            const isNumber = !isNaN(searchNumber);

            query.$or = [
                { "customer.email": { $regex: search, $options: "i" } },
                ...(isNumber
                    ? [{ "service.service_value": searchNumber }]
                    : []),
            ];
        }

        const [totalRecords, results, aggregates] = await Promise.all([
            this.model.countDocuments(query),

            this.model.find(query).skip(skip).limit(recordsPerPage),

            this.model.aggregate([
                { $match: { "provider.external_id": external_id } },
                {
                    $group: {
                        _id: "$status",
                        total: { $sum: "$service.service_value" },
                    },
                },
            ]),
        ]);

        let totalStatus = {
            success: 0,
            pending: 0,
            cancelled: 0,
            failed: 0,
            processing: 0,
        };

        for (const status of aggregates) {
            totalStatus = { ...totalStatus, [status._id]: status.total };
        }

        return {
            invoices: results.map(this.toDomain),
            totalRecords,
            totalStatus:
                totalStatus as unknown as IListServiceInvoiceRepositoryReturn["totalStatus"],
        };
    }

    async findById(id: ServiceInvoice["id"]): Promise<ServiceInvoice | null> {
        const found = await this.model.findOne({ id });
        if (!found) return null;
        return this.toDomain(found);
    }

    async update(
        id: ServiceInvoice["id"],
        data: ServiceInvoice
    ): Promise<ServiceInvoice> {
        const updated = await this.model.findOneAndUpdate(
            { id },
            data.props,
            {
                new: true,
            }
        );
        if (!updated) throw new ServiceInovoiceNotFoundException();
        return this.toDomain(updated);
    }

    private toDomain(document: ServiceInvoiceDocument): ServiceInvoice {
        return ServiceInvoice.create(
            {
                issue_date: document.issue_date.toISOString(),
                status: document.status as SERVICE_INVOICE_STATUS_ENUM,
                notes: document.notes,
                provider: document.provider,
                customer: document.customer,
                service: document.service,
                created_at: document.created_at.toISOString(),
                updated_at: document.updated_at.toISOString(),
            },
            document.id
        );
    }
}

export { ServiceInvoiceMongooseRepository };
