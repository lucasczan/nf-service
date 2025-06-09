import { AppException } from "src/core/exceptions/app.exception";

class EntityException extends AppException {
	constructor(message: string, statusCode = 400) {
		super(message, statusCode);
		this.name = "EntityException";
	}
}
export { EntityException };
