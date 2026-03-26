import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

type ActionButtonProps = {
  children: ReactNode;
  to?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseButtonStyle =
  "inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#D7D7D7] bg-[#FFF1E6] px-5 py-3 text-sm font-semibold text-[#111111] font-sans transition duration-200 ease-in-out hover:bg-[#F47A20] hover:border-[#F47A20] hover:text-white focus:outline-none";

const buttonInlineStyle: CSSProperties = {
  background: "transparent",
  backgroundColor: "transparent",
  backgroundImage: "none",
  border: "1px solid #D7D7D7",
  borderRadius: "9999px",
  fontFamily: "sans-serif",
  fontSize: "0.875rem",
  fontWeight: 600,
  appearance: "none",
  WebkitAppearance: "none",
  outline: "none",
  boxShadow: "none",
};

export default function ActionButton({
  children,
  to,
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) {
  const combinedClassName = `${baseButtonStyle} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}