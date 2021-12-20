import { Grid } from "@mui/material";
import { Subscription } from "../AzureServiceBus/AzureServiceBusManager";



export function ActiveMessageDetails(props: { subscription: Subscription }) {
    const subscription = props.subscription;

    function getValueSpan(name: string, value: string | number | boolean | undefined): JSX.Element {
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

    function getValueOrLoading(value: string | number | undefined): string | number {
        return value === undefined ? "Loading..." : value;
    }


    return (<
        Grid container spacing={2}>
        {getValueSpan("Total Messages", getValueOrLoading(subscription.totalMessageCount))}

        {getValueSpan("Active Messages", getValueOrLoading(subscription.activeMessageCount))}
        {getValueSpan("Dead Lettered Messages", getValueOrLoading(subscription.deadLetterMessageCount))}

        {getValueSpan("Transfer Messages", getValueOrLoading(subscription.transferMessageCount))}
        {getValueSpan("Dead Transfer Messages", getValueOrLoading(subscription.transferDeadLetterMessageCount))}

    </Grid>);
}

