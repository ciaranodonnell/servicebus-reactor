import React, { useEffect } from 'react';

import { Topic, Subscription } from "../AzureServiceBus/AzureServiceBusManager";
import { SubscriptionList } from "./SubscriptionList";
import { SubscriptionExplorer } from "./SubscriptionExplorer";

interface TopicExplorerProps {
    topic: Topic;
}

export function TopicExplorer(props: TopicExplorerProps) {
    const { topic } = props;

    const [subscription, setSubscription] = React.useState<Subscription | undefined>();

    function newSubscriptionSelected(subscription: Subscription) {
        setSubscription(subscription);
    }

    return (
        <>
            <SubscriptionList topic={topic} newSubscriptionSelected={newSubscriptionSelected} />
            {(subscription instanceof Subscription) ?
                (<SubscriptionExplorer subscription={subscription} />)
                : <></>
            }
        </>
    );



}