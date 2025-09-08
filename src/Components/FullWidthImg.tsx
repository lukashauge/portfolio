import React from 'react'

export default function FullWidthImg(props: {children?: React.ReactNode, imgInfo: {image: string, alt: string}}) {

    const {children, imgInfo} = props;

  return (
    <div className="banner">
        <img src={imgInfo.image} alt={imgInfo.alt}/>
        {children}
    </div>
  )
}
