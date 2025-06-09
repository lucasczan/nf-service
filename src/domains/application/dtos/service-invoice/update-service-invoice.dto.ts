import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";


type nonUpdatableProps = "id" | "created_at" | "updated_at" | "status" | 'provider' | 'notes' | "issueDate";


interface IUpdateServiceInvoiceDTO extends Omit<ServiceInvoice['props'], nonUpdatableProps> {
}

export type { IUpdateServiceInvoiceDTO };
