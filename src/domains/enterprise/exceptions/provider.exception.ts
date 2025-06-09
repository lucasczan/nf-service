import { EntityException } from "./entity.exception";

class ProviderException extends EntityException {
    constructor(message: string, statusCode?: number) {
        super(`Provider: ${message}`, statusCode);
        this.name = 'ProviderException'
    }
}

export { ProviderException }
