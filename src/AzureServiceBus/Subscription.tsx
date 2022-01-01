import * as asb from "@azure/service-bus";
import { ReceivedMessage } from "./ReceivedMessage";

export class Subscription {
    topicName: string;
    name: string;
    properties: asb.SubscriptionProperties;
    private sbac: asb.ServiceBusAdministrationClient;
    private sb: asb.ServiceBusClient;
    lastReceivedMessages: ReceivedMessage[] = [];
    hasReceviedMessages = false;
    runtimeProps: asb.WithResponse<asb.SubscriptionRuntimeProperties> | undefined;

    constructor(properties: asb.SubscriptionProperties, sbac: asb.ServiceBusAdministrationClient,
        sb: asb.ServiceBusClient
    ) {
        this.topicName = properties.topicName;
        this.name = properties.subscriptionName;
        this.properties = properties;
        this.sbac = sbac;
        this.sb = sb;

    }
    get key(): string { return this.name; }

    get maxDeliveryCount(): number { return this.properties.maxDeliveryCount; }

    get requiresSession(): boolean { return this.properties.requiresSession; }

    get activeMessageCount(): number | undefined { return this.runtimeProps?.activeMessageCount; }
    get deadLetterMessageCount(): number | undefined { return this.runtimeProps?.deadLetterMessageCount; }

    get totalMessageCount(): number | undefined { return this.runtimeProps?.totalMessageCount; }
    get transferDeadLetterMessageCount(): number | undefined { return this.runtimeProps?.transferDeadLetterMessageCount; }
    get transferMessageCount(): number | undefined { return this.runtimeProps?.transferMessageCount; }



    async loadRuntimeValues(): Promise<void> {
        this.runtimeProps = await this.sbac.getSubscriptionRuntimeProperties(this.topicName, this.name);
        console.log("loadRuntimeValues", this.runtimeProps, this.activeMessageCount);
    }
    async peekMessages(numMessages: number): Promise<ReceivedMessage[]> {
        const receiver = this.sb.createReceiver(this.topicName, this.name);
        return await this.peekMessagesFromReceiver(numMessages, receiver);
    }

    async peekDLQ(numMessages: number): Promise<ReceivedMessage[]> {
        const receiver = this.sb.createReceiver(this.topicName, this.name, { subQueueType: "deadLetter" });
        return await this.peekMessagesFromReceiver(numMessages, receiver);
    }

    private async peekMessagesFromReceiver(numMessages: number, receiver: asb.ServiceBusReceiver) {
        const messages = await receiver.peekMessages(numMessages);
        this.lastReceivedMessages = messages.map(m => new ReceivedMessage("peek", receiver.entityPath, m));
        this.hasReceviedMessages = true;
        return this.lastReceivedMessages;
    }

    private createNewMessageFromReceived(msg: asb.ServiceBusReceivedMessage): asb.ServiceBusMessage {
        let newAppProps: { [key: string]: string | number | boolean | Date | null } = {
            ...(msg.applicationProperties)
        };
        delete newAppProps["DeadLetterErrorDescription"];
        delete newAppProps["DeadLetterReason"];
        delete newAppProps["MT-Reason"];

        //console.log("newAppProps", newAppProps);
        let outMsg: asb.ServiceBusMessage = {
            body: msg.body,
            applicationProperties: newAppProps,
            correlationId: msg.correlationId,
            contentType: msg.contentType,
            partitionKey: msg.partitionKey,
            replyTo: msg.replyTo,
            sessionId: msg.sessionId,
            to: msg.to,
            replyToSessionId: msg.replyToSessionId,
            subject: msg.subject,
            timeToLive: msg.timeToLive,
        };

        // console.log("outMsg", outMsg);

        return outMsg;
    }
    async sendDLQBackToTopic(updateProgress: (done: number, of: number) => void): Promise<void> {
        const sender = this.sb.createSender(this.topicName);
        const receiver = this.sb.createReceiver(this.topicName, this.name,
            { subQueueType: "deadLetter", receiveMode: "peekLock" });

        let messages: asb.ServiceBusReceivedMessage[] = [];

        let done = 0;
        let of = this.deadLetterMessageCount ?? 0;
        const reportEvery = Math.min(Math.max(Math.floor(of / 10), 1), 10);

        while ((messages = await receiver.receiveMessages(1)).length > 0 && done < of) {

            let msg = this.createNewMessageFromReceived(messages[0]);
            console.log("sending dlq to topic", msg);
            await sender.sendMessages(msg);
            await receiver.completeMessage(messages[0]);

            done += 1;
            //console.log("done % reportEvery === 0 ===>", `${done} % ${reportEvery} === 0`, done % reportEvery === 0)
            if (done % reportEvery === 0) {
                updateProgress(done, of);
            }
        }

        this.runtimeProps = await this.sbac.getSubscriptionRuntimeProperties(this.topicName, this.name);
    }




}
