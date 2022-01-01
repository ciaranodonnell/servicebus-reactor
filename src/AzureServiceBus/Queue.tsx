import * as asb from "@azure/service-bus";
import { Endpoint } from "./Endpoint";
import { ReceivedMessage } from "./ReceivedMessage";

export class Queue implements Endpoint {


    name: string;
    properties: asb.QueueProperties;
    sbac: asb.ServiceBusAdministrationClient;
    sb: asb.ServiceBusClient;
    runtimeProps: asb.WithResponse<asb.QueueRuntimeProperties> | undefined;
    lastReceivedMessages: ReceivedMessage[] = [];
    hasReceviedMessages = false;

    constructor(properties: asb.QueueProperties, sbac: asb.ServiceBusAdministrationClient, sb: asb.ServiceBusClient) {
        this.name = properties.name;
        this.properties = properties;
        this.sbac = sbac;
        this.sb = sb;
    }
    async loadRuntimeValues(): Promise<void> {
        this.runtimeProps = await this.sbac.getQueueRuntimeProperties(this.name);
        console.log("loadRuntimeValues", this.runtimeProps, this.activeMessageCount);
    }
    get isTopic(): boolean { return true; }

    get isPartitioned(): boolean { return this.properties.enablePartitioning; }

    get maxDeliveryCount(): number { return this.properties.maxDeliveryCount; }

    get requiresSession(): boolean { return this.properties.requiresSession; }

    get activeMessageCount(): number | undefined { return this.runtimeProps?.activeMessageCount; }
    get deadLetterMessageCount(): number | undefined { return this.runtimeProps?.deadLetterMessageCount; }
    get scheduledMessageCount(): number | undefined { return this.runtimeProps?.scheduledMessageCount; }
    get sizeInBytes(): number | undefined { return this.runtimeProps?.sizeInBytes; }
    get totalMessageCount(): number | undefined { return this.runtimeProps?.totalMessageCount; }
    get transferDeadLetterMessageCount(): number | undefined { return this.runtimeProps?.transferDeadLetterMessageCount; }
    get transferMessageCount(): number | undefined { return this.runtimeProps?.transferMessageCount; }



    async peekMessages(numMessages: number): Promise<ReceivedMessage[]> {
        const receiver = this.sb.createReceiver(this.name);
        const messages = await receiver.peekMessages(numMessages);
        this.lastReceivedMessages = messages.map(m => new ReceivedMessage("peek", this.name, m));
        this.hasReceviedMessages = true;
        return this.lastReceivedMessages;
    }

}
