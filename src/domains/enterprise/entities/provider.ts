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
        if (!props.document)
            throw new ProviderException("document is required");
        if (!props.municipal_registration)
            throw new ProviderException("municipal_registration is required");
    }
}

export { Provider };
