import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { CreateServiceInvoiceUseCase } from "src/domains/application/use-cases/service-invoice/create-invoice.usecase";
import { ProviderMongooseRepository } from "../repositories/mongooose-repository/provider-mongoose.repository";
import { ServiceInvoiceMongooseRepository } from "../repositories/mongooose-repository/service-invoice-mongoose.repository";
import { getMongoConnection } from "../database/connection/connection";
import { IAppointmentCreatedEvent } from "./events/appointment-created";
import { ProviderNotFoundException } from "src/domains/application/exceptions/provider-not-found.exception";
import { SERVICE_INVOICE_STATUS_ENUM } from "src/domains/enterprise/entities/service-invoice";

const sqsClient = new SQSClient({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
});

const queueUrl = process.env.QUEUE_URL;

async function receiveQueueMessages() {
    const connection = await getMongoConnection();
    const useCases = {
        "create-appointment": async (data: IAppointmentCreatedEvent) => {
            const providerRepository = new ProviderMongooseRepository(
                connection
            );
            const serviceInvoiceRepository =
                new ServiceInvoiceMongooseRepository(connection);
            const createInvoice = new CreateServiceInvoiceUseCase(
                providerRepository,
                serviceInvoiceRepository
            );

            const provider = await providerRepository.findByDocument(
                data.body.document
            );

            if (!provider) throw new ProviderNotFoundException();

            await createInvoice.execute({
                notes: "",
                status: SERVICE_INVOICE_STATUS_ENUM.PENDING,
                provider: {
                    document: data.body.document,
                },
                issue_date: data.body.created_at, // ok
                service: {
                    tax_rate: data.body.service.tax_rate,
                    description: data.body.service.description,
                    service_list_item: data.body.service.service_list_item,
                    service_value: data.body.service.service_value,
                    with_held_iss: data.body.service.with_held_iss,
                    municipal_tax_code: data.body.service.municipal_tax_code,
                },
                customer: {
                    email: data.body.customer.email, // ok
                    document: data.body.customer.document, // ok
                    document_type: data.body.customer.document_type, //ok
                    address: {
                        municipality_code:
                            data.body.customer.address.municipality_code ?? "",
                        number: data.body.customer.address.number ?? "", // ok
                        state: data.body.customer.address.state ?? "", // ok
                        zip_code: data.body.customer.address.zip_code ?? "", // ok
                        complement: data.body.customer.address.complement ?? "", // ok
                        street_name:
                            data.body.customer.address.street_name ?? "", // ok
                        neighborhood:
                            data.body.customer.address.neighborhood ?? "", //ok
                    },
                },
            });
        },
    };

    while (true) {
        try {
            const receiveParams = {
                QueueUrl: queueUrl,
                MaxNumberOfMessages: 1,
                WaitTimeSeconds: 10, // long polling
            };

            const data = await sqsClient.send(
                new ReceiveMessageCommand(receiveParams)
            );

            if (data.Messages && data.Messages.length > 0) {
                for (const message of data.Messages) {
                    console.log("Mensagem recebida:", message.Body);
                    // @ts-expect-error
                    const messageJSON = JSON.parse(message?.Body);
                    if (messageJSON?.id === "create-appointment") {
                        await useCases["create-appointment"](
                            messageJSON as unknown as IAppointmentCreatedEvent
                        );
                    }
                    // Processar a mensagem aqui...

                    // Deletar mensagem após processamento
                    const deleteParams = {
                        QueueUrl: queueUrl,
                        ReceiptHandle: message.ReceiptHandle,
                    };
                    await sqsClient.send(
                        new DeleteMessageCommand(deleteParams)
                    );
                    console.log("Mensagem deletada.");
                }
            }
        } catch (err) {
            console.error("Erro ao consumir fila:", err);
        }
    }
}

export { receiveQueueMessages };
