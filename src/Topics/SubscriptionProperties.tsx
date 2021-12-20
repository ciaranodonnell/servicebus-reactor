import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { ApplicationHooks } from "../ApplicationHooks";
import { Subscription } from "../AzureServiceBus/AzureServiceBusManager";
import { RefreshButton } from "../RefreshButton";

import { formatBytesForPresentation, ifBooleanThenYesNoOtherwiseValue, convertTimespanToString } from "../AppUtils";
import { ActiveMessageDetails } from "./ActiveMessageDetails";
import { SubscriptionProps } from "./SubscriptionProps";


export function SubscriptionProperties(props: SubscriptionProps) {
    const subscription = props.subscription;
    const [runtimeStateLoaded, setRuntimeStateLoaded] = React.useState<any>(false);


    function doLoadRuntimeState() {
        setRuntimeStateLoaded(false);
        subscription.loadRuntimeValues().then(() => {
            console.log("Loaded subscription runtime state");
            setRuntimeStateLoaded(true);
        });
    }
    // Load the runtime state for the subscription and then update the UI
    useEffect(() => {
        doLoadRuntimeState();
    }, [subscription]);

    function GetValueSpan(name: string, value: string | number | boolean | undefined): JSX.Element {
        return (
            <>
                <Grid item xs={3}>
                    <span className="fieldPrompt">{name}:</span>
                </Grid>
                <Grid item xs={3}>
                    {value === undefined ?
                        (<span className="missingValue"> - </span>) :
                        (<span className="value">{value}</span>)
                    }
                </Grid>
            </>
        );
    }

    return (<div className="subscriptionPropertiesTabPanelDiv">
        <Box>
            <h2>Subscription Properties <RefreshButton clicked={() => { }} /> </h2>
            <Grid container spacing={2}>
                {GetValueSpan("Maximum Delivery Count", subscription.maxDeliveryCount)}
                {GetValueSpan("Forward To", subscription.properties.forwardTo)}
                {GetValueSpan("Forward DL To", subscription.properties.forwardDeadLetteredMessagesTo)}
                {GetValueSpan("Auto Delete on Idle", convertTimespanToString(subscription.properties.autoDeleteOnIdle))}
                {GetValueSpan("Requires Sessions", ifBooleanThenYesNoOtherwiseValue(subscription.requiresSession))}
            </Grid>
        </Box>
        <Box>
            <h2>Runtime Properties <RefreshButton clicked={() => { doLoadRuntimeState(); }} /></h2>
            <ActiveMessageDetails subscription={subscription} />
        </Box>

    </div>);
}