import { SelectHTMLAttributes } from "react";

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`input-base ${props.className ?? ""}`}
      style={{ appearance: "none", cursor: "pointer", ...props.style }}
    />
  );
}
