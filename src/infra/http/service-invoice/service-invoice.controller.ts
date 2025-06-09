import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import type { ICreateInvoiceDTO } from "src/domains/application/dtos/service-invoice/create-service-invoice.dto";
import { InvoiceService } from "./service-invoice.service";
import type {
    IListInvoicesParams,
    IListInvoicesQuery,
} from "src/domains/application/dtos/service-invoice/list-service-invoice.dto";
import { SERVICE_INVOICE_STATUS_ENUM } from "src/domains/enterprise/entities/service-invoice";
import { IEmmitInvoiceDTO } from "src/domains/application/dtos/service-invoice/emmit-service-invoice.dto";
import { AppException } from "src/core/exceptions/app.exception";
import { emmitInvoicesSchema } from "./schemas";
import { IUpdateServiceInvoiceDTO } from "src/domains/application/dtos/service-invoice/update-service-invoice.dto";

@Controller("/invoices")
class InvoiceController {
    constructor(private invoiceService: InvoiceService) {}

    @Post()
    create(@Body() body: ICreateInvoiceDTO) {
        const {
            customer,
            issueDate,
            provider,
            status,
            service,
            notes = "",
        } = body;
        return this.invoiceService.createInvoice({
            customer,
            issueDate,
            service: service,
            notes,
            provider,
            status,
        });
    }

    @Get("/:document")
    list(
        @Param() param: IListInvoicesParams,
        @Query() query: IListInvoicesQuery
    ) {
        const { document } = param;
        const { status, name, page, recordsPerPage, search } = query;

        return this.invoiceService.listInvoices({
            document,
            status,
            name,
            search,
            page: Number(page),
            recordsPerPage: Number(recordsPerPage),
        });
    }

    @Post("/:id/status")
    changeStatus(
        @Param("id") id: string,
        @Body("status") status: SERVICE_INVOICE_STATUS_ENUM
    ) {
        return this.invoiceService.changeServiceInvoiceStatus(id, status);
    }

    @Post("/emmit")
    emmitInvoice(@Body() body: IEmmitInvoiceDTO) {
        try {
            emmitInvoicesSchema.parse(body);
            return this.invoiceService.emmitInvoice(body);
        } catch (error) {
            throw new AppException("Invalid payload", 400);
        }
    }

    @Post("/:id/cancel")
    cancelInvoice(@Param("id") id: string) {
        return this.invoiceService.cancelServiceInvoice(id);
    }

    @Patch("/:id")
    updateInvoice(@Param("id") id: string, @Body() body: IUpdateServiceInvoiceDTO) {
        return this.invoiceService.updateServiceInvoice(id, body);
    }
}

export { InvoiceController };
