import { Subscription } from "../AzureServiceBus/AzureServiceBusManager";
import { ApplicationProps } from "../ApplicationHooks";


export interface SubscriptionProps extends ApplicationProps {
    subscription: Subscription;
}
