import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import BasketDrawer from "./BasketDrawer";

type NavLinkProps = {
  isActive: boolean;
};

type HeaderProps = {
};

const navLinkClass = ({ isActive }: NavLinkProps) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
    isActive
      ? "border border-[#F3D3BA] bg-[#FFF1E6] text-[#111111]"
      : "text-[#2A2A2A] hover:bg-[#FFF1E6] hover:text-[#F47A20]",
  ].join(" ");

export default function Header({ hideMenu = false }: HeaderProps) {
  const { itemCount, openBasket } = useCart();

  return (
    <div>
    <header className="sticky top-0 z-30 border-b border-[#D7D7D7] bg-white/90 backdrop-blur">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-8 py-4">
          <div className="min-w-0 flex-1 pr-8">
            <Link to="/" className="block leading-none">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#6B6B6B]">
                Maxium doors direct
              </p>
              <p className="mt-1 text-[clamp(1.75rem,2.6vw,3.25rem)] font-semibold leading-tight text-[#111111]">
                Buy Steel &amp; Aluminium Doors Online
              </p>
            </Link>
          </div>

          {!hideMenu && (
            <nav className="hidden shrink-0 items-center gap-4 lg:flex">
              <NavLink to="/" className={navLinkClass}>
                My Quote
              </NavLink>
              <NavLink to="/help-centre" className={navLinkClass}>
                Help Centre
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </nav>
          )}

          {!hideMenu && (
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={openBasket}
                aria-label="Open basket"
                className="relative flex items-center justify-center rounded-full border border-[#D7D7D7] bg-[#FFF1E6] p-3 text-[#111111] transition hover:border-[#F47A20] hover:bg-[#F47A20] hover:text-white"
              >
                <ShoppingCart size={22} strokeWidth={1.8} />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-b-md bg-[#F47A20] px-1 text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
      <BasketDrawer />
    </div>
  );
}