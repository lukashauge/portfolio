import { isVertView } from "../scripts/useWindowWidth";

export default function Navbar(props: {children?: React.ReactNode}) {


  const {children} = props;

  // used to reformat the layout when the window width changes
  const vertView: boolean = isVertView();

  return (
    <span className="navbar" style={{justifyContent: vertView?"center":"space-between", padding: vertView?"30px":"20px"}}>
      {vertView?<></>:<strong>LUKAS HAUGE'S PORTFOLIO</strong>}
      <span>
        {children}
      </span>
    </span>
  )
}
