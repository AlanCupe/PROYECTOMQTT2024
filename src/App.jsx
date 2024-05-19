import { Router } from './RouterFrontend/Router';

import "./App.css"
import { Mqttdata } from './components/Mqttdata/Mqttdata';
import { BeaconProvider } from './Context/BeaconProvider';
import { EventosBeaconsProvider } from './Context/EventosBeaconsProvider';
import { GatewayProvider } from './Context/GatewayProvider';


function App() {

    return (
       <>
       <EventosBeaconsProvider>
       <BeaconProvider>
        <GatewayProvider>
            
       <Mqttdata/>
        <Router/>
        </GatewayProvider>
      
       
       
          
       </BeaconProvider>
       </EventosBeaconsProvider>
      
 
       </>
          
       
    );
}

export default App;
