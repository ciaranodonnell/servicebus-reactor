import * as asb from "@azure/service-bus";
import { Queue } from "./Queue";
import { Topic } from "./Topic";
import { Subscription } from "./Subscription";

export class ReceivedMessage {
    private receiveMode: string;
    private receviedFrom: Queue | Subscription;
    body: string | undefined;
    deliveryCount: number | undefined;
    enqueuedTimeUtc: Date | undefined;
    scheduledEnqueueTimeUtc: Date | undefined;
    messageId: string | number | Buffer | undefined;
    sequenceNumber: Long | undefined;
    size: number | undefined;
    subject: string | undefined;
    timeToLive: number | undefined;
    to: string | undefined;

    constructor(recieveMode: string, receivedFrom: Queue | Subscription, message: asb.ServiceBusReceivedMessage | undefined) {
        this.receiveMode = recieveMode;
        this.receviedFrom = receivedFrom;
        this.body = message?.body;
        this.deliveryCount = message?.deliveryCount;
        this.enqueuedTimeUtc = message?.enqueuedTimeUtc;
        this.scheduledEnqueueTimeUtc = message?.scheduledEnqueueTimeUtc;
        this.messageId = message?.messageId;
        this.sequenceNumber = message?.sequenceNumber;
        this.size = message?.body.length;
        this.subject = message?.subject;
        this.timeToLive = message?.timeToLive;
        this.to = message?.to;
    }
}