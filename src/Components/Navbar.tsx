import useWindowDimensions, { isVertView } from "../scripts/useWindowDimensions";

export default function Navbar(props: {children?: React.ReactNode}) {


  const {children} = props;

  // used to reformat the layout when the window width changes
  const vertView: boolean = isVertView();
  const hideButtons: boolean = useWindowDimensions().w<630;

  return (
    <span className="navbar" style={{justifyContent: vertView?"center":"space-between", padding: vertView?"30px":"20px"}}>
      {vertView&&!hideButtons?<></>:<strong>LUKAS HAUGE'S PORTFOLIO</strong>}
      <span>
        {!hideButtons?children:<></>}
      </span>
    </span>
  )
}
