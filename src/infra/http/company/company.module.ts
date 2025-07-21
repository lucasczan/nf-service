import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";

@Module({
    imports: [],
    controllers: [CompanyController],
    providers: [],
    exports: []
})
export class CompanyModule { }