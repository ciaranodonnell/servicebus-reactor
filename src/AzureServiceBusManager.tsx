import * as asb from "@azure/service-bus"
//import * as asbm from "@azure/arm-servicebus"



export interface Endpoint {
    isTopic: boolean;
    name: string;
    isPartitioned: boolean;
}

export class Topic implements Endpoint {

    name: string;
    properties: asb.TopicProperties;

    constructor(properties: asb.TopicProperties) {
        this.name = properties.name;
        this.properties = properties;

    }
    get key(): string { return this.name; }
    get isTopic(): boolean { return true; }

    get isPartitioned(): boolean { return this.properties.enablePartitioning; }
}
export class Queue {


    name: string;
    properties: asb.QueueProperties;
    sb: asb.ServiceBusAdministrationClient;
    runtimeProps: asb.WithResponse<asb.QueueRuntimeProperties> | undefined;

    constructor(properties: asb.QueueProperties, sb: asb.ServiceBusAdministrationClient) {
        this.name = properties.name;
        this.properties = properties;
        this.sb = sb;
    }
    async loadRuntimeValues(): Promise<void> {
        this.runtimeProps = await this.sb.getQueueRuntimeProperties(this.name);
        console.log("loadRuntimeValues", this.runtimeProps, this.activeMessageCount);
    }
    get isTopic(): boolean { return true; }

    get isPartitioned(): boolean { return this.properties.enablePartitioning; }

    get maxDeliveryCount(): number { return this.properties.maxDeliveryCount; }

    get requiresSession(): boolean { return this.properties.requiresSession; }

    get activeMessageCount(): number | undefined { return this.runtimeProps?.activeMessageCount; }
}

export class AzureServiceBusManager {
    private _connectionString: string;

    private mgt: asb.ServiceBusAdministrationClient;
    private sb: asb.ServiceBusClient;
    private queues: Queue[] | undefined;
    private topics: Topic[] | undefined;

    constructor(connectionString: string) {
        this._connectionString = connectionString;

        this.mgt = new asb.ServiceBusAdministrationClient(connectionString);
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
            const queues = await this.mgt.listQueues();
            let itResult = await queues.next();

            while (itResult.done === false) {
                console.log(itResult.value);
                this.queues.push(new Queue(itResult.value, this.mgt));
                itResult = await queues.next();
            }
        }
        return this.queues;
    }
    public async getTopics(): Promise<Topic[]> {
        if (this.topics === undefined) {
            this.topics = [];
            const queues = await this.mgt.listTopics();
            let itResult = await queues.next();

            while (itResult.done === false) {
                console.log(itResult.value);
                this.topics.push(new Topic(itResult.value));
                itResult = await queues.next();
            }
        }
        return this.topics;
    }

}