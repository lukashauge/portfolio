import { useRef, useEffect } from "react";

export default function useParallaxRef(parallaxParams: {anchor: number, speed: number}): React.RefObject<HTMLImageElement | null> {
  
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
    let animationFrame: number;

    const handleScroll = () => {
      const sitePosition = window.scrollY;
      const offset = (sitePosition - parallaxParams.anchor) * parallaxParams.speed;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        if (imgRef.current) imgRef.current.style.transform = `translateY(${offset}px)`;
      })
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => {
      window.removeEventListener("scroll", handleScroll); 
      cancelAnimationFrame(animationFrame);
    }
  }, [parallaxParams]);

  return imgRef;

}
