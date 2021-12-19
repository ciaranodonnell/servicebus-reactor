import React from 'react';

import { AzureServiceBusManager, Queue, Topic } from './AzureServiceBus/AzureServiceBusManager';

import { QueueExplorer } from './Queues/QueueExplorer';
import TopicList from './Topics/TopicList';
import QueueList from './Queues/QueueList';

import Grid from '@mui/material/Grid';
import { TabControl, TabPanel } from './TabPanel';
import { TopicExplorer } from './Topics/TopicExplorer';

import './ServiceBusDetails.css';
import { Box } from '@mui/system';
import { InProgressActivityReport } from './InProgressTaskReport';

export interface ServiceBusProps {
    serviceBus: AzureServiceBusManager;
    reportActivity: (report: InProgressActivityReport) => void;
}

export function ServiceBusDetails(props: ServiceBusProps) {
    const { reportActivity } = props;
    const [selectedItem, setSelectedItem] = React.useState<Queue | Topic | undefined>();

    function newQueueSelected(queue: Queue) {
        setSelectedItem(queue);
    }

    function newTopicSelected(topic: Topic) {
        setSelectedItem(topic);
    }
    console.log("selectedItem instanceof Topic", selectedItem instanceof Topic);
    return (
        <Box className={"serviceBusDetailsBox"}>
            <Box className={"queueOrTopicLists"} >
                <TabControl tabGroupName={"queuesOrTopics"}>
                    <TabPanel title={"Queues"} >
                        <QueueList serviceBus={props.serviceBus} newQueueSelected={newQueueSelected} />
                    </TabPanel>
                    <TabPanel title={"Topics"} >
                        <TopicList serviceBus={props.serviceBus} newTopicSelected={newTopicSelected} />
                    </TabPanel>
                </TabControl>
            </Box>
            <Box className="queueOrSubscriptionExplorer">
                {selectedItem === undefined ? (<></>) :
                    selectedItem instanceof Queue ? (
                        <QueueExplorer queue={selectedItem} key={"q-" + selectedItem.name} />
                    ) : (
                        <TopicExplorer topic={selectedItem as Topic} key={"t-" + selectedItem.name} reportActivity={reportActivity} />
                    )}
            </Box>
        </Box>
    );
}
