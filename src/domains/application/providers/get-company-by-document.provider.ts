import { IGetCompanyDTO } from "../dtos/provider/get-company.dto";

interface IGetCompanyProvider {
    getCompanyByDocument(document: string): Promise<IGetCompanyDTO>;
}

export type { IGetCompanyProvider };
