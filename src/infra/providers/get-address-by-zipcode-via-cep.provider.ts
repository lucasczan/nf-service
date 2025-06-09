import { AppException } from "src/core/exceptions/app.exception";
import {
    IAddress,
    IGetAddressByZipcode,
} from "src/domains/application/providers/get-address-by-zipcode.provider";

class GetAddressByZipcodeViaCep implements IGetAddressByZipcode {
    async getAddress(zipcode: string): Promise<IAddress> {
        const response = await fetch(
            `https://viacep.com.br/ws/${zipcode}/json/`,
            {
                method: "GET",
            }
        ).catch(() => {
            throw new AppException("VIA CEP error.", 400);
        });

        return response.json();
    }
}

export { GetAddressByZipcodeViaCep };
