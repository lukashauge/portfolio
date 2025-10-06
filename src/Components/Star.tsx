import { PiStarFourFill } from "react-icons/pi"
import useParallaxRef from "../scripts/useParallaxRef"
import { useState } from "react"


export default function Star(props: {rightOffset: string, bottomOffset: number, z: number}) {

    const {rightOffset, bottomOffset, z} = props
    const ref = useParallaxRef({anchor: bottomOffset, speed: 1/(6*z+1) - (z/5)})

    const [randDelay] = useState(Math.random() * 2);

  return (
    <div className="star" ref={ref} style={{

        bottom: bottomOffset,
        right: rightOffset,  
        opacity: z**2 + 0.1

    }} >
    <PiStarFourFill className="twinkle" style={{color: "var(--color1)", fontSize: z*3+0.8+"rem", animationDelay: randDelay+"s"}}/>
    </div>
  )
}
