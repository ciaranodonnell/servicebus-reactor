import React, { useEffect } from 'react';

import { Topic, Subscription } from "../AzureServiceBus/AzureServiceBusManager";
import { SubscriptionList } from "./SubscriptionList";
import { SubscriptionExplorer } from "./SubscriptionExplorer";
import { TopicDetails } from './TopicDetails';

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
            <div>
                <TopicDetails topic={topic} />
            </div>
            <div className="leftRightContainer">
                <div className="left" style={{ minWidth: '300px' }}>
                    <SubscriptionList topic={topic} newSubscriptionSelected={newSubscriptionSelected} />
                </div>
                <div className="right">
                    {(subscription instanceof Subscription) ?
                        (<SubscriptionExplorer subscription={subscription} />)
                        : <></>

                    }
                </div>
            </div>
        </>
    );



}