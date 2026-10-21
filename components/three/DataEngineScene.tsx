'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function CosmicGridDust() {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, colors] = useMemo(() => {
    const count = 120
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorA = new THREE.Color('#FF5722')
    const colorB = new THREE.Color('#38BDF8')

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8

      const mixed = Math.random() > 0.5 ? colorA : colorB
      col[i * 3] = mixed.r
      col[i * 3 + 1] = mixed.g
      col[i * 3 + 2] = mixed.b
    }

    return [pos, col]
  }, [])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  )
}

function FullStackArchitectureModel() {
  const groupRef = useRef<THREE.Group>(null)
  const queryNodeRef = useRef<THREE.Mesh>(null)
  const pulseRingRef = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()
  const targetRotation = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    if (groupRef.current) {
      targetRotation.current.x = pointer.y * 0.35
      targetRotation.current.y = pointer.x * 0.45
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotation.current.x, delta * 2.5)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation.current.y, delta * 2.5)
    }

    if (queryNodeRef.current) {
      const t = state.clock.getElapsedTime() * 2.2
      queryNodeRef.current.position.y = Math.sin(t) * 0.3
      queryNodeRef.current.rotation.y += delta * 1.5
      queryNodeRef.current.rotation.x += delta * 1.0
    }

    if (pulseRingRef.current) {
      const t = state.clock.getElapsedTime() * 0.8
      pulseRingRef.current.rotation.z += delta * 0.5
      const s = 1 + Math.sin(t) * 0.06
      pulseRingRef.current.scale.set(s, s, s)
    }
  })

  // Simulated relational & vector database storage nodes in 3D orbit
  const storageNodes = useMemo(() => [
    { pos: [1.25, -0.6, 0.4] as [number, number, number], color: '#38BDF8', label: 'PostgreSQL' },
    { pos: [-1.25, -0.6, -0.3] as [number, number, number], color: '#FF7043', label: 'Neo4j' },
    { pos: [0.3, -0.85, -1.25] as [number, number, number], color: '#F43F5E', label: 'Redis' },
    { pos: [-0.65, -0.75, 1.15] as [number, number, number], color: '#10B981', label: 'Supabase' }
  ], [])

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={groupRef}>
        {/* ==================================================== */}
        {/* TIER 1: CLIENT PRESENTATION LAYER (Floating Interface) */}
        {/* ==================================================== */}
        <group position={[0, 1.15, 0]}>
          {/* Interface Screen Glass Plate */}
          <mesh rotation={[-Math.PI / 10, 0, 0]}>
            <boxGeometry args={[2.3, 0.04, 1.45]} />
            <meshPhysicalMaterial
              color="#0A162B"
              metalness={0.8}
              roughness={0.15}
              clearcoat={1.0}
              transmission={0.45}
              opacity={0.85}
              transparent
            />
          </mesh>

          {/* Wireframe UI Grid Header */}
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 10, 0, 0]}>
            <planeGeometry args={[2.2, 1.35, 12, 8]} />
            <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.3} />
          </mesh>

          {/* Active Component Pulse Node */}
          <mesh position={[0.65, 0.1, -0.3]} rotation={[-Math.PI / 10, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
            <meshStandardMaterial emissive="#FF5722" emissiveIntensity={3} color="#FF5722" />
          </mesh>
        </group>

        {/* ==================================================== */}
        {/* TIER 2: API ROUTING & STREAMING BUS (Middle Gateway) */}
        {/* ==================================================== */}
        <group position={[0, 0.22, 0]}>
          {/* Main API Gateway Core Cylinder */}
          <mesh>
            <cylinderGeometry args={[0.9, 0.9, 0.14, 32]} />
            <meshPhysicalMaterial
              color="#071224"
              metalness={0.9}
              roughness={0.2}
              clearcoat={1.0}
            />
          </mesh>

          {/* Orbiting Streaming Telemetry Rings */}
          <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.4, 0.012, 16, 100]} />
            <meshBasicMaterial color="#FF5722" transparent opacity={0.65} />
          </mesh>

          <mesh rotation={[Math.PI / 2.3, Math.PI / 5, 0]}>
            <torusGeometry args={[1.58, 0.008, 16, 100]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.4} />
          </mesh>

          {/* Traveling Query Packet */}
          <mesh ref={queryNodeRef} position={[0, 0, 0]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial emissive="#38BDF8" emissiveIntensity={2.8} color="#38BDF8" />
          </mesh>
        </group>

        {/* ==================================================== */}
        {/* TIER 3: DISTRIBUTED STORAGE & DATABASE SYSTEM ENGINE */}
        {/* ==================================================== */}
        <group position={[0, -0.9, 0]}>
          {/* Relational Database Column Disk Array */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.05, 1.05, 0.38, 32]} />
            <meshPhysicalMaterial
              color="#050B14"
              metalness={0.95}
              roughness={0.15}
              clearcoat={1.0}
            />
          </mesh>

          {/* Multi-Paradigm Database Cluster Nodes */}
          {storageNodes.map((node, i) => (
            <group key={i} position={node.pos}>
              <mesh>
                <sphereGeometry args={[0.13, 24, 24]} />
                <meshStandardMaterial emissive={node.color} emissiveIntensity={2.2} color={node.color} />
              </mesh>
              {/* Connector Vector Beam to Center Storage */}
              <line>
                <bufferGeometry attach="geometry" {...createConnectorGeometry(node.pos)} />
                <lineBasicMaterial attach="material" color={node.color} transparent opacity={0.4} />
              </line>
            </group>
          ))}
        </group>
      </group>
    </Float>
  )
}

function createConnectorGeometry(targetPos: [number, number, number]) {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2])
  ]
  const geom = new THREE.BufferGeometry().setFromPoints(points)
  return geom
}

export function DataEngineScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.2, 4.6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 6, 4]} intensity={2.2} color="#FF7043" />
        <pointLight position={[-5, -4, 3]} intensity={1.6} color="#38BDF8" />
        <pointLight position={[0, -6, -2]} intensity={0.9} color="#FFFFFF" />
        <CosmicGridDust />
        <FullStackArchitectureModel />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
