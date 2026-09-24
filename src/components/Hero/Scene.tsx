import { MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image } from "@react-three/drei";
import * as THREE from "three";

type Project = {
  image: string;
};

const PROJECTS: Project[] = [
  { image: "/images/projects/smilecraft/cover.png" },
  { image: "/images/projects/premium-jewellery-showroom/cover.png" },
  { image: "/images/projects/ember-spice/cover.png" },
  { image: "/images/projects/aurora-threads/cover.png" },
  { image: "/images/projects/pee-kay/cover.png" },
  { image: "/images/projects/lumiere/cover.png" },
  { image: "/images/projects/aurelia-estates/cover.png" },
];

type ProjectFrameProps = {
  project: Project;
  index: number;
  total: number;
  pointer: MutableRefObject<THREE.Vector2>;
  scroll: MutableRefObject<number>;
};

function ProjectFrame({
  project,
  index,
  total,
  pointer,
  scroll,
}: ProjectFrameProps) {
  const groupRef = useRef<THREE.Group>(null);

  const centerIndex = Math.floor(total / 2);
  const offset = index - centerIndex;
  const distance = Math.abs(offset);

  // The strip deliberately sits BELOW the hero headline.
  const targetX = offset * 3.65;
  const targetY = -2.05 + Math.sin(offset * 0.75) * 0.06;

  // Strong depth curve.
  const targetZ =
    -0.65 -
    distance * 1.05 -
    Math.pow(distance, 1.5) * 0.18;

  const targetRotationY =
    -offset * 0.22 + pointer.current.x * 0.025;

  const targetRotationX =
    0.02 + pointer.current.y * 0.018;

  const targetScale =
    offset === 0
      ? 0.82
      : Math.max(0.56, 0.74 - distance * 0.055);

  const targetOpacity =
    offset === 0
      ? 0.88
      : Math.max(0.3, 0.58 - distance * 0.065);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    const cinematicDrift =
      Math.sin(time * 0.18 + index * 0.75) * 0.025;

    const pointerX =
      pointer.current.x * (0.09 + distance * 0.012);

    const pointerY = pointer.current.y * 0.035;

    const scrollDepth = Math.min(scroll.current * 2.6, 3.2);

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX + pointerX + cinematicDrift,
      0.045,
    );

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY + pointerY,
      0.045,
    );

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ - scrollDepth,
      0.055,
    );

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05,
    );

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotationX,
      0.05,
    );

    const breathe =
      offset === 0
        ? 1 + Math.sin(time * 0.65) * 0.008
        : 1;

    const scale = targetScale * breathe;

    groupRef.current.scale.x = THREE.MathUtils.lerp(
      groupRef.current.scale.x,
      scale,
      0.045,
    );

    groupRef.current.scale.y = THREE.MathUtils.lerp(
      groupRef.current.scale.y,
      scale,
      0.045,
    );

    groupRef.current.scale.z = THREE.MathUtils.lerp(
      groupRef.current.scale.z,
      scale,
      0.045,
    );
  });

  return (
    <group ref={groupRef}>
      {/* Outer frame */}
      <mesh position={[0, 0, -0.045]}>
        <planeGeometry args={[5.42, 3.1]} />
        <meshBasicMaterial color="#050505" />
      </mesh>

      {/* Project screenshot */}
      <Image
        url={project.image}
        transparent
        opacity={targetOpacity}
        scale={[5.14, 2.84, 1]}
      />

      {/* Subtle cinematic contrast layer */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[5.14, 2.84]} />
        <meshBasicMaterial
          color="#050505"
          transparent
          opacity={offset === 0 ? 0.1 : 0.23}
          depthWrite={false}
        />
      </mesh>

      {/* Thin lime cinematic edge */}
      <mesh position={[0, 1.42, 0.045]}>
        <planeGeometry args={[5.14, 0.014]} />
        <meshBasicMaterial
          color="#d7ff5f"
          transparent
          opacity={offset === 0 ? 0.55 : 0.18}
        />
      </mesh>

      {/* Soft bottom edge */}
      <mesh position={[0, -1.42, 0.045]}>
        <planeGeometry args={[5.14, 0.01]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.09}
        />
      </mesh>
    </group>
  );
}

function FilmStrip({
  pointer,
  scroll,
  lowPower,
}: {
  pointer: MutableRefObject<THREE.Vector2>;
  scroll: MutableRefObject<number>;
  lowPower: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const mobile = viewport.width < 7;

  const projects = useMemo(
    () => (mobile ? PROJECTS.slice(1, 6) : PROJECTS),
    [mobile],
  );

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      pointer.current.x * 0.16,
      0.035,
    );

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.current.x * -0.008,
      0.035,
    );
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      scale={mobile ? 0.62 : 0.73}
    >
      {projects.map((project, index) => (
        <ProjectFrame
          key={`${project.image}-${index}`}
          project={project}
          index={index}
          total={projects.length}
          pointer={pointer}
          scroll={scroll}
        />
      ))}
    </group>
  );
}

function CameraRig({
  pointer,
}: {
  pointer: MutableRefObject<THREE.Vector2>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      pointer.current.x * 0.08,
      0.035,
    );

    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      -0.18 + pointer.current.y * 0.035,
      0.035,
    );

    camera.lookAt(0, -0.95, -1.6);
  });

  return null;
}

export default function Scene({
  pointer,
  scroll,
  lowPower = false,
}: {
  pointer: MutableRefObject<THREE.Vector2>;
  scroll: MutableRefObject<number>;
  lowPower?: boolean;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={lowPower ? [1, 1.2] : [1, 1.5]}
      camera={{
        position: [0, -0.18, 9],
        fov: 31,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <CameraRig pointer={pointer} />

      <FilmStrip
        pointer={pointer}
        scroll={scroll}
        lowPower={lowPower}
      />
    </Canvas>
  );
}
