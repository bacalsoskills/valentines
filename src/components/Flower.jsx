import React from 'react'
import './Flower.css'

export default function Flower({
  variant = 1,
  size = 12, // vmin
  color = '#FF6B6B',
  speed = 0.8, // seconds
  style = {},
  className = '',
}) {
  const cssVars = {
    '--fl-speed': `${speed}s`,
    '--fl-color': color,
    '--fl-width': `${size}vmin`,
  }

  return (
    <div
      className={`flower flower--${variant} ${className}`}
      style={{ ...cssVars, ...style }}
      role="img"
      aria-label="Decorative flower"
    >
      <div className="flower_line" />

      <div className="flower_line_leaf flower_line_leaf--1" />
      <div className="flower_line_leaf flower_line_leaf--2" />

      <div className="bloom">
        <div className="petal petal--1" />
        <div className="petal petal--2" />
        <div className="petal petal--3" />
        <div className="petal petal--4" />
        <div className="center" />
      </div>
    </div>
  )
}
