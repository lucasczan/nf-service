import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import type { ICreateProviderDTO } from "src/domains/application/dtos/create-provider.dto";
import { ProviderService } from "./provider.service";
import { IUpdateProviderDTO } from "src/domains/application/dtos/update-provider.dto";

@Controller("/providers")
class ProviderController {
    constructor(private providerService: ProviderService) {}
    @Post()
    create(@Body() body: ICreateProviderDTO) {
        const {
            document,
            municipal_registration,
            address,
            company_is_active,
            company_name,
            main_CNAE,
            mei_optant,
            simples_nacional_optant,
            services,
        } = body;

        return this.providerService.createProvider({
            document,
            municipal_registration,
            address,
            company_is_active,
            company_name,
            main_CNAE,
            mei_optant,
            simples_nacional_optant,
            services,
        });
    }

    @Get(":document")
    getProviderPerDocument(@Param("document") document: string) {
        return this.providerService.getProviderByDocument(document);
    }

    @Patch(":id")
    updateProvider(@Param("id") id: string, @Body() body: IUpdateProviderDTO) {
        const {
            document,
            municipal_registration,
            municipal_tax_code,
            municipality_code,
        } = body;
        return this.providerService.updatedProvider(id, {
            document,
            municipal_registration,
            municipal_tax_code,
            municipality_code,
        });
    }
}
export { ProviderController };
