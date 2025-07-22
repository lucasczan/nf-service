import { randomUUID } from "node:crypto";
import { ProviderException } from "../exceptions/provider.exception";

export interface IService {
    tax_rate: number; //aliquota
    description: string;
    service_list_item: string; // buscar na api
    municipal_tax_code: string; // buscar na apu
}

export interface IProviderProps {
    document: string; // Cadastro Nacional da Pessoa Jurídica(identificação da empresa no Brasil)
    company_name: string;
    company_is_active: boolean; // situação cadastral
    main_CNAE: string;
    simples_nacional_optant?: boolean;
    mei_optant: boolean;
    municipal_registration: string; //Inscrição municipal da empresa (registro na prefeitura)
    external_id: string; // ID externo para integração com outros sistemas
    address: {
        municipality_code: string; // Código do município segundo o IBGE (neste caso, representa o município do prestador)
        siafi_code: string;
        ibge_code: string;
        municipality_name: string;
        street_name: string;
        complement: string;
        number: string;
        neighborhood: string;
        zip_code: string;
        state: string;
    };
    services?: IService[];
    created_at?: string;
    updated_at?: string;
}

class Provider {
    private _props: IProviderProps;
    private _id: string;

    private constructor(props: IProviderProps, id?: string) {
        this._id = id ?? randomUUID();
        this._props = {
            ...props,
            services: props.services ?? [],
            created_at: props.created_at ?? new Date().toISOString(),
            updated_at: props.updated_at ?? new Date().toISOString(),
        };
    }

    get props() {
        return {
            id: this._id,
            ...this._props,
        };
    }

    get id() {
        return this._id;
    }

    get document() {
        return this._props.document;
    }
    get municipal_registration() {
        return this._props.municipal_registration;
    }

    set document(document: string) {
        this._props.document = document;
        this._props.updated_at = new Date().toISOString();
    }
    set municipal_registration(municipal_registration: string) {
        this._props.municipal_registration = municipal_registration;
        this._props.updated_at = new Date().toISOString();
    }

    static create(props: IProviderProps, id?: string) {
        Provider.validate(props);
        return new Provider(props, id);
    }

    private static validate(props: IProviderProps) {
        console.log(props, "Provider props validated successfully");

        if (!props.document)
            throw new ProviderException("document is required");
        if (!props.municipal_registration)
            throw new ProviderException("municipal_registration is required");
        if (!props.company_name)
            throw new ProviderException("company_name is required");
        if (!props.main_CNAE)
            throw new ProviderException("main_CNAE is required");
        if (!props.address)
            throw new ProviderException("address is required");
        if (!props.address.municipality_code)
            throw new ProviderException("address.municipality_code is required");
        if (!props.address.siafi_code)
            throw new ProviderException("address.siafi_code is required");
        if (!props.address.ibge_code)
            throw new ProviderException("address.ibge_code is required");
        if (!props.address.municipality_name)
            throw new ProviderException("address.municipality_name is required");
        if (!props.address.street_name)
            throw new ProviderException("address.street_name is required");
        if (!props.address.complement)
            throw new ProviderException("address.complement is required");
        if (!props.address.number)
            throw new ProviderException("address.number is required");
        if (!props.address.neighborhood)
            throw new ProviderException("address.neighborhood is required");
        if (!props.address.zip_code)
            throw new ProviderException("address.zip_code is required");
        if (!props.address.state)
            throw new ProviderException("address.state is required");
        if (!props.external_id)
            throw new ProviderException("external_id is required");

    }
}

export { Provider };
