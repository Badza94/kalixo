import { useState, useEffect } from "react";

/**
 * Custom hook to get the current window width.
 * Returns the window width as a number or undefined (for SSR).
 */
const useWindowWidth = (): number | undefined => {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler immediately to set initial width
    handleResize();

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
};

export default useWindowWidth;
