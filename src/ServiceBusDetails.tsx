import React from 'react';

import { AzureServiceBusManager, Queue, Topic } from './AzureServiceBus/AzureServiceBusManager';

import { QueueExplorer } from './Queues/QueueExplorer';
import TopicList from './TopicList';
import QueueList from './Queues/QueueList';

import Grid from '@mui/material/Grid';
import { TabControl, TabPanel } from './TabPanel';
import { SubscriptionList } from './SubscriptionList';

import './ServiceBusDetails.css';

export interface ServiceBusProps {
    serviceBus: AzureServiceBusManager;
}

export function ServiceBusDetails(props: ServiceBusProps) {

    const [selectedItem, setSelectedItem] = React.useState<Queue | Topic | undefined>();

    function newQueueSelected(queue: Queue) {
        setSelectedItem(queue);
    }

    function newTopicSelected(topic: Topic) {
        setSelectedItem(topic);
    }

    return (
        <Grid container columnGap={2} style={{
            'width': '100%', minWidth: '1300px', overflow: 'auto', height: '100%'
        }} >
            <Grid item xs={3} className={"queueOrTopicLists"} >
                <TabControl tabGroupName={"queuesOrTopics"}>
                    <TabPanel title={"Queues"} >
                        <QueueList serviceBus={props.serviceBus} newQueueSelected={newQueueSelected} />
                    </TabPanel>
                    <TabPanel title={"Topics"} >
                        <TopicList serviceBus={props.serviceBus} newTopicSelected={newTopicSelected} />
                    </TabPanel>
                </TabControl>
            </Grid>
            <Grid item xs={8} lg={8} className="queueOrSubscriptionExplorer">
                {selectedItem === undefined ? (<></>) :
                    selectedItem instanceof Queue ? (
                        <QueueExplorer queue={selectedItem} key={selectedItem.name} />
                    ) : (
                        <SubscriptionList serviceBus={props.serviceBus} />
                    )}
            </Grid>
        </Grid>
    );
}
