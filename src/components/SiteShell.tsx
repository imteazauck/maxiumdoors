import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import BasketDrawer from "./BasketDrawer";
import { useCart } from "../context/CartContext";

type NavLinkProps = {
  isActive: boolean;
};

export default function SiteShell({ children }: { children: ReactNode }) {
  const { itemCount, openBasket } = useCart();

  const navLinkClass = ({ isActive }: NavLinkProps) =>
    [
      "rounded-full px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-[#F47A20] text-white" : "text-[#2A2A2A] hover:bg-[#FFF1E6] hover:text-[#F47A20]",
    ].join(" ");

  return (
    <div className="min-h-screen bg-white text-[#2A2A2A]">

      <header className="sticky top-0 z-30 border-b border-[#D7D7D7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="block">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#6B6B6B]">Maxium doors direct</p>
            <p className="mt-1 text-[1.6rem] font-semibold leading-tight text-[#111111]">
              Buy Steel &amp; Aluminium Doors Online
            </p>
          </Link>

          <nav className="hidden items-center gap-4 lg:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/help-centre" className={navLinkClass}>Help Centre</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={openBasket}
              aria-label="Open basket"
              className="relative flex items-center justify-center rounded-full p-2 text-[#111111] transition hover:bg-[#FFF1E6] hover:text-[#F47A20]"
            >
              <ShoppingCart size={22} strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-b-md bg-[#F47A20] px-1 text-xs text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <BasketDrawer />

      <footer className="border-t border-[#D7D7D7] bg-[#FFF6EE]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#6B6B6B]">Maxium doors direct</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#2A2A2A]">
              Quality steel and aluminium doors for commercial and industrial applications.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
