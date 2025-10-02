"use client";

import { Hero1 } from "@workspace/ui/components/heroes/hero1";
import { Hero2 } from "@workspace/ui/components/heroes/hero2";

interface HeroBlockProps {
  type: "hero1" | "hero2";
  // Hero1 specific props
  badge?: string;
  heading: string;
  subheading?: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
  image2: {
    src: string;
    alt: string;
  };
}

export function HeroBlock({
  type,
  badge,
  heading,
  subheading,
  description,
  buttons,
  image,
  image2,
}: HeroBlockProps) {
  if (type === "hero1") {
    return (
      <Hero1
        badge={badge}
        heading={heading}
        description={description}
        buttons={buttons}
        image={image}
      />
    );
  }

  if (type === "hero2") {
    return (
      <Hero2
        heading={heading}
        subheading={subheading}
        description={description}
        buttons={buttons}
        image={image}
        image2={image2}
      />
    );
  }

  return null;
}
