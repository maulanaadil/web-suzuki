"use client";

import React, { useEffect, useMemo, useState } from "react";
import SuzukiLogo from "../assets/icons/suzuki-logo";
import Link from "next/link";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const headerLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Credit Calculator",
    href: "/credit-calculator",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Products",
    href: "/cars",
  },
  {
    label: "Articles",
    href: "/articles",
  },
  {
    label: "Testimonial",
    href: "/reviews",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";
  const filteredHeaderLinks = useMemo(() => {
    return headerLinks.filter((link) =>
      isHomePage ? link.href !== "/" : true,
    );
  }, [isHomePage]);

  return (
    <header
      className={`sticky top-0 z-50 px-4  py-2 bg-white/80 backdrop-blur-sm`}
    >
      <div
        className={`flex items-center justify-between ${isHomePage && "container"} mx-auto`}
      >
        <div className="flex items-center px-5 py-3 bg-transparent w-full">
          <Link
            href="/"
            className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
          >
            <SuzukiLogo width={100} height={20} />
          </Link>
        </div>
        <div className="items-center justify-end flex gap-8 w-full pr-10">
          {filteredHeaderLinks.map((link) => (
            <Link
              href={link.href}
              key={link.label}
              className="text-black hover:text-primary-suzuki transition-colors duration-300 border-b font-suzuki-pro-headline border-transparent hover:border-primary-suzuki w-fit"
            >
              <span className="font-normal">{link.label}</span>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between">
          {/* <SearchInput
            variant={isHomePage ? "white" : "black"}
            onSelect={(href) => router.push(href)}
            onSearch={(query) =>
              router.push(`/search?q=${encodeURIComponent(query)}`)
            }
          />
          <div className="flex items-center gap-2 mr-8">
            <MenuIcon
              className={`w-4 h-4 ${isHomePage ? "text-white" : "text-black"}`}
              onClick={() => setIsOpen(true)}
            />
            <p
              className={`font-normal text-base ${isHomePage ? "text-white" : "text-black"} font-suzuki-pro-headline`}
            >
              Menu
            </p>
          </div> */}
        </div>
      </div>
      <AnimatePresence>
        {isOpen && <PopupSidebar setIsOpen={setIsOpen} isOpen={isOpen} />}
      </AnimatePresence>
    </header>
  );
}

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
};

const searchablePages = [
  { label: "Home", href: "/" },
  { label: "Cars", href: "/cars" },
  { label: "Contact", href: "/contact" },
  { label: "Reviews", href: "/reviews" },
];

function SearchInput({
  variant,
  onSelect,
  onSearch,
}: {
  variant: "white" | "black";
  onSelect: (href: string) => void;
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: SearchProduct[] };
        setProducts(payload.data ?? []);
      } catch {
        setProducts([]);
      }
    };
    void loadProducts();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const pageMatches = useMemo(() => {
    if (!normalizedQuery) return [];
    return searchablePages.filter((page) =>
      page.label.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);
  const productMatches = useMemo(() => {
    if (!normalizedQuery) return [];
    return products
      .filter((product) => product.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [normalizedQuery, products]);

  const hasMatches = pageMatches.length > 0 || productMatches.length > 0;

  const handleSearchSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    setQuery("");
    onSearch(trimmed);
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-2 px-2 py-2 rounded-lg flex-1 ${variant === "white" ? "bg-transparent" : "bg-neutral-100"}`}
      >
        <SearchIcon
          className={`w-4 h-4 ${variant === "white" ? "text-white" : "text-black"}`}
        />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 120)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearchSubmit();
            }
          }}
          placeholder="Cari halaman atau produk..."
          className={`w-64 outline-none font-sans ${variant === "white" ? "text-white" : "text-black"} placeholder:${variant === "white" ? "text-white/90" : "text-black/60"}`}
        />
      </div>

      {isOpen && normalizedQuery && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
          {!hasMatches && (
            <p className="px-3 py-2 text-sm text-gray-500">
              Tidak ada hasil, tekan Enter untuk cari semua.
            </p>
          )}

          {pageMatches.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Halaman
              </p>
              {pageMatches.map((page) => (
                <button
                  key={page.href}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onMouseDown={() => {
                    setIsOpen(false);
                    setQuery("");
                    onSelect(page.href);
                  }}
                >
                  {page.label}
                </button>
              ))}
            </div>
          )}

          {productMatches.length > 0 && (
            <div>
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Produk
              </p>
              {productMatches.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onMouseDown={() => {
                    setIsOpen(false);
                    setQuery("");
                    onSelect(`/cars/${product.slug}`);
                  }}
                >
                  {product.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
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
