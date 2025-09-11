import {useState, useEffect} from 'react'


export default function useWindowWidth(): number {

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [])
  return width;

}

export function isVertView(): boolean {
  const windowWidth = useWindowWidth();
  const REFORMAT_THRESHOLD = 950;
  return windowWidth<REFORMAT_THRESHOLD;
}