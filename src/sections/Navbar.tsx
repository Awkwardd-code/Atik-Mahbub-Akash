'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { navLinks } from '../constants';
import type { NavLink } from '../constants';
import Button from '../components/Button';

type NavItemsProps = {
  activeLink: string;
  onClick?: (href: string) => void;
  orientation?: 'horizontal' | 'vertical';
};

const NavItems = ({ activeLink, onClick = () => {}, orientation = 'horizontal' }: NavItemsProps) => (
  <ul className={`flex ${orientation === 'horizontal' ? 'items-center gap-6' : 'flex-col gap-4'} text-sm font-medium`}>
    {navLinks.map((item: NavLink) => (
      <li key={item.id}>
        <Link
          href={item.href}
          onClick={() => onClick(item.href)}
          className={`relative inline-flex items-center gap-1 px-2 py-1 transition-colors duration-300 ${
            activeLink === item.href ? 'text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          {activeLink === item.href && (
            <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-white/80" aria-hidden />
          )}
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(navLinks[0]?.href ?? '#home');

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);
  const handleNavItemClick = (href: string) => {
    setActiveLink(href);
    closeMenu();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="relative w-full">
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-violet-600/15 via-transparent to-cyan-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-white/20 via-white/5 to-transparent opacity-40"
          aria-hidden
        />
        <div className="relative flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 bg-slate-950/70 backdrop-blur-3xl shadow-[0_25px_80px_rgba(2,6,23,0.85)] transform-gpu">
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent opacity-60"
            aria-hidden
          />
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2" aria-label="Go back to homepage">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 font-bold">
                A
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-white">Atik Mahbub Akash</span>
                <span className="text-xs text-slate-400">Design systems &amp; immersive web</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-3 rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available for select collaborations
            </div>
          </div>

          <nav className="hidden lg:flex">
            <NavItems activeLink={activeLink} onClick={handleNavItemClick} />
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              href="#projects"
              name="View work"
              containerClass="px-4 py-2 rounded-full border border-white/15 text-sm text-white hover:border-white/40"
            />
            <Button
              href="#contact"
              name="Book a call"
              containerClass="px-5 py-2 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-200"
            />
          </div>

          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 text-white"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}>
            <Image
              src={isOpen ? '/assets/close.svg' : '/assets/menu.svg'}
              alt="toggle"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
        <div className="relative mx-0 mt-4 overflow-hidden bg-slate-950/95 backdrop-blur-3xl p-6 shadow-[0_35px_80px_rgba(2,6,23,0.75)]">
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-violet-600/20 via-transparent to-cyan-500/20 blur-3xl"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent opacity-80"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent opacity-60"
            aria-hidden
          />
          <div className="relative">
            <NavItems activeLink={activeLink} onClick={handleNavItemClick} orientation="vertical" />
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 text-sm text-slate-200">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Accepting new projects
              </div>
              <div onClick={() => handleNavItemClick('#contact')}>
                <Button
                  href="#contact"
                  name="Book a call"
                  containerClass="w-full justify-center rounded-2xl bg-white text-slate-900 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
