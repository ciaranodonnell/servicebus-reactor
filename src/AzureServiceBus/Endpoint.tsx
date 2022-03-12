//import * as asbm from "@azure/arm-servicebus"
interface Endpoint {
    isTopic: boolean;
    name: string;
    isPartitioned: boolean;

    sendMessage: (message: string,
        messageFormat: string,
        headers: { [key: string]: string | number | boolean | Date | null }) => Promise<void>;
}

export type { Endpoint };