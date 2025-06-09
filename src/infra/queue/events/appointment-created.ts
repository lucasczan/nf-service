import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";

interface Address {
    street_name?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    state?: string;
    zip_code?: string;
    municipality_code?: string;
}

interface Customer {
    id: string;
    name: string;
    document_type: "cpf" | "cnpj";
    document: string;
    email: string;
    phone: string;
    address: Address;
}

interface Body {
    document: string;
    customer: Customer;
    service: ServiceInvoice["props"]["service"];
    created_at: string;
    updated_at: string;
}

interface IAppointmentCreatedEvent {
    id: "appointment-created";
    body: Body;
    dispatched_at: string;
}

export type { IAppointmentCreatedEvent };
