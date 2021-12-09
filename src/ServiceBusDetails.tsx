import React from 'react';
import TopicList from './TopicList';
import QueueList from './QueueList';
import { AzureServiceBusManager, Queue, Topic } from './AzureServiceBus/AzureServiceBusManager';
import { SubscriptionList } from './SubscriptionList';
import { QueueExplorer } from './QueueExplorer';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface ServiceBusProps {
    serviceBus: AzureServiceBusManager;
}

export function ServiceBusDetails(props: ServiceBusProps) {

    const [selectedItem, setSelectedItem] = React.useState<Queue | Topic | undefined>();
    const [selectedTab, setSelectedTab] = React.useState(0);

    function newQueueSelected(queue: Queue) {
        setSelectedItem(queue);
    }

    function newTopicSelected(topic: Topic) {
        setSelectedItem(topic);
    }

    function TabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Grid container columnGap={2} width={"100%"} >
            <Grid item xs={3} style={{ "overflow": 'auto' }}>
                <Tabs value={selectedTab} onChange={handleChange} variant="fullWidth" >
                    <Tab label="Queues" {...a11yProps(0)} />
                    <Tab label="Topics"  {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={selectedTab} index={0}>
                    <QueueList serviceBus={props.serviceBus} newQueueSelected={newQueueSelected} />
                </TabPanel>
                <TabPanel value={selectedTab} index={1} >
                    <div style={{ "backgroundColor": "red" }}>
                        <TopicList serviceBus={props.serviceBus} newTopicSelected={newTopicSelected} />
                    </div>
                </TabPanel>
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
