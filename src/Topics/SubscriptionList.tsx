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

    return (
        <div className="subscriptions">
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
                {data.isLoading ? "Loading Subscriptions..." :
                    data.didError ? <div>Error: {data.errorMessage}</div> :
                        (
                            <List>
                                {
                                    data.data!.map((item) => {
                                        return (
                                            <ListItemButton
                                                selected={item.name == selectedSName}
                                                key={item.name}
                                                onClick={() => { if (newSubscriptionSelected !== undefined) newSubscriptionSelected(item); }}
                                            >
                                                <ListItemText primary={item.name} />
                                                <ArrowForwardIosIcon color={item.name == selectedSName ? "primary" : "disabled"} />
                                            </ListItemButton>
                                        );
                                    })}
                            </List>
                        )}
            </Box>


        </div>);
}
