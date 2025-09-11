import FullWidthImg from './FullWidthImg.tsx'
import { isVertView } from '../scripts/useWindowWidth.tsx';
import useInView from '../scripts/useInView.tsx';

import resume from '../assets/Lukas_Hauge_Resume.pdf'

export default function SiteHeader(props: {imgInfo: {image: string, alt: string}}) {
  
    const imgInfo = props.imgInfo;
    
    const vertView: boolean = isVertView();
    const titleInView = useInView();

    return ( 
    <>
    <FullWidthImg imgInfo={imgInfo} parallaxParams={{anchor: 0, speed: 0.5}}>
      <div ref={titleInView.inViewRef} style={{
        display: "flex", flexDirection: vertView?"column":"row", alignItems: "center", justifyContent: "space-evenly",
        opacity: titleInView.inView?1:0,
        transition: "opacity 0.8s linear"
        }}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "600px", minWidth: "470px"}}>
          

          <h1 className="cascadia-code" style={{background: "black", color:"white", borderRadius: "20px", textAlign: "left", padding: "40px", lineHeight: "4rem", maxWidth: "80vw", minWidth: "355px"}}>
            This is Lukas Hauge
          </h1>


        </div>

        <div style={{display: "flex", flexDirection: "column", height:"80%", justifyContent: "space-evenly"}}>

          <button id="linked-in-button" className="fancy-button oswald" style={{width: "20rem", fontSize: "2rem", marginBlock: "10px"}} onClick={() => open("https://www.linkedin.com/in/lukas-hauge/")}>LinkedIn</button>
          <button id="resume-button" className="fancy-button oswald" style={{width: "20rem", fontSize: "2rem", marginBlock: "10px"}} onClick={() => open(resume)}>Resume</button>

        </div>
      </div>
    </FullWidthImg>
    </>
  )
}
