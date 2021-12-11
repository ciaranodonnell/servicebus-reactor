import React from 'react';
import TopicList from './TopicList';
import QueueList from './QueueList';
import { AzureServiceBusManager, Queue, Topic } from './AzureServiceBus/AzureServiceBusManager';
import { SubscriptionList } from './SubscriptionList';
import { QueueExplorer } from './QueueExplorer';
import Grid from '@mui/material/Grid';
//import { Tab, Tabs, TabPanel } from './TabPanel';
import { TabControl, TabPanel } from './TabPanel';
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
        <Grid container columnGap={2} width={"100%"} >
            <Grid item xs={3} style={{ "overflow": 'auto' }}>
                <TabControl tabGroupName={"queuesOrTopics"}>
                    <TabPanel title={"Queues"} >
                        <QueueList serviceBus={props.serviceBus} newQueueSelected={newQueueSelected} />
                    </TabPanel>
                    <TabPanel title={"Topics"} >
                        <TopicList serviceBus={props.serviceBus} newTopicSelected={newTopicSelected} />
                    </TabPanel>
                </TabControl>
            </Grid>
            <Grid item lg={5}>
                <div>
                    {selectedItem === undefined ? (<></>) :
                        selectedItem instanceof Queue ? (

                            <QueueExplorer queue={selectedItem} key={selectedItem.name} />
                        ) : (
                            <SubscriptionList serviceBus={props.serviceBus} />
                        )}
                </div>
            </Grid>
        </Grid>
    );
}
