import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Layout from './/components/Layout'
import Home from './components/Home'
import Trade from './components/Trade'
import Chart from './components/Chart'


function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<Trade />} />
                    <Route path="/contact" element={<Chart />} />
                </Route>            
            </Routes>
        </>
    );
}

export default App;
