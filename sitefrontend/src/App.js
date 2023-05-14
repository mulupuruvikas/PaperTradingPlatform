 import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Layout from './/components/Layout'
import Home from './components/Home'
import Trade from './components/Trade'
import Chart from './components/Chart'
import Login from './components/Login'


function App() {
    return (
        <>
            <Routes>
                <Route path="/">
                    <Route index element={<Login />} />
                    <Route path="/portfolio" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/portfolio/trade" element={<Trade />} />
                        <Route path="/portfolio/chart" element={<Chart />} />
                    </Route>
                </Route>            
            </Routes>
        </>
    );
}

export default App;
