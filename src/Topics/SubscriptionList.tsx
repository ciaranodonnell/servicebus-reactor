import React, { useEffect } from 'react';

import { LoadingData } from '../AppUtils';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItemText from '@mui/material/ListItemText';

import { Topic, Subscription } from "../AzureServiceBus/AzureServiceBusManager";

interface SubscriptionListProps {
    // serviceBus: sbm.AzureServiceBusManager;
    newSubscriptionSelected?: (subscription: Subscription) => void;
    topic: Topic;
}




export function SubscriptionList(props: SubscriptionListProps) {

    console.log("SubscriptionList", "Render Started");
    const [selectedSName, setSelectedSName] = React.useState<string>("");
    const [data, setData] = React.useState<LoadingData<Subscription[]>>({ isLoading: true, hasLoaded: false, didError: false });
    // const [sb, setSb] = React.useState(props.serviceBus);

    const { newSubscriptionSelected, topic } = props;

    useEffect(() => {
        const subscriptionsPromise = topic.loadSubscriptions(false).then((subs) => {
            console.log("Subscriptions loaded");
            setData({ isLoading: false, hasLoaded: true, didError: false, data: subs });
        }).catch(err => {
            setData({ isLoading: false, hasLoaded: true, didError: true, errorMessage: err.toString() });
        })
    }, [topic]);

    const subscriptionSelected = (item: Subscription) => {
        setSelectedSName(item.name);
        if (newSubscriptionSelected != undefined) {
            newSubscriptionSelected(item);
        }
    }



    return (
        <div className="subscriptions">
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
                <h2>Subscriptions 👇</h2>
                {data.isLoading ? "Loading Subscriptions..." :
                    data.didError ? <div>Error: {data.errorMessage}</div> :
                        (
                            <List>
                                {
                                    data.data!.map((item) => {
                                        const isSelected = item.name === selectedSName;
                                        console.log("SubscriptionList: item.name, selectedSName, isselected>", item.name, selectedSName, isSelected);
                                        return (
                                            <ListItemButton
                                                selected={isSelected}
                                                key={item.name}
                                                onClick={() => subscriptionSelected(item)}
                                            >
                                                <ListItemText primary={item.name} />
                                                <ArrowForwardIosIcon color={isSelected ? "primary" : "disabled"} />
                                            </ListItemButton>
                                        );
                                    })}
                            </List>
                        )}
            </Box>


        </div>);
}
