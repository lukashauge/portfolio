import React from 'react'
import {useEffect, useState, useRef} from 'react'


function useWindowWidth(): number {

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [])
  return width;

}

function useInView(threshold: number = 0.2) {

  const inViewRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect( () => {

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {setInView(true); console.log("hi");}
    }, {threshold});

    if (inViewRef.current) observer.observe(inViewRef.current);
    return () => {if (inViewRef.current) observer.unobserve(inViewRef.current);}

  }, [threshold]);

  return {inViewRef, inView};

}


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
        <h2 className="oswald">{title}</h2>
        <img src={imgInfo.image} alt={imgInfo.alt}/>
      </div>
      );
  const descriptionSection = (<div className="project-description">
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
