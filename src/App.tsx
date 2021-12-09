import React from 'react';
import ConnectionBox from './ConnectionBox';
//import logo from './logo.svg';
import './App.css';
import * as sbm from './AzureServiceBus/AzureServiceBusManager';
//import { Stack } from '@fluentui/react';
import { useEffect } from 'react';
import { ServiceBusDetails } from './ServiceBusDetails';

function App() {

  const [serviceBus, setServiceBus] = React.useState<sbm.AzureServiceBusManager | undefined>(undefined);
  const [namespace, setNamespace] = React.useState<string>("");

  useEffect(() => {
    document.title = `ServiceBus-Reactor ${namespace === undefined || namespace.length == 0 ? "" : " - " + namespace}`
  }, [serviceBus]);


  const handleConnect = (conString: string) => {
    console.log("Connecting to:", conString);
    setServiceBus(new sbm.AzureServiceBusManager(conString));
    if (serviceBus !== undefined) {
      setNamespace(serviceBus?.namespace);
    }
  };


  return (
    <>
      <ConnectionBox connectionString={""} handleConnect={handleConnect} />
      {serviceBus !== undefined && <ServiceBusDetails serviceBus={serviceBus} key={serviceBus?.connectionString} />}
    </>
  );

}

export default App;

