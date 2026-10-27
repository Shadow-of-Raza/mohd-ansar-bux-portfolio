import { Starfield } from "@/components/motion/Starfield";

export function SpaceBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 -z-50 h-lvh overflow-hidden bg-space"
    >
      <div className="space-nebula nebula-drift absolute inset-x-0 -top-[10%] h-[120%]" />
      <Starfield />
    </div>
  );
}
