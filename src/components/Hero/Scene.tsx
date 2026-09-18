import { MutableRefObject, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

export interface SceneRefs {
  pointer: MutableRefObject<{ x: number; y: number }>;
  scroll: MutableRefObject<number>;
}

/**
 * Abstract dark-chrome sculpture.
 * - studio-lit via procedural lightformers (no external HDR fetches)
 * - one restrained electric-lime strip
 * - pointer → damped rotation/parallax · scroll → recedes into depth
 */
function Sculpture({ pointer, scroll, lowPower }: SceneRefs & { lowPower: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const shell = useRef<THREE.Mesh>(null!);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = scroll.current;

    // idle float
    group.current.position.y = Math.sin(t * 0.5) * 0.08;

    // pointer influence — controlled, never aggressive
    const targetY = pointer.current.x * 0.5;
    const targetX = -pointer.current.y * 0.3;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY + t * 0.05,
      2.4,
      dt
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      2.4,
      dt
    );

    // scroll → object travels deeper into the scene
    group.current.position.z = THREE.MathUtils.lerp(0, -5.6, p);
    const s = THREE.MathUtils.lerp(1, 0.6, p);
    group.current.scale.setScalar(s);

    // slow counter-rotation of the structural shell
    shell.current.rotation.y = -t * 0.06;
    shell.current.rotation.x = t * 0.04;

    // subtle camera parallax
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      pointer.current.x * 0.4,
      2,
      dt
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      0.2 + -pointer.current.y * 0.25,
      2,
      dt
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      {/* chrome form */}
      <mesh>
        <torusKnotGeometry
          args={[1.16, 0.38, lowPower ? 110 : 260, lowPower ? 18 : 36]}
        />
        <MeshDistortMaterial
          color="#141414"
          metalness={1}
          roughness={0.14}
          distort={0.13}
          speed={lowPower ? 0.55 : 0.95}
          envMapIntensity={1.15}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </mesh>

      {/* architectural wire shell */}
      <mesh ref={shell} scale={1.65}>
        <icosahedronGeometry args={[1.32, 1]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0.1}
          color="#9a9a96"
        />
      </mesh>
    </group>
  );
}

export default function Scene({
  pointer,
  scroll,
  lowPower,
  active,
}: SceneRefs & { lowPower: boolean; active: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 7], fov: 34 }}
      dpr={lowPower ? [1, 1.4] : [1, 1.8]}
      frameloop={active ? "always" : "never"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.12} />
      <Sculpture pointer={pointer} scroll={scroll} lowPower={lowPower} />

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.42}
        scale={10}
        blur={2.8}
        far={4.2}
        color="#000000"
      />

      {/* procedural studio lighting — whites + a whisper of lime */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 5, 1]}
          scale={[9, 2, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[-5, 2, -1]}
          scale={[2, 7, 1]}
          rotation-y={Math.PI / 2}
          color="#e9edf2"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[5, 1.5, 0]}
          scale={[2, 7, 1]}
          rotation-y={-Math.PI / 2}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={0.85}
          position={[0, -3.5, 1.5]}
          scale={[5, 1.2, 1]}
          color="#c8ff3d"
        />
      </Environment>
    </Canvas>
  );
}
