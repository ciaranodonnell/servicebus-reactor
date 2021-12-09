import * as asb from "@azure/service-bus";
import { Endpoint } from "./Endpoint";


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
