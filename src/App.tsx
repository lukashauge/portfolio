import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRef } from 'react'

import ProjectList from './Components/ProjectList.tsx'
import Project from './Components/Project.tsx'
import SiteHeader from './Components/SiteHeader.tsx'
import Navbar from './Components/Navbar.tsx'
import AboutMe from './Components/AboutMe.tsx'
import MinesweeperMain from './Components/minesweeper/MinesweeperMain.tsx'
import Footer from './Components/Footer.tsx'

import bannerImage from './assets/banner.jpg'
import miloImage from './assets/milo-capsule.png'
import vbImage from './assets/vb-capsule.png'
import siteImage from './assets/site-code.png'

// ICONS
import { FaItchIo, FaCode } from "react-icons/fa6";
import { FaLinkedin } from 'react-icons/fa6'
import { IoGameController } from 'react-icons/io5'

function refYCoordinate(ref: React.RefObject<HTMLElement> | React.RefObject<null>): number {
  if (!ref.current) return 0;
  return ref.current.offsetTop;
}

function App() {

  const projectRef = useRef<HTMLHeadingElement>(null);
  const gameRef = useRef<HTMLHeadingElement>(null);

  return (
    <>
      <BrowserRouter>

      <Navbar>
        <a className="google-sans-code gradient-button" onClick={() => window.scroll({top:0, left:0, behavior: "smooth"})}>TOP</a>
        <a className="google-sans-code gradient-button" onClick={() => window.scroll({top:refYCoordinate(projectRef)-100, left:0, behavior: "smooth"})}>PROJECTS</a>
        <a className="google-sans-code gradient-button" onClick={() => window.scroll({top:refYCoordinate(gameRef)-100, left:0, behavior: "smooth"})}>GAME</a>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      </BrowserRouter>
    </>
  )

  
function Home() {

  const bannerInfoImg = {image: bannerImage, alt: "Lukas and a few friends holding prize money awarded to Vision Board"};
  const miloInfoImg = {image: miloImage, alt: "the cover image for the game The Brilliant Detective Milo"};
  const siteInfoImg = {image: siteImage, alt: "a code snippet from this website"};
  const vbInfoImg = {image: vbImage, alt: "the cover image for the Vision Board title named Tic-Tac-Toe X-treme-O"};

  return (
    <>
      <SiteHeader imgInfo={bannerInfoImg}/>

      <AboutMe>
        <h2 style={{textAlign: "left"}}>More About Me</h2>
        <p style={{textAlign:"justify"}}>I'm a third year student at UCI. I speak English, Danish, and Japanese.
          I'm active in my university's video game development club as a UX/UI officer! I produce music, animate,
          and draw TONS of art! I combine my creativity with my affinity for programming to bring games to life. 
          Since developing Spigot plugins using Java in high school, I've known software/games engineering would be
          the perfect playground for me to express myself and sharpen my problem-solving brain.
        </p>
      </AboutMe>
      
      <h1 ref={projectRef} style={{fontSize: "min(5rem, 7.5vw)", lineHeight: "min(4rem, 8vw)"}}>Here are some<br/>projects I've created!</h1>
      <ProjectList>
        <Project title="The Brilliant Detective Milo" imgInfo={miloInfoImg} flipText={false} aspectRatio={0.7}>
            <h2 className="merriweather" style={{textAlign: "left", lineHeight: "2rem"}}>Executive Creative & Technical Director</h2>
            <p>
              A narrative-driven cat detective game set some time during the 20th century in a city rattled by the resurgence of mysterious murders.
              As head detective of the Mew York Police Department, it is your duty to put a stop to these killings and exhume the secrets buried deep
              in the shadows of the city… 
            </p>
            <p>
              This is a project I wore many hats for! Originally pitched to VGDC @ UCI, this game is the product of 35 creative people working together for a year and a half.
              As the team lead, I handled department meetings and project management. If a team member got sick, I found ways to account for their deliverables.
              I created a large chunk of the artwork (including the Steam library capsule you see), composed music, animated characters, and designed & implemented the C# system architecture all while keeping the
              six departments motivated.
            </p>
            <p>
              After producing an animated trailer, The Brilliant Detective Milo is now available for wishlist on Steam! It will be ready to play once I draw
              the rest of the game's comic cutscenes and add some final polish. Get a feel for the game by clicking the button below!
            </p>
            <button className="fancy-button google-sans-code" style={{ 
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px", 
              width: "80%",
              height: "70px",
              alignSelf: "center"}}
              onClick={() => open("https://store.steampowered.com/app/3151680/")}>
                <IoGameController style={{fontSize: "20px"}}/>
                <p>CHECK IT OUT</p>
            </button>
          </Project>
        <Project title="Vision Board" imgInfo={vbInfoImg} flipText={true} aspectRatio={1.2}>
          <h2 className="merriweather" style={{textAlign: "left", lineHeight: "2rem"}}>Software Developer & Systems Engineer</h2>
            <p>
              Vision Board is a concept for a technology that merges physical board games with the digital medium of video games.
              This team was small: only 4 people. Our tech is able to read game information off a board game and relay special effects
              onto a screen with nothing more than a phone/webcam and a laptop. No magnets, no sensors, just a camera! And it's all thanks
              to the power of our custom-trained AI model & piece classification algorithm. It's so efficient, it can run on practically any machine.
            </p>
              <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "10px"}}>
                <FaLinkedin style={{fontSize: "1.75rem", fill: "#0077B5"}} />
                <a className="cascadia-code" href="https://www.linkedin.com/feed/update/urn:li:activity:7338406029778481152/" target="_blank" 
                  style={{textDecoration:'underline', fontSize:"min(1.3rem, 3vw)", textAlign: "center"}}>
                  Click to see it in action!
                </a>
              </div>
            <p>
              I was the main gameplay programmer & systems developer for the Unity side of the project, in addition to working with UDP networking and protocol design.
              After presenting our project at the 2025 Beall-Butterworth competition, we won $3500 in funding to continue growing our concept into what could
              become a refreshing novelty in the board games industry.
            </p>
            <span className="adaptive-flex" style={{display: "flex", gap: "20px"}}>
              <button className="fancy-button google-sans-code" style={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px", 
                width: "80%",
                height: "70px",
                alignSelf: "center"}}
                onClick={() => open("https://github.com/r-adaR/vision-board-mvp")}>
                  <FaCode style={{fontSize: "20px"}}/>
                  <p>SEE THE CODE ON GITHUB</p>
              </button>
              <button className="fancy-button google-sans-code" style={{ 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px", 
                width: "80%",
                height: "70px",
                alignSelf: "center"}}
                onClick={() => open("https://lukashauge.itch.io/tictactoe-xtremeo")}>
                  <FaItchIo style={{fontSize: "20px"}}/>
                  <p>DOWNLOAD ON ITCH.IO</p>
              </button>
            </span>
        </Project>
        <Project title="This Website!" imgInfo={siteInfoImg} flipText={false} aspectRatio={1.3}>
            <h2 className="merriweather" style={{textAlign: "left", lineHeight: "2rem"}}>Solo Developer</h2>
            <p>
              Wow, very meta... Talking about my portfolio site, on my portfolio site!
            </p>
            <p>
              This site was made as a definitive place to document all of my projects. It's made with React and TypeScript, featuring
              dynamic routing, interactive components, custom hooks, and a customized responsive layout. You may even find with the use of state management & event handling,
              there's a little game at the bottom you can play too! :)
            </p>
            <p>
              As I create more, this site will be updated with additional sections & features.
            </p>
        </Project>
      </ProjectList>

      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h1 ref={gameRef} style={{marginBlock: "20px", marginInline:"0px", paddingBottom:"0px", paddingBlock:"10px"}}>You've made it to the end!</h1>
        <p style={{fontSize:"min(1.4rem, 3vw)", width: "min(800px, 80%)", textAlign: "justify", justifySelf: "center", paddingBottom:"min(10px, 3vw)"}}>
          Feel free to play this <strong style={{color: "var(--color1)"}}>minesweeper</strong> I made. I'll be working on my next project in the meantime, I promise it'll be worth the wait! :)
        </p>
      </div>

      <p style={{marginBottom: "40px"}}>
        <a href="https://minesweepergame.com/strategy/how-to-play-minesweeper.php" target="_blank" style={{textDecoration:'underline', fontSize:"1.5rem"}}>How to Play</a>
      </p>
      <MinesweeperMain/>
      <Footer/>
    </>
  )
}

}

export default App
