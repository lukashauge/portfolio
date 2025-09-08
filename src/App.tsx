import { useState } from 'react'
import './App.css'

import ProjectList from './Components/ProjectList.tsx'
import Project from './Components/project.tsx'
import FullWidthImg from './Components/FullWidthImg.tsx'

import defaultImage from './assets/default-image.png'

function App() {

  const defaultInfo = {image: defaultImage, alt: "a placeholder image"};

  return (
    <>
    <FullWidthImg imgInfo={defaultInfo}>
      <div style={{display: "flex", height: "100%", justifyContent: "center", gap: "10%"}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: "50%"}}>
          <h1 className="cascadia-code" style={{background: "black", color:"white", borderRadius: "40px", textAlign: "left", marginInline: "0px"}}>
            This is<br/>Lukas Hauge
          </h1>
          <h2 className="roboto" style={{textAlign: "justify", lineHeight: 1, fontSize: 25}}>
            feel free to check out the amazing projects I've worked on! There's plenty to see!
          </h2>
        </div>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", gap: "5%"}}>
          <button id="linked-in-button" className="fancy-button oswald" style={{width: "20rem", fontSize: "2rem"}}>LinkedIn</button>
          <button id="resume-button" className="fancy-button oswald" style={{width: "20rem", fontSize: "2rem"}}>Resume</button>
        </div>
      </div>
    </FullWidthImg>
      <ProjectList>
        <Project title="PROJECT1" imgInfo={defaultInfo} flipText={false}>
            <h2 className="oswald">hello!</h2>
            <p className="cascadia-code">
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a
              Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
              (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics,
              very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from
              a line in section 1.10.32.
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
              1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original
              form, accompanied by English versions from the 1914 translation by H. Rackham.
            </p>
            <button className="fancy-button google-sans-code" style={{ width: "80%", alignSelf: "center"}}>CHECK IT OUT</button>
          </Project>
        <Project title="PROJECT2" imgInfo={defaultInfo} flipText={true}>
          <h2 className="oswald">hello!</h2>
            <p className="cascadia-code">
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a
              Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum"
              (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics,
              very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from
              a line in section 1.10.32.
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections
              1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original
              form, accompanied by English versions from the 1914 translation by H. Rackham.
            </p>
            <button className="fancy-button google-sans-code" style={{ width: "80%", alignSelf: "center"}}>CHECK IT OUT</button>
        </Project>
      </ProjectList>
    </>
  )
}

export default App
