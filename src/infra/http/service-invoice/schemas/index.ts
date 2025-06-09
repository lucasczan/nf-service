import * as z from "zod";

const emmitInvoicesSchema = z.array(z.string());

export { emmitInvoicesSchema };
