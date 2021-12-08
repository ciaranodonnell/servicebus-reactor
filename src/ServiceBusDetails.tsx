import React from 'react';
import TopicList from './TopicList';
import QueueList from './QueueList';
import * as sbm from './AzureServiceBusManager';
import { SubscriptionList } from './SubscriptionList';
import { QueueExplorer } from './QueueExplorer';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface ServiceBusProps {
    serviceBus: sbm.AzureServiceBusManager;
}

export function ServiceBusDetails(props: ServiceBusProps) {

    const [selectedItem, setSelectedItem] = React.useState<sbm.Queue | sbm.Topic | undefined>();
    const [selectedTab, setSelectedTab] = React.useState(0);

    function newQueueSelected(queue: sbm.Queue) {
        setSelectedItem(queue);
    }

    function newTopicSelected(topic: sbm.Topic) {
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
        <Grid container>
            <Grid item xs={3}>
                <Tabs value={selectedTab} onChange={handleChange} variant="fullWidth" >
                    <Tab label="Queues" {...a11yProps(0)} />
                    <Tab label="Topics"  {...a11yProps(1)} />
                </Tabs>
                <TabPanel value={selectedTab} index={0}>
                    <QueueList serviceBus={props.serviceBus} newQueueSelected={newQueueSelected} />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                    <TopicList serviceBus={props.serviceBus} />
                </TabPanel>
            </Grid>
            <Grid item xs={9}>
                <div>
                    {selectedItem === undefined ? (<></>) :
                        selectedItem instanceof sbm.Queue ? (

                            <QueueExplorer queue={selectedItem} key={selectedItem.name} />
                        ) : (
                            <SubscriptionList serviceBus={props.serviceBus} />
                        )}
                </div>
            </Grid>
        </Grid>
    );
}
