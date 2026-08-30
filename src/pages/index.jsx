import Layout from "./Layout.jsx";

import Game from "./Game";

import Home from "./Home";

import Leaderboard from "./Leaderboard";

import Missions from "./Missions";

import PrivacyPolicy from "./PrivacyPolicy";

import Profile from "./Profile";

import Shop from "./Shop";

import Skins from "./Skins";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Game: Game,
    
    Home: Home,
    
    Leaderboard: Leaderboard,
    
    Missions: Missions,
    
    PrivacyPolicy: PrivacyPolicy,
    
    Profile: Profile,
    
    Shop: Shop,
    
    Skins: Skins,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Game />} />
                
                
                <Route path="/Game" element={<Game />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Leaderboard" element={<Leaderboard />} />
                
                <Route path="/Missions" element={<Missions />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Shop" element={<Shop />} />
                
                <Route path="/Skins" element={<Skins />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}