import * as asb from "@azure/service-bus"
import { Queue } from "./Queue";
import { Topic } from "./Topic";
import { ReceivedMessage } from "./ReceivedMessage";
import { Subscription } from "./Subscription";
export { Queue, Topic, ReceivedMessage, Subscription }

export class AzureServiceBusManager {
    private _connectionString: string;

    private sbac: asb.ServiceBusAdministrationClient;
    private sb: asb.ServiceBusClient;
    private queues: Queue[] | undefined;
    private topics: Topic[] | undefined;

    constructor(connectionString: string) {
        this._connectionString = connectionString;

        this.sbac = new asb.ServiceBusAdministrationClient(connectionString);
        this.sb = new asb.ServiceBusClient(connectionString);

    }

    get namespace(): string {
        let ns: string = "";
        this._connectionString.split(";").forEach(element => {
            if (element.startsWith("Endpoint")) {
                ns = element.split("//")[1].split(".")[0];
            }
        });
        return ns;
    }

    get connectionString(): string {
        return this._connectionString;
    }

    get isLoading(): boolean {
        return false;
    }

    public async getQueues(): Promise<Queue[]> {
        if (this.queues === undefined) {
            this.queues = [];
            const queues = await this.sbac.listQueues();
            let itResult = await queues.next();

            while (itResult.done === false) {
                console.log(itResult.value);
                this.queues.push(new Queue(itResult.value, this.sbac, this.sb));
                itResult = await queues.next();
            }
        }
        return this.queues;
    }
    public async getTopics(): Promise<Topic[]> {
        if (this.topics === undefined) {
            this.topics = [];
            const queues = await this.sbac.listTopics();
            let itResult = await queues.next();

            while (itResult.done === false) {
                console.log(itResult.value);
                this.topics.push(new Topic(itResult.value, this.sbac, this.sb));
                itResult = await queues.next();
            }
        }
        return this.topics;
    }

}