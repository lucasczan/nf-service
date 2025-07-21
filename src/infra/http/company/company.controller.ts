import { Controller, Get, Param } from "@nestjs/common";
import { IGetCompanyDTO } from "src/domains/application/dtos/provider/get-company.dto";
import { GetCompanyDataByDocumentUseCase } from "src/domains/application/use-cases/company/get-company-by-document.usecase";
import { GetCompanyProvider } from "src/infra/providers/get-company-provider";


@Controller("companies")
class CompanyController {
    @Get(":document")
    async getCompanyByDocument(@Param() params: { document: string }): Promise<IGetCompanyDTO> {
        const { document } = params;

        const companyProvider = new GetCompanyProvider();
        const useCase = new GetCompanyDataByDocumentUseCase(companyProvider);
        const companyData = await useCase.execute(document);
        return companyData;
    }
}

export { CompanyController }