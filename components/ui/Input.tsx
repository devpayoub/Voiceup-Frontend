import { CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`input-base ${props.className ?? ""}`} />;
}

const textareaStyle: CSSProperties = { height: "auto", padding: "0.75rem 1rem", resize: "vertical" };

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`input-base ${props.className ?? ""}`}
      style={{ ...textareaStyle, ...props.style }}
    />
  );
}
