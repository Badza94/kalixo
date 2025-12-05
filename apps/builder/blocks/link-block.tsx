// Server Component - Uses CSS variables for theming
import { CustomLink } from "../components/link";
import { resolveColorServer } from "../types/theme-server";

interface SpacingValue {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  all?: string;
}

export interface LinkBlockProps {
  text: string;
  href: string;
  isExternal?: boolean;
  icon?: string; // Icon name from lucide-react
  image?: string; // Image URL
  iconPosition?: "left" | "right";
  textColor?: {
    colorKey: string;
    customColor?: string;
  };
  margin?: SpacingValue;
  padding?: SpacingValue;
  className?: string;
}

export function LinkBlock({
  text,
  href,
  isExternal = false,
  icon,
  image,
  iconPosition = "left",
  textColor,
  margin,
  padding,
  className = "",
}: LinkBlockProps) {
  // Build spacing
  const buildSpacing = (spacing?: SpacingValue) => {
    if (!spacing) return {};
    if (spacing.all) {
      return { padding: spacing.all };
    }
    return {
      paddingTop: spacing.top,
      paddingRight: spacing.right,
      paddingBottom: spacing.bottom,
      paddingLeft: spacing.left,
    };
  };

  const buildMargin = (spacing?: SpacingValue) => {
    if (!spacing) return {};
    if (spacing.all) {
      return { margin: spacing.all };
    }
    return {
      marginTop: spacing.top || "0",
      marginRight: spacing.right || "0",
      marginBottom: spacing.bottom || "0",
      marginLeft: spacing.left || "0",
    };
  };

  // Resolve colors using server-safe function (returns CSS variables)
  const resolvedTextColor = textColor
    ? resolveColorServer(textColor.colorKey, textColor.customColor)
    : undefined;

  const customStyles = {
    ...buildMargin(margin),
    ...buildSpacing(padding),
    ...(resolvedTextColor && { color: resolvedTextColor }),
  };

  return (
    <CustomLink
      href={href}
      isExternal={isExternal}
      icon={icon}
      image={image}
      iconPosition={iconPosition}
      className={`inline-flex gap-2 items-center ${className}`}
      style={customStyles}
    >
      {text}
    </CustomLink>
  );
}

