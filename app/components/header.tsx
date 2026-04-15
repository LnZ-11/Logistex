"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        {/* Navbar for mobile only */}
        <div className="w-full navbar bg-base-200 lg:hidden border-b border-base-300">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-6 w-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold text-xl tracking-tight">Logistex</div>
        </div>
        
        {/* Main page content */}
        <main className="flex-1 overflow-auto bg-base-100 p-4 lg:p-8">
          {children}
        </main>
      </div> 
      
      {/* Sidebar side */}
      <div className="drawer-side z-50 border-r border-base-300 shadow-2xl">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
        <ul className="menu bg-base-400 text-base-content min-h-full w-72 p-4 pt-10 lg:pt-6 space-y-4 font-medium flex flex-col">
          {/* Logo / Header */}
          <li className="mb-6 hidden lg:flex lg:content-center px-4 pt-2 scale-130">
            <Link href="/" className="w-full h-30">
              <Image src="/LogistexLogoLightNoBG.png" alt="Logo" width={1200} height={1200} className='drop-shadow-[0px_0px_1px_rgba(255,255,255,0.7)] transition-transform scale-130 mt-1'  />
            </Link>
          </li>
          
          <div className="divider opacity-30 my-0"></div>

          {/* Navigation Links */}
          <li>
            <Link href="/" className="hover:bg-primary/10 hover:text-primary transition-colors py-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              Tableau de Bord
            </Link>
          </li>
          
          <li>
            <Link href="/inventory" className="hover:bg-primary/10 hover:text-primary transition-colors py-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              Gestion Stock
            </Link>
          </li>

          <li>
            <Link href="/sales" className="hover:bg-primary/10 hover:text-primary transition-colors py-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
              Ventes
            </Link>
          </li>

          <li>
            <Link href="/movements" className="hover:bg-primary/10 hover:text-primary transition-colors py-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>
              Mouvements
            </Link>
          </li>

          {/* Spacer pushes logout to bottom */}
          <div className="flex-1" />

          <div className="divider opacity-30 my-0" />

          {/* Logout button */}
          <li>
            <button
              id="logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-base-content/60 hover:bg-error/10 hover:text-error transition-colors duration-200 disabled:opacity-50"
            >
              {loggingOut ? (
                <span className="loading loading-spinner w-5 h-5" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
              )}
              {loggingOut ? "Déconnexion..." : "Se déconnecter"}
            </button>
          </li>
        </ul>

      </div>
    </div>
  );
}
