import { startHttpApplication } from "./infra/http/start";
import { receiveQueueMessages } from "./infra/queue/sqs.queue";

async function bootstrap() {
	startHttpApplication();
	receiveQueueMessages();
}

bootstrap();
