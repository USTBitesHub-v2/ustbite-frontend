import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { useAgentRunStore } from "@/store/agentRunStore";
import { computeLayout } from "@/agents/workflows";
import type { NodeStatus } from "@/types/agentEvents";

type Vec3 = [number, number, number];

function colorFor(status: NodeStatus): { color: string; emissive: string } {
  switch (status) {
    case "active":
      return { color: "#1e293b", emissive: "#f5a623" };
    case "done":
      return { color: "#14532d", emissive: "#16a34a" };
    case "failed":
      return { color: "#7f1d1d", emissive: "#dc2626" };
    default:
      return { color: "#1e293b", emissive: "#1b2540" };
  }
}

function Station({ position, label, status }: { position: Vec3; label: string; status: NodeStatus }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const targetScale = status === "active" ? 1.15 : 1;
    const s = THREE.MathUtils.lerp(m.scale.x, targetScale, dt * 4);
    m.scale.set(s, s, s);
    const mat = m.material as THREE.MeshStandardMaterial;
    const pulse = 1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.4;
    const target =
      status === "active" ? pulse : status === "done" ? 0.5 : status === "failed" ? 0.9 : 0.18;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, target, dt * 4);
  });
  const c = colorFor(status);
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[1.7, 1, 1.7]} />
        <meshStandardMaterial color={c.color} emissive={c.emissive} emissiveIntensity={0.2} metalness={0.35} roughness={0.45} />
      </mesh>
      <Html center position={[0, 1.35, 0]} distanceFactor={11} zIndexRange={[10, 0]}>
        <div className="px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-medium whitespace-nowrap select-none">
          {label}
        </div>
      </Html>
    </group>
  );
}

function PackageMesh({ target }: { target: Vec3 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    m.position.x = THREE.MathUtils.lerp(m.position.x, target[0], dt * 2.4);
    m.position.z = THREE.MathUtils.lerp(m.position.z, target[2], dt * 2.4);
    m.position.y = 1.25 + Math.sin(state.clock.elapsedTime * 2) * 0.12;
    m.rotation.y += dt * 1.4;
    m.rotation.x += dt * 0.6;
  });
  return (
    <mesh ref={ref} position={[target[0], 1.25, target[2]]}>
      <icosahedronGeometry args={[0.34, 0]} />
      <meshStandardMaterial color="#f5a623" emissive="#f5a623" emissiveIntensity={0.9} metalness={0.4} roughness={0.2} />
    </mesh>
  );
}

function Scene() {
  const workflow = useAgentRunStore((s) => s.workflow);
  const nodeStatus = useAgentRunStore((s) => s.nodeStatus);
  const activeNodeId = useAgentRunStore((s) => s.activeNodeId);
  const chosenRoute = useAgentRunStore((s) => s.chosenRoute);

  const layout = useMemo(() => (workflow ? computeLayout(workflow) : {}), [workflow]);

  if (!workflow) return null;

  const lastDone = [...workflow.nodes].reverse().find((n) => nodeStatus[n.id] === "done")?.id;
  const targetId = activeNodeId ?? lastDone ?? workflow.entry;
  const target = (layout[targetId] ?? [0, 0, 0]) as Vec3;

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 12, 6]} intensity={1.1} />
      <pointLight position={[0, 7, 0]} intensity={0.7} color="#f5a623" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#070b14" metalness={0.2} roughness={0.9} />
      </mesh>

      {workflow.edges.map((e) => {
        const a = layout[e.from];
        const b = layout[e.to];
        if (!a || !b) return null;
        const highlight = e.from === "router" && e.to === chosenRoute;
        return (
          <Line
            key={`${e.from}-${e.to}`}
            points={[a, b]}
            color={highlight ? "#f5a623" : "#33425f"}
            lineWidth={highlight ? 3 : 1.5}
          />
        );
      })}

      {workflow.nodes.map((n) => (
        <Station key={n.id} position={(layout[n.id] ?? [0, 0, 0]) as Vec3} label={n.label} status={nodeStatus[n.id] ?? "idle"} />
      ))}

      <PackageMesh target={target} />

      <OrbitControls enablePan={false} minDistance={6} maxDistance={26} target={[0, 0.5, 0]} />
    </>
  );
}

export default function AgentPlayground3D() {
  const status = useAgentRunStore((s) => s.status);
  const summary = useAgentRunStore((s) => s.summary);
  const source = useAgentRunStore((s) => s.source);
  const toolEvents = useAgentRunStore((s) => s.toolEvents);

  return (
    <div className="relative h-[460px] w-full rounded-md overflow-hidden bg-[#070b14]">
      <Canvas camera={{ position: [9, 8, 13], fov: 50 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>

      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span
          className={
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold " +
            (status === "running"
              ? "bg-brand-amber text-brand-navy"
              : status === "completed"
                ? "bg-success/20 text-white"
                : status === "failed"
                  ? "bg-accent-red/30 text-white"
                  : "bg-white/10 text-white/70")
          }
        >
          <span className="size-1.5 rounded-full bg-current" />
          {status === "idle" ? "Idle" : `${source ?? ""} · ${status}`}
        </span>
      </div>

      {summary && (
        <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-md bg-black/60 text-white text-xs">
          {summary}
        </div>
      )}

      {!summary && toolEvents.length > 0 && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {toolEvents.slice(-5).map((t) => (
            <span key={t.id} className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[11px] font-mono">
              {t.tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
