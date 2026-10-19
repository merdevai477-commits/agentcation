'use client'

import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

float wave(vec2 p, float t) {
  float a = sin(p.x * 2.4 + t * 0.7) * cos(p.y * 1.8 - t * 0.55);
  float b = sin(length(p) * 3.2 - t * 0.9);
  float c = sin((p.x + p.y) * 1.6 + t * 0.4);
  return a * 0.45 + b * 0.35 + c * 0.2;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  vec2 m = (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time;

  float n = wave(p * 0.65, t * 0.28);
  float pull = sin(length(p - m * 0.35) * 2.2 - t * 0.35) * 0.08;
  n += pull;

  vec3 ink = vec3(0.035, 0.038, 0.046);
  vec3 slate = vec3(0.075, 0.08, 0.095);
  vec3 col = mix(ink, slate, smoothstep(-0.2, 1.0, n) * 0.65);

  float vignette = smoothstep(1.15, 0.25, length(uv - 0.5));
  col *= 0.82 + vignette * 0.18;

  vec2 g = abs(fract(uv * vec2(36.0, 20.0)) - 0.5);
  float grid = smoothstep(0.492, 0.5, max(g.x, g.y));
  col += vec3(0.55) * (1.0 - grid) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function LiquidField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'u_res')
    const uTime = gl.getUniformLocation(program, 'u_time')
    const uMouse = gl.getUniformLocation(program, 'u_mouse')

    const mouse = { x: 0.62, y: 0.38, tx: 0.62, ty: 0.38 }
    const onMove = (event: PointerEvent) => {
      mouse.tx = event.clientX / window.innerWidth
      mouse.ty = 1 - event.clientY / window.innerHeight
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let frame = 0
    let running = true
    const started = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35)
      const w = Math.floor(window.innerWidth * dpr)
      const h = Math.floor(window.innerHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = (now: number) => {
      if (!running) return
      resize()
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, reduce ? 0.4 : (now - started) / 1000)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      frame = requestAnimationFrame(draw)
    }

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        frame = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    frame = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return <canvas ref={canvasRef} className="liquid-field" aria-hidden />
}
