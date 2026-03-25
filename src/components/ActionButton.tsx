import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

type ActionButtonProps = {
  children: ReactNode;
  to?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseButtonStyle =
  "inline-flex min-w-[220px] items-center justify-center rounded-full border border-[#D7D7D7] bg-transparent px-5 py-3 text-sm font-semibold text-[#4F46E5] font-sans transition duration-200 ease-in-out hover:bg-[#FFF6EE] hover:text-[#4F46E5] focus:outline-none";
  
const buttonInlineStyle: CSSProperties = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#D7D7D7",
  borderRadius: "9999px",
  backgroundColor: "#FFF6EE",
  appearance: "none",
  WebkitAppearance: "none",
  fontFamily: "sans-serif",  
  fontSize: "0.875rem",
  fontWeight: 600,
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
      style={buttonInlineStyle}
      {...props}
    >
      {children}
    </button>
  );
}