import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import Home from './components/Home'
import Trade from './components/Trade'
import Login from './components/Login'


function App() {
    return (
        <>
            <Routes>
                <Route path="/">
                    <Route index element={<Login />} />
                    <Route path="/portfolio">
                        <Route index element={<Home />} />
                        <Route path="/portfolio/trade" element={<Trade />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;