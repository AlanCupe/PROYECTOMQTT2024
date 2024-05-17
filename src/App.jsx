import { Router } from './RouterFrontend/Router';

import "./App.css"
import { Mqttdata } from './components/Mqttdata/Mqttdata';
import { BeaconProvider } from './Context/BeaconProvider';


function App() {

    return (
       <>
       <BeaconProvider>
       <Router/>
       
       <Mqttdata/>
       
          
       </BeaconProvider>
 
       </>
          
       
    );
}

export default App;
