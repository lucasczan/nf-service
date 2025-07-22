import { Document, Schema } from "mongoose";

export interface ProviderDocument extends Document {
    id: string;
    document: string;
    company_name: string;
    company_is_active: boolean;
    main_CNAE: string;
    simples_nacional_optant?: boolean;
    mei_optant: boolean;
    municipal_registration: string;
    external_id: string; // ID externo para integração com outros sistemas
    address: {
        municipality_code: string;
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
    created_at: Date;
    updated_at: Date;
}

const ProviderSchema = new Schema<ProviderDocument>(
    {
        id: { type: String, required: true, index: true },
        document: { type: String, required: true },
        company_name: { type: String, required: true },
        company_is_active: { type: Boolean, required: true },
        main_CNAE: { type: String, required: true },
        simples_nacional_optant: { type: Boolean },
        mei_optant: { type: Boolean, required: true },
        municipal_registration: { type: String, required: true },
        external_id: { type: String, required: true },
        address: {
            municipality_code: { type: String, required: true },
            siafi_code: { type: String, required: true },
            ibge_code: { type: String, required: true },
            municipality_name: { type: String, required: true },
            street_name: { type: String, required: true },
            complement: { type: String, required: true },
            number: { type: String, required: true },
            neighborhood: { type: String, required: true },
            zip_code: { type: String, required: true },
            state: { type: String, required: true },
        },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    {
        collection: "providers",
    }
);

export { ProviderSchema };
