//import * as asbm from "@azure/arm-servicebus"
interface Endpoint {
    isTopic: boolean;
    name: string;
    isPartitioned: boolean;
}

export type { Endpoint };