import { Module } from "@nestjs/common";
import { InvoiceController } from "./service-invoice.controller";
import { InvoiceService } from "./service-invoice.service";
import { ProviderModule } from "../provider/provider.module";

@Module({
	imports: [ProviderModule],
	controllers: [InvoiceController],
	providers: [InvoiceService],
})
export class ServiceInvoiceModule {}
