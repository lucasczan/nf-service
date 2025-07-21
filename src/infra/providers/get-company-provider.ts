import { IGetCompanyDTO } from "src/domains/application/dtos/provider/get-company.dto";
import { IGetCompanyProvider } from "src/domains/application/providers/get-company-by-document.provider";


class GetCompanyProvider implements IGetCompanyProvider {
    getCompanyByDocument(document: string): Promise<IGetCompanyDTO> {
        const mock = {
            cnae_principal: '6201500',
            cnpj: document,
            endereco: {
                bairro: 'Centro',
                cep: '01001-000',
                codigo_ibge: '3550308',
                codigo_municipio: '3550308',
                codigo_siafi: '7107',
                complemento: 'Sala 101',
                logradouro: 'Avenida Paulista',
                nome_municipio: 'São Paulo',
                numero: '1000',
                uf: 'SP',
            },
            optante_mei: false,
            optante_simples_nacional: true,
            razao_social: 'Empresa Exemplo LTDA',
            situacao_cadastral: 'ativa',
        }

        const extracted: IGetCompanyDTO = {
            document: mock.cnpj,
            company_name: mock.razao_social,
            company_is_active: mock.situacao_cadastral === 'ativa',
            main_CNAE: mock.cnae_principal,
            simples_nacional_optant: mock.optante_simples_nacional,
            mei_optant: mock.optante_mei,
            municipal_registration: '',
            address: {
                municipality_code: mock.endereco.codigo_municipio,
                siafi_code: mock.endereco.codigo_siafi,
                ibge_code: mock.endereco.codigo_ibge,
                municipality_name: mock.endereco.nome_municipio,
                street_name: mock.endereco.logradouro,
                complement: mock.endereco.complemento,
                number: mock.endereco.numero,
                neighborhood: mock.endereco.bairro,
                zip_code: mock.endereco.cep,
                state: mock.endereco.uf,
            }
        };

        return Promise.resolve(extracted);
    }

}

export { GetCompanyProvider }