'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Text } from '@react-three/drei'
import * as THREE from 'three'

interface AtomProps {
  position: [number, number, number]
  element: string
  color: string
  scale?: number
}

function Atom({ position, element, color, scale = 1 }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.5 * scale, 32, 32]}>
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Sphere>
      <Text
        position={[0, 0.8 * scale, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {element}
      </Text>
    </group>
  )
}

interface Bond {
  start: [number, number, number]
  end: [number, number, number]
}

function BondLine({ start, end }: Bond) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" linewidth={2} />
    </line>
  )
}

interface Molecule {
  name: string
  atoms: { element: string; color: string; position: [number, number, number]; scale?: number }[]
  bonds: Bond[]
}

const molecules: { [key: string]: Molecule } = {
  water: {
    name: 'Water (H₂O)',
    atoms: [
      { element: 'O', color: '#ff0000', position: [0, 0, 0], scale: 1.2 },
      { element: 'H', color: '#ffffff', position: [-1.2, 0.8, 0] },
      { element: 'H', color: '#ffffff', position: [1.2, 0.8, 0] },
    ],
    bonds: [
      { start: [0, 0, 0], end: [-1.2, 0.8, 0] },
      { start: [0, 0, 0], end: [1.2, 0.8, 0] },
    ],
  },
  co2: {
    name: 'Carbon Dioxide (CO₂)',
    atoms: [
      { element: 'C', color: '#808080', position: [0, 0, 0] },
      { element: 'O', color: '#ff0000', position: [-1.5, 0, 0], scale: 1.2 },
      { element: 'O', color: '#ff0000', position: [1.5, 0, 0], scale: 1.2 },
    ],
    bonds: [
      { start: [0, 0, 0], end: [-1.5, 0, 0] },
      { start: [0, 0, 0], end: [1.5, 0, 0] },
    ],
  },
  methane: {
    name: 'Methane (CH₄)',
    atoms: [
      { element: 'C', color: '#808080', position: [0, 0, 0] },
      { element: 'H', color: '#ffffff', position: [1, 1, 0] },
      { element: 'H', color: '#ffffff', position: [-1, 1, 0] },
      { element: 'H', color: '#ffffff', position: [1, -1, 0] },
      { element: 'H', color: '#ffffff', position: [-1, -1, 0] },
    ],
    bonds: [
      { start: [0, 0, 0], end: [1, 1, 0] },
      { start: [0, 0, 0], end: [-1, 1, 0] },
      { start: [0, 0, 0], end: [1, -1, 0] },
      { start: [0, 0, 0], end: [-1, -1, 0] },
    ],
  },
  ammonia: {
    name: 'Ammonia (NH₃)',
    atoms: [
      { element: 'N', color: '#0000ff', position: [0, 0, 0], scale: 1.1 },
      { element: 'H', color: '#ffffff', position: [0, 1.2, 0] },
      { element: 'H', color: '#ffffff', position: [-1, -0.6, 0] },
      { element: 'H', color: '#ffffff', position: [1, -0.6, 0] },
    ],
    bonds: [
      { start: [0, 0, 0], end: [0, 1.2, 0] },
      { start: [0, 0, 0], end: [-1, -0.6, 0] },
      { start: [0, 0, 0], end: [1, -0.6, 0] },
    ],
  },
}

interface MoleculeBuilderProps {
  onScoreUpdate: (score: number) => void
  onComplete: (score: number) => void
}

export default function MoleculeBuilder({ onScoreUpdate, onComplete }: MoleculeBuilderProps) {
  const [currentMolecule, setCurrentMolecule] = useState<string>('water')
  const [viewedMolecules, setViewedMolecules] = useState<Set<string>>(new Set(['water']))

  const handleMoleculeChange = (moleculeKey: string) => {
    setCurrentMolecule(moleculeKey)
    const newViewed = new Set(viewedMolecules)
    newViewed.add(moleculeKey)
    setViewedMolecules(newViewed)

    const score = newViewed.size * 25
    onScoreUpdate(score)

    if (newViewed.size === Object.keys(molecules).length) {
      setTimeout(() => {
        onComplete(100)
      }, 1000)
    }
  }

  const molecule = molecules[currentMolecule]

  return (
    <div className="w-full h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.5} />

        {/* Render Molecule */}
        {molecule && (
          <group>
            {/* Bonds */}
            {molecule.bonds.map((bond, idx) => (
              <BondLine key={`bond-${idx}`} start={bond.start} end={bond.end} />
            ))}

            {/* Atoms */}
            {molecule.atoms.map((atom, idx) => (
              <Atom
                key={`atom-${idx}`}
                position={atom.position}
                element={atom.element}
                color={atom.color}
                scale={atom.scale}
              />
            ))}
          </group>
        )}

        <OrbitControls enablePan={false} enableZoom={true} maxDistance={15} minDistance={3} />
      </Canvas>

      {/* Molecule Selector */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="flex flex-col gap-3">
          <div className="text-center text-white font-bold">
            {molecule.name}
          </div>
          <div className="flex gap-2">
            {Object.keys(molecules).map((key) => (
              <button
                key={key}
                onClick={() => handleMoleculeChange(key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentMolecule === key
                    ? 'bg-cyan-600 text-white'
                    : viewedMolecules.has(key)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-white hover:bg-gray-500'
                }`}
              >
                {molecules[key].name.split('(')[0].trim()}
                {viewedMolecules.has(key) && ' ✓'}
              </button>
            ))}
          </div>
          <div className="text-center text-sm text-gray-300">
            Explored: {viewedMolecules.size}/{Object.keys(molecules).length} molecules
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-xs">
        <h3 className="text-white font-bold mb-2">Molecule Explorer</h3>
        <p className="text-gray-300 text-sm mb-2">
          Explore different molecular structures in 3D! Drag to rotate and scroll to zoom.
        </p>
        <div className="text-xs text-gray-400">
          <p>🔴 Red = Oxygen (O)</p>
          <p>⚪ White = Hydrogen (H)</p>
          <p>⚫ Gray = Carbon (C)</p>
          <p>🔵 Blue = Nitrogen (N)</p>
        </div>
      </div>
    </div>
  )
}
