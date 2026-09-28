import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "action-btn-primary",
  secondary: "action-btn-secondary",
  success: "action-btn-success",
  danger: "action-btn-danger",
  info: "action-btn-info",
  ghost: "action-btn-ghost",
};

const ICON_SIZE = {
  sm: 15,
  md: 17,
  icon: 16,
};

function ActionButton({
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  children,
  type = "button",
  ...rest
}) {
  const iconSize = ICON_SIZE[size] ?? ICON_SIZE.md;
  const showLabel = Boolean(children);
  const isIconOnly = size === "icon" && !showLabel;

  return (
    <button
      type={type}
      className={[
        "action-btn",
        VARIANTS[variant] ?? VARIANTS.primary,
        size !== "md" ? `action-btn-${size}` : "",
        isIconOnly ? "action-btn-icon-only" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <Loader2 size={iconSize} className="action-btn-spinner" aria-hidden />
      )}
      {!loading && Icon && <Icon size={iconSize} aria-hidden />}
      {showLabel ? <span>{children}</span> : null}
    </button>
  );
}

export default ActionButton;
