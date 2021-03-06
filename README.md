# ServiceBus-Reactor

This project is a UI for interacting with Azure Service Bus.
It is supposed to be an improvement on the Service Bus Explorer functionality included in the Azure Portal.

It's an Electron based application built with React. 
In fact the primary reason I got started with doing this was to learn React.

## Running the code

It's a standard Electron app, so you can get the code out  and call:

```
> npm install
> npm start
```

Which starts the React web server. Then in a new terminal window you run 

``` 
> npm run electron 
```
which starts the electron app, loading the website from the webserver. This means it will have hot-reload for the changes you make to the code.
## Using the App

When the app starts it will be empty except for the bar at the top. In this bar you need to paste in a Connection String for Service Bus and hit the  ✔️ button.

![Initial Screenshot](./docs/initial-launch-screen.png)

This will cause the app to connect to Service Bus and load the List of Queues and Topics that exist. 

Selecting a Queue or Topic will open a panel for viewing its properties. This is the section of the application currently being developed

Viewing a Queue looks like this:
![Viewing a queue](./docs/viewing-a-queue.png)

Switching to the messages tab allows you to Peek the messages:

![Peeking Messages](./docs/peeking-queue-messages.png)

## Immediate Plans

Features looking to implement in the near term:

- [ ] Moving all messages from Queue/Subscription to Dead Letter Queue
- [x] Moving all messages from Dead Letter Queue back to Queue/Subscription
- [ ] Purging all messages from a Queue/Subscription
- [ ] Purging all messages from a Dead Letter Queue
- [ ] Message Viewer to see details of a message
- [ ] Viewing Subscription filters
- [ ] Editing Subscription filters
- [ ] Creating a new Queue
- [ ] Creating a new Topic
- [ ] Creating a new Subscription
- [ ] Setting up forwarding
- [ ] Sending a message
- [ ] Message formatters to allow easy sending/receiving of MassTransit or nServiceBus messages
- [ ] Ability to save connections
- [ ] Ability to peek/receive Queue/Subscription/DLQ to a file
- [ ] Ability to send to Queue/Topic from a file

