"use client";

import React, { useState } from "react";
import SuzukiLogo from "../assets/icons/suzuki-logo";
import Link from "next/link";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const headerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Articles",
    href: "/articles",
  },
  {
    label: "Others",
    href: "/others",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <header className="px-4 py-5 bg-transparent mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center px-5 py-3 bg-transparent justify-center">
            <Link
              href="/"
              className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <SuzukiLogo width={100} height={20} />
            </Link>
          </div>
          <div className="flex items-center justify-between gap-32">
            <SearchInput />
            <div className="flex items-center gap-2 mr-8">
              <MenuIcon
                className="w-4 h-4 text-white"
                onClick={() => setIsOpen(true)}
              />
              <p className="font-normal text-base text-white font-suzuki-pro-headline">
                Menu
              </p>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {isOpen && <PopupSidebar setIsOpen={setIsOpen} isOpen={isOpen} />}
      </AnimatePresence>
    </>
  );
}

function SearchInput() {
  return (
    <div className="flex items-center gap-2 flex-1">
      <SearchIcon className="w-4 h-4 text-white" />
      <input
        type="text"
        placeholder="Search"
        className="w-64 outline-none font-sans text-white placeholder:text-white"
      />
    </div>
  );
}

const PopupSidebar = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/20 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => setIsOpen(false)}
      aria-hidden
    >
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 right-0 w-full max-w-sm h-full bg-white backdrop-filter backdrop-blur-sm z-50 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end p-4">
          <XIcon
            className="w-4 h-4 text-black hover:cursor-pointer hover:text-primary-suzuki transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <div className="flex flex-col gap-5 px-4 pb-4">
          {headerLinks.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              className="text-black hover:text-primary-suzuki transition-colors duration-300 border-b font-suzuki-pro-headline border-transparent hover:border-primary-suzuki pb-2 w-fit"
            >
              <span className="font-normal">{link.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
