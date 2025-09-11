import React from 'react'
import { FaCode, FaStar } from 'react-icons/fa6';
import { FaPaintBrush } from 'react-icons/fa';

import defaultImage from '../assets/default-image.png'

import useInView from '../scripts/useInView';
import useWindowWidth from '../scripts/useWindowWidth';

export default function AboutMe(props: {children?: React.ReactNode}) {

    const windowWidth = useWindowWidth();
    const threshold = 1150;
    const vertView: boolean = windowWidth<threshold;
    const attributesInView = useInView();
    const whoAmIInView = useInView();

    const {children} = props;
    const iconStyle = {fontSize: "4em", marginInline: "20px", transform: "translateY(-0.4rem)", minWidth: "30px", maxWidth: "40px"};
    const personalAttributes = [
        {
            icon: <FaPaintBrush style={iconStyle}/>,
            title: "Designer",
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin",
            backgroundImage: defaultImage
        },
        {
            icon: <FaCode style={iconStyle}/>,
            title: "Programmer",
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin",
            backgroundImage: defaultImage
        },
        {
            icon: <FaStar style={iconStyle}/>,
            title: "Team Player",
            description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin",
            backgroundImage: defaultImage
        }
    ]


    return (
        <>
            <div style={{
                padding: "20px"
            }}> {/*personal attributes*/}
                <h1 ref={whoAmIInView.inViewRef} style={{marginBlock: "20px", marginInline:"0px", paddingBottom:"0px",
                    opacity: whoAmIInView.inView?1:0,
                    transition: "opacity 2s linear"
                    }}>Who am I?</h1>
                <p style={{fontSize:"1.4rem", opacity: whoAmIInView.inView?1:0, transition: "opacity 2s linear"}}>People know me as a...</p>
                <div ref={attributesInView.inViewRef} style={{
                    display: "flex", flexDirection: vertView?"column":"row", justifyContent: "center", marginInline: "0%",
                    transform: "translateY("+(attributesInView.inView?"0px)":"50px)"),
                    opacity: attributesInView.inView?1:0,
                    transition: "all 3s var(--easeOutQuint)"
                    }}>

                    {personalAttributes.map((entry: {icon: React.ReactNode | null, title: string, description: string, backgroundImage: string}, index: number) => {
                        return (
                            <span key={index} className="personal-attribute" style={{ maxWidth: vertView?"60%":"350px", gap: "0%", minHeight: "150px", backgroundImage: `url(${entry.backgroundImage}`}}>
                                {entry.icon? entry.icon : <></>}
                                <div style={{justifyItems: "left"}}>
                                    <h2 style={{textAlign: "left"}}>{entry.title}</h2>
                                    <p style={{textAlign: "left", maxWidth: "90%", minWidth: "100px"}}>{entry.description}</p>
                                </div>
                            </span>
                            );
                    })}

                </div>

                {/*summary*/}
                <div style={{display: "flex", flexDirection: vertView?"column":"row", alignItems: "center", justifyContent: "center", padding: "20px", gap: "5%", marginTop: "30px"}}>
                    {vertView?<></>:<div style={{maxWidth: vertView?"70%":"30%"}}>{children}</div>}
                    <div style={{ // outline
                        background:"linear-gradient(to bottom right, var(--color1), var(--color2))",
                        borderRadius: "50%",
                        padding: "5px",
                        display: "flex",
                        minWidth: "300px",
                        maxWidth: "400px",
                        width: "40%",
                        height: "40%", 
                        margin: "20px"
                    }}><img src={defaultImage} style={{ // image inside the outline
                        borderRadius: "50%", 
                        width: "100%",
                        height: "100%",
                        objectFit: "contain"}}/>
                    </div>
                    {vertView?<div style={{maxWidth: vertView?"70%":"30%"}}>{children}</div>:<></>}
                </div>
            </div>
        </>
    )
}
