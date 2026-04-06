import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="w-full border-t bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-10 text-sm text-neutral-600">
        © {new Date().getFullYear()} Maxium Doors Direct
      </div>
    </footer>
  );
}