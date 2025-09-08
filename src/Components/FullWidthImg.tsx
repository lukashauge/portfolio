import React from 'react'
import useWindowWidth from '../scripts/useWindowWidth';

export default function FullWidthImg(props: {children?: React.ReactNode, imgInfo: {image: string, alt: string}}) {

    const {children, imgInfo} = props;

    const windowWidth = useWindowWidth();
    const reformatThreshold = 950;
    const vertView: boolean = windowWidth<reformatThreshold;

  return (
    <div className="banner" style={{height: vertView?"100vh":"50vh"}}>
        <img src={imgInfo.image} alt={imgInfo.alt}/>
        {children}
    </div>
  )
}
