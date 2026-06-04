import type { CastMember, CrewMember } from "@/lib/tmdb";

type Props = {
  credits?: { crew: CrewMember[]; cast: CastMember[] };
};

// нэрсийг "·"-ээр тусгаарлаж харуулна
function NameList({ people }: { people: { id: number; name: string }[] }) {
  return (
    <span className="text-muted-foreground">
      {people.map((p, i) => (
        <span key={p.id}>
          {p.name}
          {i < people.length - 1 && <span className="mx-1 opacity-40">·</span>}
        </span>
      ))}
    </span>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6 py-3 text-sm">
      <span className="w-20 shrink-0 font-semibold text-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function MovieCredits({ credits }: Props) {
  const director = credits?.crew?.find((p) => p.job === "Director");
  const writers = (credits?.crew ?? [])
    .filter(
      (p) => p.job === "Screenplay" || p.job === "Writer" || p.job === "Story",
    )
    .slice(0, 3);
  const stars = (credits?.cast ?? []).slice(0, 3);

  return (
    <div className="divide-y divide-border border-t border-border">
      {director && (
        <Row label="Director">
          <span className="text-muted-foreground">{director.name}</span>
        </Row>
      )}
      {writers.length > 0 && (
        <Row label="Writers">
          <NameList people={writers} />
        </Row>
      )}
      {stars.length > 0 && (
        <Row label="Stars">
          <NameList people={stars} />
        </Row>
      )}
    </div>
  );
}
