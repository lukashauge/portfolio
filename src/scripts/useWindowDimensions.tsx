import {useState, useEffect} from 'react'


export default function useWindowDimensions(): {w: number, h: number} {

  const [dimensions, setDimensions] = useState({w: window.innerWidth, h: window.innerHeight});
  useEffect(() => {

    const handleResize = () => setDimensions({w: window.innerWidth, h: window.innerHeight});
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [])
  return dimensions;

}

export function isVertView(): boolean {
  const windowWidth = useWindowDimensions();
  const REFORMAT_THRESHOLD = 950;
  return windowWidth.w<REFORMAT_THRESHOLD;
}