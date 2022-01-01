import * as asb from "@azure/service-bus";
import { Queue } from "./Queue";
import { Topic } from "./Topic";
import { Subscription } from "./Subscription";

export class ReceivedMessage {
    receiveMode: string;
    receivedFrom: string;
    body: any | undefined;
    deliveryCount: number | undefined;
    enqueuedTimeUtc: Date | undefined;
    scheduledEnqueueTimeUtc: Date | undefined;
    messageId: string | number | Buffer | undefined;
    sequenceNumber: Long | undefined;
    size: number | undefined;
    subject: string | undefined;
    timeToLive: number | undefined;
    to: string | undefined;
    contentType: string | undefined;
    lockToken: string | undefined;
    expiresAt: any;
    customHeaders: { [key: string]: string | number | boolean | Date | null; } | undefined;
    correlationId: string | number | Buffer | undefined;

    constructor(recieveMode: string, receivedFrom: string, message: asb.ServiceBusReceivedMessage | undefined) {
        this.receivedFrom = receivedFrom;
        this.correlationId = message?.correlationId;
        this.receiveMode = recieveMode;
        this.receivedFrom = receivedFrom;
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
        this.contentType = message?.contentType;
        this.lockToken = message?.lockToken;
        this.expiresAt = message?.expiresAtUtc?.toLocaleString();
        this.customHeaders = message?.applicationProperties;
    }

}