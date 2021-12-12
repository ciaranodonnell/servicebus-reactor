import { Box } from '@mui/system';
import React from 'react';
import { useEffect } from 'react';

import './App.css';

import * as sbm from './AzureServiceBus/AzureServiceBusManager';

import ConnectionBox from './ConnectionBox';
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
    <div className={"wholeAppFlex"}>
      <div className="appHeader">
        <ConnectionBox connectionString={""} handleConnect={handleConnect} />
      </div>
      <div className="appBody">
        {serviceBus !== undefined && <ServiceBusDetails serviceBus={serviceBus} key={serviceBus?.connectionString} />}
      </div>
    </div>
  );

}

export default App;

