import React from 'react'
import { Outlet , Link,NavLink, useNavigate} from 'react-router-dom'

export const PanelControl = () => {
  return (
    <>
        <nav>
               <ul>
               <li><NavLink to={'/panelcontrol/registrousers'}>User Register</NavLink></li>
               <li><NavLink to={'/panelcontrol/beaconasignation'}>Beacon Asignation</NavLink></li>
               <li><NavLink to={'/panelcontrol/areaasignation'}>Area Asignation</NavLink></li>  
                </ul>     
        </nav>
       <Outlet/>
    </>
  )
}
