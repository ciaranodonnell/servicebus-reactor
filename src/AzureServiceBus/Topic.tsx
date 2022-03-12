import * as asb from "@azure/service-bus";
import { Endpoint } from "./Endpoint";
import { Subscription } from "./Subscription";


export class Topic implements Endpoint {

    name: string;
    properties: asb.TopicProperties;
    sbac: asb.ServiceBusAdministrationClient;
    sb: asb.ServiceBusClient;
    subscriptions: Subscription[] | undefined;

    constructor(properties: asb.TopicProperties,
        sbac: asb.ServiceBusAdministrationClient,
        sb: asb.ServiceBusClient
    ) {
        this.name = properties.name;
        this.properties = properties;

        this.sbac = sbac;
        this.sb = sb;
    }
    get key(): string { return this.name; }
    get isTopic(): boolean { return true; }

    get isPartitioned(): boolean { return this.properties.enablePartitioning; }


    async loadSubscriptions(forceRefresh?: boolean): Promise<Subscription[]> {
        if (this.subscriptions === undefined || forceRefresh) {
            let sbSubscriptions = await this.sbac.listSubscriptions(this.name);

            let itResult = await sbSubscriptions.next();
            this.subscriptions = [];
            while (itResult.done === false) {
                console.log(itResult.value);
                this.subscriptions.push(new Subscription(itResult.value, this.sbac, this.sb));
                itResult = await sbSubscriptions.next();
            }
        }
        return this.subscriptions;
    }

    async sendMessage(message: string, messageFormat: string, headers: { [key: string]: string | number | boolean | Date | null; }) {
        await this.sb.createSender(this.name).sendMessages({
            body: message,
            contentType: messageFormat,
            applicationProperties: headers
        });
    }

}
