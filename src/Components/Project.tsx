import React from 'react'
import useInView from '../scripts/useInView';
import useWindowWidth from '../scripts/useWindowWidth';

export default function Project(props: {
  children: React.ReactNode,
  title: string,
  flipText?: boolean,
  imgInfo: {image: string, alt: string}
}) {

  const {children, title, flipText = false, imgInfo} = props;

  // used to reformat the layout when the window width changes
  const windowWidth = useWindowWidth();
  const reformatThreshold = 950;
  const vertView: boolean = windowWidth<reformatThreshold;

  // used to perform events once an element comes into view
  const {inViewRef, inView} = useInView();


  // sections
  const titleSection = (
      <div className="project-title">
        <img src={imgInfo.image} alt={imgInfo.alt} style={{objectFit: "cover", aspectRatio: 1/1}}/>
      </div>
      );
  const descriptionSection = (<div className="project-description">
        <h2 className="funnel-sans" style={{
          textAlign: "left",
          maxWidth: "80%",
          marginBlock: "20px",
          fontSize: (vertView?"6":"4")+"vw",
          lineHeight: (vertView?"5":"3.5")+"vw",
          color: "var(--color1)"}}>{title}</h2>
        {children}
      </div>)


  // JSX elements
  return (
    <div className="project-container" ref={inViewRef} style={{
      transform: inView ? ("translate(0px)") : "translate"+(vertView?"Y":"X")+"("+(flipText&&!vertView?"-":"")+"100px)",
      opacity: inView ? 1 : 0
    }}>

      {
      !flipText || windowWidth<reformatThreshold ?
      (<>{titleSection}{descriptionSection}</>)
      :
      (<>{descriptionSection}{titleSection}</>)
      }

    </div>
  )

}
