import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import BasketDrawer from "./BasketDrawer";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function SiteShell({ children }: { children: ReactNode }) {
  const { itemCount, openBasket } = useCart();

  // const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  //   [
  //     "transition",
  //     isActive ? "text-[#40584A]" : "text-[#4B4F4C] hover:text-[#40584A]",
  //   ].join(" ");

  return (
    <div className="min-h-screen bg-white text-[#4B4F4C]">
      <div className="border-b border-[#DCE5DD] bg-[#F5F7F5] text-xs font-medium uppercase tracking-[0.24em] text-[#8A908C]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-3 sm:justify-start">
          <span>Quality Doors</span>
          <span>Trade Prices</span>
          <span>Nationwide Delivery</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-[#DCE5DD] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="block">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8A908C]">
              Trade Steel Doors
            </p>
            <p className="mt-1 text-[1.6rem] font-semibold leading-tight text-[#40584A]">
              Buy Steel &amp; Aluminium Doors Online
            </p>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            <NavLink to="/" className="rounded-2xl relative flex items-center jusify-center p-2 text-[#40584A] transition hover:bg-[#070707]">
              Home
            </NavLink>
            <NavLink to="/shop" className="rounded-2xl relative flex items-center jusify-center p-2 text-[#40584A] transition hover:bg-[#070707]">
              Doors
            </NavLink>
            <NavLink to="/help-centre" className="rounded-2xl relative flex items-center jusify-center p-2 text-[#40584A] transition hover:bg-[#070707]">
              Help Centre
            </NavLink>
            
            <NavLink to="/contact" className="rounded-2xl relative flex items-center justify-center p-2 text-[#40584A] transition hover:bg-[#070707]">            
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <NavLink
              to="/order-online"
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
              Order Online
            </NavLink>
          <button
            onClick={openBasket}
            className="relative flex items-center justify-center p-2 text-[#40584A] transition hover:bg-[#070707]"
          >
            <ShoppingCart size={22} strokeWidth={1.8} />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#40584A] px-1 text-xs text-white">
                {itemCount}
              </span>
            )}
          </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <BasketDrawer />

      <footer className="border-t border-[#DCE5DD] bg-[#F5F7F5]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8A908C]">
              Trade Steel Doors
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#4B4F4C]">
              Quality steel and aluminium doors for commercial and industrial applications.

            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#40584A]">Browse</h3>
            <div className="mt-4 space-y-2 text-sm text-[#4B4F4C]">
              <div>
                <Link to="/shop" className="transition hover:text-[#40584A]">
                  All doors
                </Link>
              </div>
              <div>
                <Link
                  to="/product/double-door-f3"
                  className="transition hover:text-[#40584A]"
                >
                  Double Door (F3)
                </Link>
              </div>
              <div>
                <Link
                  to="/product/single-door-f4"
                  className="transition hover:text-[#40584A]"
                >
                  Single Door (F4)
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#40584A]">Support</h3>
            <div className="mt-4 space-y-2 text-sm text-[#4B4F4C]">
              <div>
                <Link
                  to="/help-centre"
                  className="transition hover:text-[#40584A]"
                >
                  Help Centre
                </Link>
              </div>
              <div>
                <Link to="/contact" className="transition hover:text-[#40584A]">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}