import React from 'react'


export default function ProjectList(props: {
    children: React.ReactNode
}) {

  return (
    <div id="project-list">
        <div>{props.children}</div>
    </div>
  )
}
