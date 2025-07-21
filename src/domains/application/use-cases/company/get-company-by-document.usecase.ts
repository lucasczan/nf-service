import { AppException } from "src/core/exceptions/app.exception";
import { IGetCompanyDTO } from "../../dtos/provider/get-company.dto";
import { IGetCompanyProvider } from "../../providers/get-company-by-document.provider";


class GetCompanyDataByDocumentUseCase {
  constructor(private companyProvider: IGetCompanyProvider) { }

  async execute(document: string): Promise<IGetCompanyDTO> {
    if (!document) {
      throw new AppException('Document is required', 400);
    }

    const companyData = await this.companyProvider.getCompanyByDocument(document);

    if (!companyData) {
      throw new AppException('Company not found', 404);
    }

    return companyData;
  }
}

export { GetCompanyDataByDocumentUseCase }