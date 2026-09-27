import { type HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & { padding?: boolean };

export function Card({ padding = true, className = "", ...props }: Props) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
        padding ? "p-5" : ""
      } ${className}`}
      {...props}
    />
  );
}