import { SpinnerGapIcon } from "@phosphor-icons/react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-red text-beige hover:bg-charcoal focus:ring-red",
    secondary: "bg-green text-beige hover:bg-charcoal focus:ring-green",
    outline:
      "border-2 border-red text-red bg-transparent hover:bg-red hover:text-beige focus:ring-red",
    ghost: "text-charcoal bg-transparent hover:bg-gray/20 focus:ring-charcoal",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <SpinnerGapIcon className="animate-spin mr-2" w-4 weight="bold" />
      )}
      {children}
    </button>
  );
};

export default Button;
