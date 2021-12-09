import * as asb from "@azure/service-bus";
import { Endpoint } from "./Endpoint";

export class Queue implements Endpoint {


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
    get deadLetterMessageCount(): number | undefined { return this.runtimeProps?.deadLetterMessageCount; }
    get scheduledMessageCount(): number | undefined { return this.runtimeProps?.scheduledMessageCount; }
    get sizeInBytes(): number | undefined { return this.runtimeProps?.sizeInBytes; }
    get totalMessageCount(): number | undefined { return this.runtimeProps?.totalMessageCount; }
    get transferDeadLetterMessageCount(): number | undefined { return this.runtimeProps?.transferDeadLetterMessageCount; }
    get transferMessageCount(): number | undefined { return this.runtimeProps?.transferMessageCount; }
}
