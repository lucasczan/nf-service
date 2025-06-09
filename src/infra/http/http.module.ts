import { Module } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { ProviderModule } from "./provider/provider.module";
import { ServiceInvoiceModule } from "./service-invoice/service-invoice.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [
		AppModule,
		ProviderModule,
		ServiceInvoiceModule,
		MongooseModule,
		MongooseModule.forRoot(
			"mongodb://root:example@localhost:27017/nf-service?authSource=admin",
		),
	],
	controllers: [],
	providers: [],
})
export class HttpModule {}
