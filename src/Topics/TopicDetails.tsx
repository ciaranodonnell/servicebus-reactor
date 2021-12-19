
import React, { useEffect } from 'react';

import { Topic, Subscription } from "../AzureServiceBus/AzureServiceBusManager";
import { SubscriptionList } from "./SubscriptionList";
import { SubscriptionExplorer } from "./SubscriptionExplorer";
import { InProgressActivityReport } from '../InProgressTaskReport';
import { ApplicationProps } from '../ApplicationHooks';

interface TopicExplorerProps extends ApplicationProps {
    topic: Topic;
}

export function TopicDetails(props: TopicExplorerProps) {
    const { topic } = props;

    return (
        <div>
            <h1>Topic: <span className="queueName">{topic.name}</span></h1>
        </div>
    );



}