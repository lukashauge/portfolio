import React from 'react'


export default function ProjectList(props: {
    children: React.ReactNode
}) {

  return (
    <div id="project-list">
        <h1>Here are some projects I've created!</h1>
        <div>{props.children}</div>
    </div>
  )
}
