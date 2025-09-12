import { isVertView } from "../scripts/useWindowWidth";
import useWindowWidth from "../scripts/useWindowWidth";

export default function Navbar(props: {children?: React.ReactNode}) {


  const {children} = props;

  // used to reformat the layout when the window width changes
  const vertView: boolean = isVertView();
  const hideButtons: boolean = useWindowWidth()<430;

  return (
    <span className="navbar" style={{justifyContent: vertView?"center":"space-between", padding: vertView?"30px":"20px"}}>
      {vertView&&!hideButtons?<></>:<strong>LUKAS HAUGE'S PORTFOLIO</strong>}
      <span>
        {!hideButtons?children:<></>}
      </span>
    </span>
  )
}
