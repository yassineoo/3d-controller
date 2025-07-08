"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Globe, Menu, X, ChevronDown, ExternalLink, Medal, UserCircle2, UsersIcon } from "lucide-react";
import { cn } from "./utils";

export default function OoredooHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("particuliers");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("FR");
  const [activeSecondaryNav, setActiveSecondaryNav] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close language dropdown when clicking outside
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }

      // Close search when clicking outside
      if (isSearchOpen && searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Focus the search input when opened
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = isMenuOpen ? "auto" : "hidden";
  };

  const toggleLanguage = () => {
    setLanguageOpen(!languageOpen);
  };

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    setLanguageOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isScrolled ? "shadow-md" : "",
        isScrolled ? "transform-gpu translate-y-0" : ""
      )}
    >
      {/* Primary Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex h-[70px] max-w-[1440px] items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo Section */}
          <Link href="/" className="flex items-center p-3 transition-opacity hover:opacity-95">
            <Image src="/Logo.svg" alt="Ooredoo Logo" width={120} height={40} className="h-10 w-auto" priority />
          </Link>

          {/* Primary Navigation - Desktop */}
          {/* Premium Primary Navigation - Desktop */}
          <nav className="hidden md:flex">
            {/* Navigation Items Container with Background Effects */}
            <div className="relative flex">
              {/* Particuliers Navigation Item */}
              <Link
                href="/particuliers"
                className={`group relative overflow-hidden rounded-lg px-5 py-2 text-base font-medium transition-all duration-300 ${
                  activeNav === "particuliers" ? "text-red-600" : "text-gray-800 hover:text-red-600"
                }`}
                onClick={(e) => {
                  // Set active nav state for immediate visual feedback
                  setActiveNav("particuliers");
                }}
                onMouseEnter={(e) => {
                  // Add ripple effect on hover
                  if (activeNav !== "particuliers") {
                    const ripple = document.createElement("span");
                    ripple.className = "nav-hover-ripple";
                    e.currentTarget.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 1000);
                  }
                }}
              >
                {/* Text */}
                <span className="relative z-10">Particuliers</span>

                {/* Hover Effect Backdrop */}
                <span className="absolute inset-0 -z-10 block rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-r from-red-400 to-red-600"></span>

                {/* Selected Item Background Effect */}
                {activeNav === "particuliers" ? (
                  <>
                    {/* Animated background gradient */}
                    <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-red-50 to-red-100 opacity-70"></span>

                    {/* Bottom line with liquid animation */}
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-red-600 animate-pulse-subtle">
                      <span className="absolute bottom-0 left-0 h-full w-1/3 animate-slide-right-loop bg-gradient-to-r from-transparent via-white to-transparent opacity-70"></span>
                    </span>

                    {/* Subtle glow effect */}
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-red-500 blur-sm"></span>

                    {/* Particle effects */}
                    <div className="particle-container">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="particle absolute bottom-0 bg-red-500 rounded-full opacity-0"
                          style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.max(2, Math.random() * 4)}px`,
                            height: `${Math.max(2, Math.random() * 4)}px`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                          }}
                        ></span>
                      ))}
                    </div>
                  </>
                ) : (
                  // Hover effects for unselected item
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Animated bottom line on hover */}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 bg-red-500"></span>

                    {/* Hover particles */}
                    <div className="hover-particle-container pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="hover-particle absolute bottom-0 bg-red-400 rounded-full opacity-0 group-hover:opacity-70"
                          style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.max(2, Math.random() * 3)}px`,
                            height: `${Math.max(2, Math.random() * 3)}px`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${0.8 + Math.random() * 1}s`,
                          }}
                        ></span>
                      ))}
                    </div>
                  </div>
                )}
              </Link>

              {/* Entreprises Navigation Item */}
              <Link
                href="/entreprises"
                className={`group relative ml-8 overflow-hidden rounded-lg px-5 py-2 text-base font-medium transition-all duration-300 ${
                  activeNav === "entreprises" ? "text-red-600" : "text-gray-800 hover:text-red-600"
                }`}
                onClick={(e) => {
                  // Set active nav state for immediate visual feedback
                  setActiveNav("entreprises");
                }}
                onMouseEnter={(e) => {
                  // Add ripple effect on hover
                  if (activeNav !== "entreprises") {
                    const ripple = document.createElement("span");
                    ripple.className = "nav-hover-ripple";
                    e.currentTarget.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 1000);
                  }
                }}
              >
                {/* Text */}
                <span className="relative z-10">Entreprises</span>

                {/* Hover Effect Backdrop */}
                <span className="absolute inset-0 -z-10 block rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-r from-red-400 to-red-600"></span>

                {/* Selected Item Background Effect */}
                {activeNav === "entreprises" ? (
                  <>
                    {/* Animated background gradient */}
                    <span className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-red-50 to-red-100 opacity-70"></span>

                    {/* Bottom line with liquid animation */}
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-red-600 animate-pulse-subtle">
                      <span className="absolute bottom-0 left-0 h-full w-1/3 animate-slide-right-loop bg-gradient-to-r from-transparent via-white to-transparent opacity-70"></span>
                    </span>

                    {/* Subtle glow effect */}
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-red-500 blur-sm"></span>

                    {/* Particle effects */}
                    <div className="particle-container">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="particle absolute bottom-0 bg-red-500 rounded-full opacity-0"
                          style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.max(2, Math.random() * 4)}px`,
                            height: `${Math.max(2, Math.random() * 4)}px`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`,
                          }}
                        ></span>
                      ))}
                    </div>
                  </>
                ) : (
                  // Hover effects for unselected item
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Animated bottom line on hover */}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 bg-red-500"></span>

                    {/* Hover particles */}
                    <div className="hover-particle-container pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <span
                          key={i}
                          className="hover-particle absolute bottom-0 bg-red-400 rounded-full opacity-0 group-hover:opacity-70"
                          style={{
                            left: `${Math.random() * 100}%`,
                            width: `${Math.max(2, Math.random() * 3)}px`,
                            height: `${Math.max(2, Math.random() * 3)}px`,
                            animationDelay: `${Math.random() * 1}s`,
                            animationDuration: `${0.8 + Math.random() * 1}s`,
                          }}
                        ></span>
                      ))}
                    </div>
                  </div>
                )}
              </Link>

              {/* About Link with Special Hover Effect */}
              <Link
                href="/about"
                className="group relative ml-8 overflow-hidden rounded-lg px-5 py-2 text-base font-medium text-gray-800 transition-all duration-300 hover:text-gray-900"
                onMouseEnter={(e) => {
                  // Add ripple effect on hover
                  const ripple = document.createElement("span");
                  ripple.className = "nav-hover-ripple";
                  e.currentTarget.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 1000);
                }}
              >
                {/* Text */}
                <span className="relative z-10">Tout sur Ooredoo</span>

                {/* Subtle Gradient Hover Effect */}
                <span className="absolute inset-0 -z-10 block rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-r from-blue-400 to-red-500"></span>

                {/* Additional hover effects for About link */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Animated bottom line on hover */}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-red-500"></span>

                  {/* Hover particles */}
                  <div className="hover-particle-container pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="hover-particle absolute bottom-0 rounded-full opacity-0 group-hover:opacity-70"
                        style={{
                          left: `${Math.random() * 100}%`,
                          width: `${Math.max(2, Math.random() * 3)}px`,
                          height: `${Math.max(2, Math.random() * 3)}px`,
                          background: i % 2 === 0 ? "#3b82f6" : "#ef4444",
                          animationDelay: `${Math.random() * 1}s`,
                          animationDuration: `${0.8 + Math.random() * 1}s`,
                        }}
                      ></span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>

            {/* Custom Animation Styles */}
            <style jsx>{`
              @keyframes pulse-subtle {
                0%,
                100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.8;
                }
              }

              .animate-pulse-subtle {
                animation: pulse-subtle 2s infinite;
              }

              @keyframes slide-right-loop {
                0% {
                  transform: translateX(-100%);
                }
                100% {
                  transform: translateX(300%);
                }
              }

              .animate-slide-right-loop {
                animation: slide-right-loop 2s infinite;
              }

              .nav-hover-ripple {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(235, 29, 34, 0.1) 0%, rgba(235, 29, 34, 0) 70%);
                border-radius: 50%;
                opacity: 0;
                animation: ripple-nav 0.8s ease-out;
                z-index: -5;
              }

              @keyframes ripple-nav {
                0% {
                  transform: translate(-50%, -50%) scale(0);
                  opacity: 0.5;
                }
                100% {
                  transform: translate(-50%, -50%) scale(1);
                  opacity: 0;
                }
              }

              .particle {
                animation: float-up 2s ease-out forwards;
              }

              @keyframes float-up {
                0% {
                  transform: translateY(0);
                  opacity: 0.7;
                }
                70% {
                  opacity: 0.5;
                }
                100% {
                  transform: translateY(-20px);
                  opacity: 0;
                }
              }

              /* New hover animations for unselected items */
              .hover-particle {
                animation: hover-float-up 1.5s ease-out forwards;
                animation-play-state: paused;
              }

              .group:hover .hover-particle {
                animation-play-state: running;
              }

              @keyframes hover-float-up {
                0% {
                  transform: translateY(0);
                  opacity: 0.7;
                }
                70% {
                  opacity: 0.3;
                }
                100% {
                  transform: translateY(-15px);
                  opacity: 0;
                }
              }
            `}</style>
          </nav>

          {/* Utility Navigation - Desktop */}
          <div className="hidden items-center space-x-5 md:flex lg:space-x-6">
            {/* Utility Icons */}
            <div className="hidden items-center space-x-6 lg:flex">
              <Link
                href="#"
                className="group flex flex-col items-center transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="Noudjoum"
              >
                <div className="relative mb-1 h-6 w-6 overflow-hidden rounded-full bg-gray-50">
                  <Medal size={22} className="h-full w-full object-cover text-[#EB1D22]" />
                </div>
                <span className="text-xs font-medium group-hover:text-[#EB1D22]">Noudjoum</span>
              </Link>
              <Link
                href="#"
                className="group flex flex-col items-center transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="My Ooredoo"
              >
                <div className="relative mb-1 h-6 w-6 overflow-hidden rounded-full bg-gray-50">
                  <UserCircle2 size={22} className="h-full w-full object-cover text-[#EB1D22]" />
                </div>
                <span className="text-xs font-medium group-hover:text-[#EB1D22]">My Ooredoo</span>
              </Link>
              <Link
                href="#"
                className="group flex flex-col items-center transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="eStorm"
              >
                <div className="relative mb-1 h-6 w-6 overflow-hidden rounded-full bg-gray-50">
                  <Image src={"./logo-square.svg"} alt="eStorm" width={22} height={22} className="h-full w-full object-cover text-[#EB1D22]" />
                </div>
                <span className="text-xs font-medium group-hover:text-[#EB1D22]">eStorm</span>
              </Link>
              <Link
                href="#"
                className="group flex flex-col items-center transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="Partenaires"
              >
                <div className="relative mb-1 h-6 w-6 overflow-hidden rounded-full bg-gray-50">
                  <UsersIcon size={22} className="h-full w-full object-cover text-[#EB1D22]" />
                </div>
                <span className="text-xs font-medium group-hover:text-[#EB1D22]">Partenaires</span>
              </Link>
            </div>

            {/* Search */}
            {/* Premium Search Bar with Advanced UI/UX */}
            <div className="relative">
              {/* Search Toggle Button with Ripple Effect */}
              <button
                onClick={toggleSearch}
                className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 active:scale-95"
                aria-label="Search"
                aria-expanded={isSearchOpen}
                aria-controls="search-panel"
              >
                {/* Animated Search Icon */}
                {isSearchOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-600 transition-transform duration-300"
                    style={{ transform: "rotate(90deg)" }}
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  <Search size={20} className="text-gray-700 transition-all duration-300 group-hover:text-red-600" />
                )}

                {/* Ripple effect on click */}
                <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                  <span className="animate-ripple absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-200 opacity-0"></span>
                </span>
              </button>

              {/* Animated Search Panel with Backdrop */}
              {isSearchOpen && (
                <>
                  {/* Semi-transparent backdrop */}
                  <div className="fixed inset-0 bg-black bg-opacity-5 backdrop-blur-[2px] z-10" onClick={toggleSearch} aria-hidden="true"></div>

                  {/* Search Panel */}
                  <div
                    id="search-panel"
                    className="absolute right-0 top-full z-20 mt-2 w-72 origin-top-right"
                    style={{
                      animation: "searchPanelIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    }}
                  >
                    <div className="rounded-lg border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      {/* Search Input Container */}
                      <div className="relative">
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Search size={16} />
                        </div>

                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Rechercher sur Ooredoo..."
                          className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pl-10 pr-10 text-sm shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                          autoFocus
                          onKeyUp={(e) => {
                            if (e.key === "Escape") toggleSearch();
                          }}
                        />

                        {/* Clear Button (appears when text is entered) */}
                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-opacity duration-200 hover:bg-gray-100 hover:text-gray-600"
                          onClick={() => {
                            if (searchInputRef.current) searchInputRef.current.value = "";
                            searchInputRef.current?.focus();
                          }}
                          aria-label="Clear search"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                        </button>
                      </div>

                      {/* Recent Searches Section */}
                      <div className="mt-2 px-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium text-gray-500">Recherches récentes</h3>
                          <button className="text-xs text-red-600 hover:text-red-700">Effacer</button>
                        </div>

                        <div className="mt-1 space-y-1">
                          {["Internet", "Forfaits mobiles", "Support"].map((item, index) => (
                            <button
                              key={index}
                              className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                if (searchInputRef.current) searchInputRef.current.value = item;
                              }}
                            >
                              <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="mt-2 border-t border-gray-100 pt-2">
                        <h3 className="px-1 text-xs font-medium text-gray-500">Accès rapide</h3>
                        <div className="mt-1 grid grid-cols-2 gap-1">
                          {[
                            { name: "Forfaits", icon: "package" },
                            { name: "Support", icon: "help-circle" },
                            { name: "Boutiques", icon: "map-pin" },
                            { name: "Mon compte", icon: "user" },
                          ].map((item, index) => (
                            <button key={index} className="flex items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                              <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-600">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </span>
                              {item.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Keyframe Animations */}
              <style jsx>{`
                @keyframes searchPanelIn {
                  from {
                    opacity: 0;
                    transform: translateY(-8px) scale(0.96);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }

                @keyframes ripple {
                  0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0.6;
                  }
                  100% {
                    transform: translate(-50%, -50%) scale(100);
                    opacity: 0;
                  }
                }

                .animate-ripple {
                  animation: ripple 0.6s linear;
                }
              `}</style>
            </div>

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 rounded-md px-3 py-2 transition-colors hover:bg-[#F8F8F8]"
                aria-label="Change language"
                aria-expanded={languageOpen}
              >
                <span className="text-sm font-medium">{currentLanguage}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${languageOpen ? "rotate-180" : ""}`} />
              </button>
              {languageOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 animate-in fade-in slide-in-from-top-5 rounded-md border border-gray-100 bg-white p-1 shadow-lg duration-200">
                  <button
                    onClick={() => changeLanguage("FR")}
                    className={cn(
                      "w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#F5F5F5]",
                      currentLanguage === "FR" ? "bg-[#F8F8F8] font-medium text-[#EB1D22]" : ""
                    )}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage("AR")}
                    className={cn(
                      "w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-[#F5F5F5]",
                      currentLanguage === "AR" ? "bg-[#F8F8F8] font-medium text-[#EB1D22]" : ""
                    )}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleSearch}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                isSearchOpen ? "bg-[#F8F8F8] text-[#EB1D22]" : "hover:bg-[#F8F8F8]"
              )}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={toggleMenu}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                isMenuOpen ? "bg-[#F8F8F8] text-[#EB1D22]" : "hover:bg-[#F8F8F8]"
              )}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      <div className="hidden bg-[#F5F5F5] md:block">
        <div className="mx-auto flex h-[50px] max-w-[1440px] items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center">
            {/* Logo Section */}
            <Link href="/" className="flex items-center p-3 transition-opacity hover:opacity-95"></Link>
            {/* Secondary Navigation Items */}
            <nav className="flex space-x-8">
              <Link
                href="#"
                onClick={() => setActiveSecondaryNav("offres")}
                className={cn(
                  "py-4 text-base font-medium transition-colors hover:text-[#EB1D22]",
                  activeSecondaryNav === "offres" ? "text-[#EB1D22]" : ""
                )}
              >
                Offres mobiles
              </Link>
              <Link
                href="#"
                onClick={() => setActiveSecondaryNav("internet")}
                className={cn(
                  "py-4 text-base font-medium transition-colors hover:text-[#EB1D22]",
                  activeSecondaryNav === "internet" ? "text-[#EB1D22]" : ""
                )}
              >
                Internet
              </Link>
              <Link
                href="#"
                onClick={() => setActiveSecondaryNav("services")}
                className={cn(
                  "py-4 text-base font-medium transition-colors hover:text-[#EB1D22]",
                  activeSecondaryNav === "services" ? "text-[#EB1D22]" : ""
                )}
              >
                Services
              </Link>
              <Link
                href="#"
                onClick={() => setActiveSecondaryNav("telephones")}
                className={cn(
                  "py-4 text-base font-medium transition-colors hover:text-[#EB1D22]",
                  activeSecondaryNav === "telephones" ? "text-[#EB1D22]" : ""
                )}
              >
                Téléphones
              </Link>
              <Link
                href="#"
                onClick={() => setActiveSecondaryNav("assistance")}
                className={cn(
                  "py-4 text-base font-medium transition-colors hover:text-[#EB1D22]",
                  activeSecondaryNav === "assistance" ? "text-[#EB1D22]" : ""
                )}
              >
                Assistance
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[70px] z-50 h-[calc(100vh-70px)] w-full overflow-y-auto bg-white md:hidden">
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Primary Navigation - Mobile */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setActiveNav("particuliers");
                    toggleMenu();
                  }}
                  className={cn(
                    "w-full rounded-md px-4 py-3.5 text-left text-lg font-medium transition-colors",
                    activeNav === "particuliers" ? "bg-[#F8F8F8] text-[#EB1D22]" : "hover:bg-[#F8F8F8]"
                  )}
                >
                  Particuliers
                </button>
                <button
                  onClick={() => {
                    setActiveNav("entreprises");
                    toggleMenu();
                  }}
                  className={cn(
                    "w-full rounded-md px-4 py-3.5 text-left text-lg font-medium transition-colors",
                    activeNav === "entreprises" ? "bg-[#F8F8F8] text-[#EB1D22]" : "hover:bg-[#F8F8F8]"
                  )}
                >
                  Entreprises
                </button>
                <Link
                  href="/about"
                  className="block w-full rounded-md px-4 py-3.5 text-left text-lg font-medium transition-colors hover:bg-[#F8F8F8]"
                  onClick={toggleMenu}
                >
                  Tout sur Ooredoo
                </Link>
              </div>

              {/* GO PLAY MARKET - Mobile */}
              <Link
                href="#"
                className="flex items-center justify-center rounded-md bg-[#DDFF00] px-4 py-3.5 text-center text-lg font-bold text-black transition-transform hover:scale-[1.02]"
                onClick={toggleMenu}
              >
                <span className="animate-pulse-subtle">GO PLAY MARKET</span>
                <ExternalLink size={18} className="ml-2" />
              </Link>

              {/* Secondary Navigation - Mobile */}
              <div className="rounded-lg border border-gray-100 bg-[#F9F9F9]">
                <div className="space-y-1 p-2">
                  <Link
                    href="#"
                    className="block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white hover:text-[#EB1D22]"
                    onClick={toggleMenu}
                  >
                    Offres mobiles
                  </Link>
                  <Link
                    href="#"
                    className="block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white hover:text-[#EB1D22]"
                    onClick={toggleMenu}
                  >
                    Internet
                  </Link>
                  <Link
                    href="#"
                    className="block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white hover:text-[#EB1D22]"
                    onClick={toggleMenu}
                  >
                    Services
                  </Link>
                  <Link
                    href="#"
                    className="block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white hover:text-[#EB1D22]"
                    onClick={toggleMenu}
                  >
                    Téléphones
                  </Link>
                  <Link
                    href="#"
                    className="block rounded-md px-4 py-3 text-base font-medium transition-colors hover:bg-white hover:text-[#EB1D22]"
                    onClick={toggleMenu}
                  >
                    Assistance
                  </Link>
                </div>
              </div>

              {/* Utility Navigation - Mobile */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="#"
                  className="flex items-center space-x-3 rounded-md bg-white p-4 shadow-sm transition-all hover:shadow"
                  onClick={toggleMenu}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                    <Image src="/placeholder.svg?height=22&width=22" alt="" width={20} height={20} />
                  </div>
                  <span className="font-medium">Noudjoum</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-3 rounded-md bg-white p-4 shadow-sm transition-all hover:shadow"
                  onClick={toggleMenu}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                    <Image src="/placeholder.svg?height=22&width=22" alt="" width={20} height={20} />
                  </div>
                  <span className="font-medium">My Ooredoo</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-3 rounded-md bg-white p-4 shadow-sm transition-all hover:shadow"
                  onClick={toggleMenu}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                    <Image src="/placeholder.svg?height=22&width=22" alt="" width={20} height={20} />
                  </div>
                  <span className="font-medium">eStorm</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center space-x-3 rounded-md bg-white p-4 shadow-sm transition-all hover:shadow"
                  onClick={toggleMenu}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                    <Image src="/placeholder.svg?height=22&width=22" alt="" width={20} height={20} />
                  </div>
                  <span className="font-medium">Partenaires</span>
                </Link>
              </div>

              {/* Language Selector - Mobile */}
              <div className="pt-2">
                <p className="mb-2 text-sm font-medium text-gray-500">Choisir la langue</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => changeLanguage("FR")}
                    className={cn(
                      "rounded-md px-4 py-3 text-center text-base transition-colors",
                      currentLanguage === "FR" ? "bg-[#EB1D22] font-medium text-white" : "border border-gray-200 hover:bg-[#F8F8F8]"
                    )}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage("AR")}
                    className={cn(
                      "rounded-md px-4 py-3 text-center text-base transition-colors",
                      currentLanguage === "AR" ? "bg-[#EB1D22] font-medium text-white" : "border border-gray-200 hover:bg-[#F8F8F8]"
                    )}
                  >
                    العربية
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay - Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-x-0 top-[70px] z-40 bg-white p-4 shadow-md md:hidden">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher sur Ooredoo..."
              className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 pl-10 pr-10 focus:border-[#EB1D22] focus:outline-none focus:ring-1 focus:ring-[#EB1D22]"
              autoFocus
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <button
              onClick={toggleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick search suggestions */}
          <div className="mt-3 space-y-1 px-2">
            <p className="text-xs font-medium uppercase text-gray-500">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-sm transition-colors hover:bg-[#EB1D22] hover:text-white">
                Forfaits mobiles
              </button>
              <button className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-sm transition-colors hover:bg-[#EB1D22] hover:text-white">
                Internet Fibre
              </button>
              <button className="rounded-full bg-[#F5F5F5] px-3 py-1.5 text-sm transition-colors hover:bg-[#EB1D22] hover:text-white">
                Support technique
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to push content below the fixed header */}
      <div className="h-[120px] md:h-[120px]"></div>
    </header>
  );
}
