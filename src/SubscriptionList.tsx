import React from 'react';
import './QueueTopicList.css';



import * as sbm from './AzureServiceBus/AzureServiceBusManager';

interface SubscriptionListProps {
    serviceBus: sbm.AzureServiceBusManager;
}


export function SubscriptionList(props: SubscriptionListProps) {

    return (
        <div className="subscriptions">
        </div>);
}
