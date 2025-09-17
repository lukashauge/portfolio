import React from 'react'
import { FaCode, FaStar } from 'react-icons/fa6';
import { FaPaintBrush } from 'react-icons/fa';

import defaultImage from '../assets/default-image.png'

import useInView from '../scripts/useInView';
import useWindowWidth from '../scripts/useWindowDimensions';

export default function AboutMe(props: {children?: React.ReactNode}) {

    const windowWidth = useWindowWidth().w;
    const threshold = 1150;
    const vertView: boolean = windowWidth<threshold;
    const attributesInView = useInView();
    const whoAmIInView = useInView();

    const {children} = props;
    const iconStyle = {fontSize: "4em", marginInline: "15px", transform: "translateY(-0.4rem)", minWidth: "30px", maxWidth: "40px"};
    const personalAttributes = [
        {
            icon: <FaPaintBrush style={iconStyle}/>,
            title: "Designer",
            description: `I don't just build things, I think about how people will use them. My projects balance ease of 
            use with appealing visuals, strengthened through user feedback and design iteration. My additional background in digital art, sound engineering, 
            and UI/UX are why I bring that extra flavor to each project: whether a game, app, or website like this!`,
            backgroundImage: defaultImage
        },
        {
            icon: <FaCode style={iconStyle}/>,
            title: "Programmer",
            description: `Java, Python, C#, C++, TypeScript, with more to come! My focus isn’t just on learning tools or syntax, 
            but on using them to build real projects that live outside the classroom. What makes those projects successful 
            is how I structure them: writing clean, scalable code that holds up as complexity grows.`,
            backgroundImage: defaultImage
        },
        {
            icon: <FaStar style={iconStyle}/>,
            title: "Team Player",
            description: `I'm comfortable leading and following, depending on what the team needs. I’ve managed a 35-person team to build a 
            game I couldn’t have created alone. I take initiative when decisions need to be made, but I also advocate for my team 
            to ensure what we build reflects everyone’s vision.`,
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
                            <span key={index} className="personal-attribute" style={{ maxWidth: vertView?"80%":"30%", gap: "0%", minHeight: "150px", alignSelf: vertView?"center":"", backgroundImage: `url(${entry.backgroundImage}`}}>
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
