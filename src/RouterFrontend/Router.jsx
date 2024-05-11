import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PanelControl } from '../screens/PanelControl/PanelControl'
import { Home } from '../screens/Home';
import { RegistroUsers } from '../screens/PanelControl/outlet/RegistroUsers';
import { Dashboard } from '../screens/Dashboard';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import './Router.css';
import AsignationBeacon from '../screens/PanelControl/outlet/AsignationBeacon';
import { UserProvider } from '../Context/UserProvider';

export const Router = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <BrowserRouter>
            <UserProvider>
            <Sidebar isOpen={isSidebarOpen} toggle={() => setSidebarOpen(!isSidebarOpen)}/>
            <div className='main' style={{ marginLeft: isSidebarOpen ? '250px' : '50px' }}>
                <Routes>
                    <Route path="/" element={<Navigate to={'/dashboard'}/>}  />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/panelcontrol/*" element={<PanelControl />}>
                        <Route path="registrousers"  element={<RegistroUsers />} />
                        <Route path="beaconasignation"  element={<AsignationBeacon />} />
                    </Route>
                    <Route path="cerrarsesion" element={<Navigate to="/" />} />
                </Routes>
            </div>
            <Footer/>
           </UserProvider>
           
        </BrowserRouter>
    );
};
