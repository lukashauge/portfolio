import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import ProjectList from './Components/ProjectList.tsx'
import Project from './Components/Project.tsx'
import SiteHeader from './Components/SiteHeader.tsx'
import Navbar from './Components/Navbar.tsx'
import AboutMe from './Components/AboutMe.tsx'
import MinesweeperMain from './Components/minesweeper/MinesweeperMain.tsx'

import defaultImage from './assets/default-image.png'

// ICONS
import { FaItchIo, FaCode } from "react-icons/fa6";
import { IoGameController } from 'react-icons/io5'

function App() {
  return (
    <>
      <BrowserRouter>

      <Navbar>
        <Link className="google-sans-code gradient-button" to="/" onClick={() => window.scroll({top:0, left:0, behavior: "smooth"})}>HOME</Link>
        <Link className="google-sans-code gradient-button" to="/contact" onClick={() => window.scroll({top:0, left:0, behavior: "smooth"})}>CONTACT</Link>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      </BrowserRouter>
    </>
  )
}

function Home() {

  const defaultInfoImg = {image: defaultImage, alt: "a placeholder image"};

  return (
    <>
      <SiteHeader imgInfo={defaultInfoImg}/>
      <AboutMe>
        <h2 style={{textAlign: "left"}}>Children Test</h2>
        <p style={{textAlign:"justify"}}>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at
              Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a
              Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the
              undoubtable source.</p>
      </AboutMe>
      <h1>Here are some<br/> projects I've created!</h1>
      <ProjectList>
        <Project title="The Brilliant Detective Milo" imgInfo={defaultInfoImg} flipText={false}>
            <h2 className="merriweather" style={{textAlign: "left", lineHeight: "2rem"}}>Executive Creative & Technical Director</h2>
            <p>
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
            <button className="fancy-button google-sans-code" style={{ 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px", 
              width: "80%",
              height: "100%",
              alignSelf: "center"}}
              onClick={() => open("https://store.steampowered.com/app/3151680/")}>
                <IoGameController style={{fontSize: "20px"}}/>
                <p>CHECK IT OUT</p>
            </button>
          </Project>
        <Project title="Vision Board" imgInfo={defaultInfoImg} flipText={true}>
          <h2 className="merriweather" style={{textAlign: "left", lineHeight: "2rem"}}>Software Developer & Systems Engineer</h2>
            <p>
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
            <span style={{display: "flex", gap: "20px"}}>
              <button className="fancy-button google-sans-code" style={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px", 
                width: "80%",
                height: "100%",
                alignSelf: "center"}}
                onClick={() => open("https://github.com/r-adaR/vision-board")}>
                  <FaCode style={{fontSize: "20px"}}/>
                  <p>SEE THE CODE ON GITHUB</p>
              </button>
              <button className="fancy-button google-sans-code" style={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px", 
                width: "80%",
                height: "100%",
                alignSelf: "center"}}
                onClick={() => open("https://lukashauge.itch.io/tictactoe-xtremeo")}>
                  <FaItchIo style={{fontSize: "20px"}}/>
                  <p>DOWNLOAD ON ITCH.IO</p>
              </button>
            </span>
        </Project>
      </ProjectList>

      <h1 style={{marginBlock: "20px", marginInline:"0px", paddingBottom:"0px", maxWidth: "50%", justifySelf: "center", paddingBlock:"10px"}}>You've made it to the end!</h1>
      <p style={{fontSize:"1.4rem", maxWidth: "50%", justifySelf: "center", textAlign: "justify"}}>
        Feel free to play this <strong style={{color: "var(--color1)"}}>minesweeper</strong> I made. I'll be working on my next project in the meantime, I promise it'll be worth the wait! :)
      </p>
      <MinesweeperMain/>
    </>
  )
}

function Contact() {

  return (
    <>
      <div style={{height: "200vh"}}>contact me</div>
    </>
  )

}

export default App
