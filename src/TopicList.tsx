import React, { useEffect } from 'react';
import './QueueTopicList.css';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItemText from '@mui/material/ListItemText';

import { AzureServiceBusManager } from './AzureServiceBus/AzureServiceBusManager';
import { Topic } from "./AzureServiceBus/Topic";

interface TopicListProps {
    serviceBus: AzureServiceBusManager | undefined;
    newTopicSelected: (queueName: Topic) => void;
}


interface LoadData<T> {
    data: T;
    isLoading: boolean;
}

function TopicList(props: TopicListProps) {

    console.log("TopicList", "Render Started");
    const [selectedTName, setSelectedTName] = React.useState<string>("");
    const [data, setData] = React.useState<LoadData<Topic[]>>({ isLoading: true, data: [] });
    const [sb, setSb] = React.useState(props.serviceBus);

    useEffect(() => {
        const topicsPromise = props.serviceBus?.getTopics().then((t) => {
            console.log("Topics loaded");
            setData({ isLoading: false, data: t });
        });
    }, [props.serviceBus]);

    const topicSelected = (item: Topic) => {
        setSelectedTName(item.name);
        props.newTopicSelected(item);
    }

    if (props.serviceBus === undefined) {
        console.log("QueueList: props.serviceBus is undefined");
        return (
            <></>
        );
    } else {
        console.log("TopicList", "data.isLoading", data.isLoading);
        return (
            <div className="topicListContainer">
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
                    {data.isLoading ? "Loading Topics..." : (
                        <List>
                            {data.data.map((item) => {
                                return (
                                    <ListItemButton
                                        selected={item.name == selectedTName}
                                        key={item.name}
                                        onClick={() => { topicSelected(item); }}
                                    >
                                        <ListItemText primary={item.name} />
                                        <ArrowForwardIosIcon color={item.name == selectedTName ? "primary" : "disabled"} />
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

export default TopicList;