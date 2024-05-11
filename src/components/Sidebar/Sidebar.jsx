import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggle }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <button className="toggle-button" onClick={toggle}>
                {isOpen ? <img className='img-icon' src='../public/img/arrow-left.png'/> : <img className='img-icon' src='../public/img/arrow-right.png'/>}
            </button>
            <input type="text" placeholder="Buscar" className="search"/>
            <NavLink  to={'/dashboard'} className ={({isActive})=> isActive? "menu-item": "menu-item2" }>
                <span className="icon">&#128200;</span>
                <span className="title">Dashboard</span>
            </NavLink>
            <NavLink to={'/panelcontrol/'}className ={({isActive})=> isActive? "menu-item": "menu-item2" }>
                <span className="icon">&#128101;</span>
                <span className="title">Control Panel</span>
            </NavLink>
            <NavLink to={'/beaconAsignation'} className ={({isActive})=> isActive? "menu-item": "menu-item2" }>
                <span className="icon">&#9881;</span>
                <span className="title">Log Out</span>
            </NavLink>
        </div>
    );
};

export default Sidebar;

