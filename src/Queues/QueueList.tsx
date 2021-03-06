import React, { useEffect } from 'react';
import './QueueList.css';
//import { Stack, Label, DetailsList } from '@fluentui/react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItemText from '@mui/material/ListItemText';

import { AzureServiceBusManager, Queue } from '../AzureServiceBus/AzureServiceBusManager';
interface QueueListProps {
    serviceBus: AzureServiceBusManager | undefined;
    newQueueSelected: (queueName: Queue) => void;
}


interface LoadData<T> {
    data: T;
    isLoading: boolean;
}

function QueueList(props: QueueListProps) {
    console.log("QueueList", "Render Started");
    const [selectedQName, setSelectedQName] = React.useState<string>("");
    const [data, setData] = React.useState<LoadData<Queue[]>>({ isLoading: true, data: [] });
    const [sb, setSb] = React.useState(props.serviceBus);

    useEffect(() => {
        const topicsPromise = props.serviceBus?.getQueues().then((q) => {
            console.log("Queues loaded");
            setData({ isLoading: false, data: q });
        });
    }, [props.serviceBus]);

    const queueSelected = (item: Queue) => {
        setSelectedQName(item.name);
        props.newQueueSelected(item);
    }

    if (props.serviceBus === undefined) {
        console.log("QueueList: props.serviceBus is undefined");
        return (
            <></>
        );
    } else {
        console.log("QueueList", "data.isLoading", data.isLoading);
        return (
            <div className="queueListContainer">
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
                    {data.isLoading ? "Loading Queues..." : (
                        <List>
                            {data.data.map((item) => {
                                return (
                                    <ListItemButton
                                        selected={item.name == selectedQName}
                                        key={item.name}
                                        onClick={() => { queueSelected(item); }}
                                    >
                                        <ListItemText primary={item.name} />
                                        <ArrowForwardIosIcon color={item.name == selectedQName ? "primary" : "disabled"} />
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    )}
                </Box>
            </div>
        );

    }
}

export default QueueList;