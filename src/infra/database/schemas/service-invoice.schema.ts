import { Schema, Document } from "mongoose";
import { SERVICE_INVOICE_STATUS_ENUM } from "../../../domains/enterprise/entities/service-invoice";

export interface ServiceInvoiceDocument extends Document {
    id: string;
    issueDate: Date;
    status: SERVICE_INVOICE_STATUS_ENUM;
    notes?: string;
    provider: {
        document: string;
        municipal_registration: string;
        municipality_code: string;
    };
    customer: {
        document: string;
        document_type: "cpf" | "cnpj";
        companyName?: string;
        email: string;
        address: {
            street_name: string;
            number: string;
            complement?: string;
            neighborhood: string;
            municipality_code: string;
            state: string;
            zip_code: string;
        };
    };
    service: {
        tax_rate: number;
        description: string;
        with_held_iss: boolean;
        service_list_item: string;
        municipal_tax_code: string;
        service_value: number;
    };
    created_at: Date;
    updated_at: Date;
}

const ServiceInvoiceSchema = new Schema<ServiceInvoiceDocument>(
    {
        id: { type: String, required: true, index: true },
        issueDate: { type: Date, required: true },
        status: {
            type: String,
            required: true,
            enum: Object.values(SERVICE_INVOICE_STATUS_ENUM),
            default: SERVICE_INVOICE_STATUS_ENUM.PENDING,
        },
        notes: { type: String, default: "" },
        provider: {
            document: { type: String, required: true },
            municipal_registration: { type: String, required: true },
            municipality_code: { type: String, required: true },
        },
        customer: {
            document: { type: String, required: false },
            document_type: {
                type: String,
                required: false,
                enum: ["cpf", "cnpj"],
            },
            companyName: { type: String },
            email: { type: String, required: false },
            address: {
                street_name: { type: String, required: false },
                number: { type: String, required: false },
                complement: { type: String },
                neighborhood: { type: String, required: false },
                municipality_code: { type: String, required: false },
                state: { type: String, required: false },
                zip_code: { type: String, required: false },
            },
        },
        service: {
            tax_rate: { type: Number, required: true },
            description: { type: String, required: true },
            with_held_iss: { type: Boolean, required: true },
            service_list_item: { type: String, required: true },
            municipal_tax_code: { type: String, required: true },
            service_value: { type: Number, required: true },
        },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    {
        collection: "service_invoices",
    }
);

export { ServiceInvoiceSchema };
