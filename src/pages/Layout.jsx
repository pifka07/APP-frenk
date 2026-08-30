
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import BottomNav from '@/components/BottomNav';

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const hideBottomNav = currentPageName === 'Game' || location.pathname === '/' || location.pathname.toLowerCase() === '/game';

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-100 selection:bg-purple-500 selection:text-white overflow-x-hidden">
            <link href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap" rel="stylesheet" />
            <style>{`
                .font-titan {
                    font-family: 'Titan One', cursive;
                }
                :root {
                    --color-primary: #2DD4BF; /* Teal 400 */
                    --color-secondary: #9333EA; /* Purple 600 */
                    --color-accent: #FACC15; /* Yellow 400 */
                }
                body {
                    overscroll-behavior: none;
                }
                .safe-area-pt {
                    padding-top: env(safe-area-inset-top);
                }
                .safe-area-pb {
                    padding-bottom: env(safe-area-inset-bottom);
                }
            `}</style>
            
            <main className="w-full max-w-md mx-auto min-h-screen bg-slate-900 relative shadow-2xl overflow-hidden border-x border-slate-800">
                <div className={hideBottomNav ? '' : 'pb-16'}>
                    {children}
                </div>
            </main>
            
            {!hideBottomNav && <BottomNav />}
            
            <Toaster position="top-center" />
        </div>
    );
}
