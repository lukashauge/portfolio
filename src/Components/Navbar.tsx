import useWindowDimensions, { isVertView } from "../scripts/useWindowDimensions";

export default function Navbar(props: {children?: React.ReactNode}) {


  const {children} = props;

  // used to reformat the layout when the window width changes
  const vertView: boolean = isVertView();
  const hideButtons: boolean = useWindowDimensions().w<630;

  return (
    <div className="navbar" style={{justifyContent: vertView?"center":"space-between", paddingBlock: vertView?"30px":"20px"}}>
      {vertView&&!hideButtons?<></>:<strong style={{paddingInline:"30px"}}>LUKAS HAUGE'S PORTFOLIO</strong>}
      <span style={{paddingInline: hideButtons?"0px":"30px"}}>
        {!hideButtons?children:<></>}
      </span>
    </div>
  )
}
