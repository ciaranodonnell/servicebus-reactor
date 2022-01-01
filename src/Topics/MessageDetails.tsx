import { ApplicationProps } from "../ApplicationHooks";
import { ReceivedMessage } from "../AzureServiceBus/AzureServiceBusManager";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode as light } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import "./TopicList.css";

export interface MessageProps extends ApplicationProps {
    message: ReceivedMessage;
}

export function MessageDetails(props: MessageProps) {
    const { message, hooks } = props;

    return (
        <div className="messageBox">
            <div className="messageDetailsBox">

                <h1>Message Details</h1>
                <table className="messageDetailsTable">
                    <tr><th>Message Id: </th><td style={{ whiteSpace: "nowrap" }}> {message.messageId} </td></tr>
                    <tr><th>Correlation Id: </th><td> {message.correlationId} </td></tr>
                    <tr><th>Sequence Number: </th><td> {message.sequenceNumber?.toString()} </td></tr>

                    <tr><th>Content Type: </th><td> {message.contentType} </td></tr>
                    <tr><th>Delivery Count: </th><td> {message.deliveryCount} </td></tr>

                    <tr><th>Enqueued Time UTC: </th><td> {message.enqueuedTimeUtc?.toISOString()} </td></tr>
                    <tr><th>Message Expiry: </th><td> {message.expiresAt} </td></tr>

                    <tr><th>Received From: </th><td> {message.receivedFrom} </td></tr>

                    <tr><th>Receive Mode: </th><td> {message.receiveMode} </td></tr>

                    <tr><th>TTL: </th><td> {message.timeToLive} </td></tr>

                    {Object.entries(message).map(([key, value]) => {
                        if (key === "id" || key === "messageId" || key === "correlationId" || key === "contentType" || key === "deliveryCount" || key === "enqueuedTimeUtc"
                            || key === "body" || key === "receivedFrom" || key === "receiveMode" || key === "sequenceNumber" || key === "expiresAt" || key === "customHeaders"
                            || key === "timeToLive" || value === undefined) return (<></>);
                        return (<tr>
                            <th>{key}:</th>
                            <td>{JSON.stringify(value)}</td>
                        </tr>
                        );
                    })}
                </table>
            </div>
            <div className="customAttributesBox">
                {message.customHeaders !== undefined ? (
                    <>
                        <h1>Custom Headers</h1>
                        <table className={"customAttributesTable"}><thead><th>Key</th><th>Value</th></thead><tbody>
                            {Object.keys(message.customHeaders).map((key) => {
                                return (<tr><th>{key}</th><td>{message.customHeaders![key] ?? ""}</td></tr>);
                            })}
                        </tbody></table></>
                ) : <>   </>}
            </div>
            <div className="bodyBox">
                <h1>Body:</h1>
                <div className="bodyScrollBox">
                    <SyntaxHighlighter language="json" showLineNumbers={true} style={light} >
                        {JSON.stringify(message.body, null, " ")}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>


    );
}