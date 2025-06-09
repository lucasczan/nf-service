import { IProviderProps } from "src/domains/enterprise/entities/provider";

interface ICreateProviderDTO
    extends Omit<IProviderProps, "created_at" | "updated_at"> {}

export type { ICreateProviderDTO };
