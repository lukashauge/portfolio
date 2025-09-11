import {useRef, useState, useEffect} from 'react'

export default function useInView(threshold: number = 0.2) {

  const inViewRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect( () => {

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, {threshold});

    if (inViewRef.current) observer.observe(inViewRef.current);
    return () => {if (inViewRef.current) observer.unobserve(inViewRef.current);}

  }, [threshold]);

  return {inViewRef, inView};

}
