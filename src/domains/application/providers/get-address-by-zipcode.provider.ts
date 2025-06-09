export interface IAddress {
	street_name: string;
	number: string;
	complement: string;
	neighborhood: string;
	state: string;
	zip_code: string;
	city_code: string;
}

interface IGetAddressByZipcode {
	getAddress(zipcode: string): Promise<IAddress>;
}

export type { IGetAddressByZipcode };
