
import * as React from "react";
import { Button as PrimeButton } from "primereact/button";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
  icon?: string;
  iconPos?: "left" | "right";
  severity?: "secondary" | "success" | "info" | "warning" | "help" | "danger";
}

const mapVariantToSeverity = (variant?: string): string | undefined => {
  switch (variant) {
    case "destructive": return "danger";
    case "outline": return "secondary";
    case "secondary": return "secondary";
    case "ghost": return undefined;
    case "link": return "info";
    default: return undefined;
  }
};

const mapVariantToStyle = (variant?: string): React.CSSProperties => {
  switch (variant) {
    case "ghost":
      return { background: "transparent", border: "none", color: "var(--text-color)" };
    case "link":
      return { background: "transparent", border: "none", textDecoration: "underline" };
    default:
      return {};
  }
};

const mapSizeToStyle = (size?: string): React.CSSProperties => {
  switch (size) {
    case "sm": return { fontSize: "0.875rem", padding: "0.375rem 0.75rem" };
    case "lg": return { fontSize: "1.125rem", padding: "0.75rem 1.5rem" };
    case "icon": return { width: "2.5rem", height: "2.5rem", padding: "0" };
    default: return {};
  }
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, icon, iconPos = "left", ...props }, ref) => {
    const severity = mapVariantToSeverity(variant);
    const variantStyle = mapVariantToStyle(variant);
    const sizeStyle = mapSizeToStyle(size);

    return (
      <PrimeButton
        ref={ref as any}
        className={cn("p-button", className)}
        style={{ ...variantStyle, ...sizeStyle }}
        severity={severity}
        icon={icon ? `pi pi-${icon}` : undefined}
        iconPos={iconPos}
        {...props}
      >
        {children}
      </PrimeButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
