import { Module } from "@nestjs/common";
import { ProviderController } from "./provider.controller";
import { ProviderService } from "./provider.service";
import {
} from "src/infra/database/schemas/provider.schema";

@Module({
	imports: [],
	controllers: [ProviderController],
	providers: [ProviderService],
	exports: [],
})
export class ProviderModule {}
