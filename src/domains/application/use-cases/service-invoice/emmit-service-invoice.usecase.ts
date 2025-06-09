import {
    SERVICE_INVOICE_STATUS_ENUM,
    ServiceInvoice,
} from "src/domains/enterprise/entities/service-invoice";
import type { IInvoiceRepository } from "../../repositories/invoice.repository";
import { IEmmitInvoiceDTO } from "../../dtos/service-invoice/emmit-service-invoice.dto";

type InvoicesReturnType = {
    success: ServiceInvoice["props"][];
    failed: ServiceInvoice["props"][];
    notFound: IEmmitInvoiceDTO;
};

class EmmitServiceInvoiceUseCase {
    private successList: ServiceInvoice[] = [];
    private failedList: ServiceInvoice[] = [];
    private notFoundlist: IEmmitInvoiceDTO = [];

    constructor(private invoiceRepository: IInvoiceRepository) {}

    private validate(invoice: ServiceInvoice) {
        const validations = [
            {
                valid: !!invoice.props.customer.address.municipality_code,
                message:
                    "Não foi possível emitir a nota fiscal, pois o código do município é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.address.state,
                message:
                    "Não foi possível emitir a nota fiscal, pois o estado é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.address.zip_code,
                message:
                    "Não foi possível emitir a nota fiscal, pois o CEP é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.address.street_name,
                message:
                    "Não foi possível emitir a nota fiscal, pois o nome da rua é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.address.number,
                message:
                    "Não foi possível emitir a nota fiscal, pois o número é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.address.neighborhood,
                message:
                    "Não foi possível emitir a nota fiscal, pois o bairro é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.document,
                message:
                    "Não foi possível emitir a nota fiscal, pois o CPF/CNPJ é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.document_type,
                message:
                    "Não foi possível emitir a nota fiscal, pois o tipo de documento é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.email,
                message:
                    "Não foi possível emitir a nota fiscal, pois o email é obrigatório.",
            },
            {
                valid: !!invoice.props.customer.companyName,
                message:
                    "Não foi possível emitir a nota fiscal, pois a razão social/Nome do cliente é obrigatória.",
            },
            {
                valid: !!invoice.props.service.tax_rate,
                message:
                    "Não foi possível emitir a nota fiscal, pois a alíquota é obrigatória.",
            },
            {
                valid: !!invoice.props.service.description,
                message:
                    "Não foi possível emitir a nota fiscal, pois a descrição do serviço é obrigatória.",
            },
            {
                valid: !!invoice.props.service.service_list_item,
                message:
                    "Não foi possível emitir a nota fiscal, pois o item da lista de serviço é obrigatório.",
            },
            {
                valid: !!invoice.props.service.municipal_tax_code,
                message:
                    "Não foi possível emitir a nota fiscal, pois o código tributário municipal é obrigatório.",
            },
            {
                valid: !!invoice.props.service.service_value,
                message:
                    "Não foi possível emitir a nota fiscal, pois o valor do serviço é obrigatório.",
            },
        ];

        for (const rule of validations) {
            if (!rule.valid) {
                invoice.notes = rule.message;
                invoice.status = SERVICE_INVOICE_STATUS_ENUM.FAILED;
                return invoice;
            }
        }

        return invoice;
    }

    private filterInvoice(invoice: ServiceInvoice) {
        const igonredInvoices = [
            SERVICE_INVOICE_STATUS_ENUM.SUCCESS,
            SERVICE_INVOICE_STATUS_ENUM.PROCESSING,
        ];

        return igonredInvoices.includes(invoice.status);
    }

    async execute(
        EmmitServiceInvoiceDTO: IEmmitInvoiceDTO
    ): Promise<InvoicesReturnType> {
        const promissesFound: Promise<ServiceInvoice | null>[] = [];
        const updatedPromisses: Promise<ServiceInvoice>[] = [];

        for (const invoiceID of EmmitServiceInvoiceDTO) {
            const invoiceFound = this.invoiceRepository.findById(invoiceID);
            promissesFound.push(invoiceFound);
        }

        const resolvedFound = await Promise.all(promissesFound);

        for (const [index, invoiceFound] of resolvedFound.entries()) {
            if (!invoiceFound) {
                this.notFoundlist.push(EmmitServiceInvoiceDTO[index]);
                continue;
            }

            if (this.filterInvoice(invoiceFound)) continue;

            const validatedInvoice = this.validate(invoiceFound);

            if (
                validatedInvoice.status === SERVICE_INVOICE_STATUS_ENUM.FAILED
            ) {
                this.failedList.push(invoiceFound);
                continue;
            }

            validatedInvoice.status = SERVICE_INVOICE_STATUS_ENUM.PROCESSING;
            this.successList.push(validatedInvoice);
        }

        const updateList = [...this.successList, ...this.failedList];

        for (const invoice of updateList) {
            const updatedPromise = this.invoiceRepository.update(
                invoice.id,
                invoice
            );
            updatedPromisses.push(updatedPromise);
        }

        await Promise.all(updatedPromisses);
        //todo dispatch invoice to partner

        return {
            success: this.successList.map((item) => item.props),
            failed: this.failedList.map((item) => item.props),
            notFound: this.notFoundlist,
        };
    }
}

export { EmmitServiceInvoiceUseCase };
