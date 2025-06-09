import { Provider } from "src/domains/enterprise/entities/provider";
import { ServiceInvoice } from "src/domains/enterprise/entities/service-invoice";

interface ICreateInvoiceDTO
    extends Omit<
        ServiceInvoice["props"],
        "id" | "created_at" | "updated_at" | "provider"
    > {
    provider: {
        document: Provider["document"];
    };
}

export type { ICreateInvoiceDTO };
