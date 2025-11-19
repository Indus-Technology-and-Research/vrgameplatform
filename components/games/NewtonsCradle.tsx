'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

interface PendulumBallProps {
  position: [number, number, number]
  index: number
  isActive: boolean
  onRelease: () => void
}

function PendulumBall({ position, index, isActive, onRelease }: PendulumBallProps) {
  const ballRef = useRef<THREE.Mesh>(null!)
  const stringRef = useRef<THREE.Line>(null!)
  const [angle, setAngle] = useState(index === 0 ? Math.PI / 4 : 0)
  const [angularVelocity, setAngularVelocity] = useState(0)
  const length = 4

  useFrame((state, delta) => {
    if (!ballRef.current) return

    // Simple pendulum physics
    const gravity = 9.8
    const damping = 0.995

    if (isActive) {
      const acceleration = (-gravity / length) * Math.sin(angle)
      const newVelocity = (angularVelocity + acceleration * delta) * damping
      const newAngle = angle + newVelocity * delta

      setAngularVelocity(newVelocity)
      setAngle(newAngle)
    }

    // Update position based on angle
    const x = position[0] + length * Math.sin(angle)
    const y = position[1] - length * Math.cos(angle)

    ballRef.current.position.set(x, y, position[2])

    // Update string
    if (stringRef.current) {
      const points = [
        new THREE.Vector3(position[0], position[1], position[2]),
        new THREE.Vector3(x, y, position[2])
      ]
      stringRef.current.geometry.setFromPoints(points)
    }
  })

  const handleClick = () => {
    if (index === 0 || index === 4) {
      setAngle(index === 0 ? Math.PI / 4 : -Math.PI / 4)
      setAngularVelocity(0)
      onRelease()
    }
  }

  return (
    <group>
      {/* String */}
      <line ref={stringRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </line>

      {/* Ball */}
      <Sphere
        ref={ballRef}
        args={[0.5, 32, 32]}
        position={[position[0], position[1] - length, position[2]]}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={isActive ? "#3b82f6" : "#6b7280"}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
    </group>
  )
}

interface NewtonsCradleProps {
  onScoreUpdate: (score: number) => void
  onComplete: (score: number) => void
}

export default function NewtonsCradle({ onScoreUpdate, onComplete }: NewtonsCradleProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [interactions, setInteractions] = useState(0)

  const handleRelease = () => {
    setIsSimulating(true)
    const newInteractions = interactions + 1
    setInteractions(newInteractions)

    const score = newInteractions * 10
    onScoreUpdate(score)

    if (newInteractions >= 10) {
      setTimeout(() => {
        onComplete(score)
      }, 1000)
    }
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setInteractions(0)
    onScoreUpdate(0)
  }

  return (
    <div className="w-full h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Support Structure */}
        <Box position={[0, 4, 0]} args={[6, 0.3, 0.3]}>
          <meshStandardMaterial color="#333333" />
        </Box>

        {/* Pendulum Balls */}
        {[0, 1, 2, 3, 4].map((i) => (
          <PendulumBall
            key={i}
            position={[-2 + i * 1, 4, 0]}
            index={i}
            isActive={isSimulating}
            onRelease={handleRelease}
          />
        ))}

        <OrbitControls enablePan={false} enableZoom={true} maxDistance={15} minDistance={5} />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex gap-4 items-center">
          <div className="text-white text-sm">
            <span className="text-gray-400">Interactions:</span>
            <span className="ml-2 font-bold">{interactions}/10</span>
          </div>
          <button
            onClick={resetSimulation}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-xs">
        <h3 className="text-white font-bold mb-2">How to Play</h3>
        <p className="text-gray-300 text-sm">
          Click on the leftmost or rightmost ball to pull it back and release.
          Watch how momentum and energy transfer through the balls!
          Complete 10 interactions to finish.
        </p>
      </div>
    </div>
  )
}
