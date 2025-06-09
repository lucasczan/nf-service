import { randomUUID } from "node:crypto";
import { ServiceInvoiceException } from "../exceptions/service-invoice.exception";
import { Provider } from "./provider";

// Interface com estrutura dos dados obrigatórios

export enum SERVICE_INVOICE_STATUS_ENUM {
    PENDING = "pending",
    SUCCESS = "success",
    CANCELLED = "cancelled",
    PROCESSING = "processing",
    FAILED = "failed",
}

interface IProps {
    issueDate: string; // "data_emissao"
    status?: SERVICE_INVOICE_STATUS_ENUM; // "status"
    notes?: string; // "observacoes"
    provider: {
        document: string;
        municipal_registration: Provider["municipal_registration"]; // registro municipal
        municipality_code: Provider["props"]["address"]["municipality_code"]; // "codigo_municipio"
    };
    customer: {
        document: string;
        document_type: "cpf" | "cnpj";
        companyName?: string; // "razao_social"
        email: string;
        address: {
            street_name: string; // "logradouro"
            number: string;
            complement?: string;
            neighborhood: string; // "bairro"
            municipality_code: string; // "codigo_municipio"
            state: string; // "uf"
            zip_code: string; // "cep"
        };
    };
    service: {
        tax_rate: number; // "aliquota"
        description: string; // "discriminacao"
        with_held_iss: boolean; // "iss_retido"
        service_list_item: string; // "item_lista_servico"
        municipal_tax_code: string; // "codigo_tributario_municipio"
        service_value: number; // "valor_servicos"
    };
    created_at?: string;
    updated_at?: string;
}

class ServiceInvoice {
    private _props: IProps;
    private _id: string;

    private constructor(props: IProps, id?: string) {
        this._id = id ?? randomUUID();
        this._props = {
            status: props.status ?? SERVICE_INVOICE_STATUS_ENUM.PENDING,
            notes: props.notes ?? "",
            ...props,
            created_at: props.created_at ?? new Date().toISOString(),
            updated_at: props.updated_at ?? new Date().toISOString(),
        };
    }

    get props() {
        return {
            id: this._id,
            ...this._props,
        };
    }

    get status() {
        return this.props.status || SERVICE_INVOICE_STATUS_ENUM.PENDING;
    }

    get id() {
        return this._id;
    }

    set status(status: SERVICE_INVOICE_STATUS_ENUM) {
        this._props.status = status;
        this.touch()
    }

    get service() {
        return this._props.service
    }

    set notes(notes: string) {
        this._props.notes = notes;
        this.touch()
    }


    set customer(customer: IProps["customer"]) {
        ServiceInvoice.validateCustomer(customer);
        this._props.customer = customer;
        this.touch()
    }

    set service(service: IProps["service"]) {
        ServiceInvoice.validateService(service);
        this._props.service = service;
        this.touch()
    }

    static create(props: IProps, id?: string) {
        ServiceInvoice.validate(props);
        return new ServiceInvoice(props, id);
    }

    private static validateCustomer(customer: IProps["customer"]) {
        if (!customer)
            throw new ServiceInvoiceException("customer is required");
        if (!customer.document)
            throw new ServiceInvoiceException("customer.document is required");
        if (!customer.document_type)
            throw new ServiceInvoiceException(
                "customer.document_type is required"
            );
        if (!customer.email)
            throw new ServiceInvoiceException("customer.email is required");
    }

    private static validateService(service: IProps["service"]) {
        if (!service) throw new ServiceInvoiceException("service is required");
        if (typeof service.tax_rate !== "number")
            throw new ServiceInvoiceException(
                "service.taxRate must be a number"
            );
        if (!service.description)
            throw new ServiceInvoiceException(
                "service.description is required"
            );
        if (typeof service.with_held_iss !== "boolean")
            throw new ServiceInvoiceException(
                "service.withheldIss must be a boolean"
            );
        if (!service.service_list_item)
            throw new ServiceInvoiceException(
                "service.serviceListItem is required"
            );
        if (!service.municipal_tax_code)
            throw new ServiceInvoiceException(
                "service.municipalTaxCode is required"
            );
        if (typeof service.service_value !== "number")
            throw new ServiceInvoiceException(
                "service.serviceValue must be a number"
            );
    }

    // Validação de todos os campos obrigatórios
    private static validate(props: IProps) {
        if (!props.issueDate)
            throw new ServiceInvoiceException("issueDate is required");
        if (!props.provider)
            throw new ServiceInvoiceException("provider is required");

        const customer = props.customer;

        this.validateCustomer(customer);

        const address = customer.address;

        if (!address)
            throw new ServiceInvoiceException("customer.address is required");

        // if (!address.street_name)
        //     throw new ServiceInvoiceException(
        //         "customer.address.street_name is required"
        //     );
        // if (!address.number)
        //     throw new ServiceInvoiceException(
        //         "customer.address.number is required"
        //     );
        // if (!address.neighborhood)
        //     throw new ServiceInvoiceException(
        //         "customer.address.neighborhood is required"
        //     );
        // if (!address.municipality_code)
        //     throw new ServiceInvoiceException(
        //         "customer.address.municipality_code is required"
        //     );
        // if (!address.state)
        //     throw new ServiceInvoiceException(
        //         "customer.address.state is required"
        //     );
        // if (!address.municipality_code)
        //     throw new ServiceInvoiceException(
        //         "customer.address.municipality_code is required"
        //     );

        const service = props.service;
        this.validateService(service);
    }

    private touch() {
        this._props.updated_at = new Date().toISOString();
    }
}

export { ServiceInvoice };
