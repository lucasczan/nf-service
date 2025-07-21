interface IGetCompanyDTO {
    "document": string,
    "company_name": string,
    "company_is_active": boolean,
    "main_CNAE": string,
    "simples_nacional_optant": boolean,
    "mei_optant": boolean,
    "municipal_registration": string,
    "address": {
        "municipality_code": string,
        "siafi_code": string,
        "ibge_code": string,
        "municipality_name": string,
        "street_name": string,
        "complement": string,
        "number": string,
        "neighborhood": string,
        "zip_code": string,
        "state": string
    }
}

export type { IGetCompanyDTO };
