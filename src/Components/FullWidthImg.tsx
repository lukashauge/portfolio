import { isVertView } from '../scripts/useWindowDimensions';
import useParallaxRef from '../scripts/useParallaxRef';

export default function FullWidthImg(props: {
  children?: React.ReactNode, 
  imgInfo: {image: string, alt: string}, 
  parallaxParams?: {anchor: number, speed: number}
}) {

  const {children, imgInfo, parallaxParams = null} = props;

  const vertView: boolean = isVertView();
  const parallaxRef = parallaxParams?useParallaxRef(parallaxParams):null;

  return (
    <div className="banner" style={{height: vertView?"100vh":"50vh"}}>
        <img ref={parallaxRef} src={imgInfo.image} alt={imgInfo.alt}/>
        {children}
    </div>
  )
}
