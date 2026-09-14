import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
};

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = variant === "primary" ? "btn-primary" : "btn-outline";
  return <button className={`${base} ${className}`} {...props} />;
}
