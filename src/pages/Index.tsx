import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { KanbanColumn } from "@/components/careerflow/KanbanColumn";
import { JobCardItem } from "@/components/careerflow/JobCardItem";
import { AddCardDialog } from "@/components/careerflow/AddCardDialog";
import { CardDetailSheet } from "@/components/careerflow/CardDetailSheet";
import { useCards } from "@/lib/store";
import { JobCard, STAGES, Stage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Search, Plus, Focus, Zap } from "lucide-react";
import { differenceInHours } from "date-fns";

const Index = () => {
  const { cards, addCard, updateCard, moveCard, removeCard, setRoadmap } = useCards();
  const [adding, setAdding] = useState(false);
  const [active, setActive] = useState<JobCard | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.company.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q)
    );
  }, [cards, query]);

  // Focus Mode logic — highlight cards with deadline <= 48h, dim the rest
  const { highlightedIds, dimmedIds } = useMemo(() => {
    const highlighted = new Set<string>();
    const dimmed = new Set<string>();
    if (!focusMode) return { highlightedIds: highlighted, dimmedIds: dimmed };
    const urgent = cards
      .filter((c) => c.deadline && differenceInHours(new Date(c.deadline), new Date()) <= 48 && differenceInHours(new Date(c.deadline), new Date()) >= 0)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 3);
    urgent.forEach((c) => highlighted.add(c.id));
    cards.forEach((c) => { if (!highlighted.has(c.id)) dimmed.add(c.id); });
    return { highlightedIds: highlighted, dimmedIds: dimmed };
  }, [cards, focusMode]);

  const cardsByStage = (s: Stage) => filtered.filter((c) => c.stage === s);

  const onDragStart = (e: DragStartEvent) => setDragId(String(e.active.id));
  const onDragEnd = (e: DragEndEvent) => {
    setDragId(null);
    const overId = e.over?.id;
    if (!overId) return;
    const stage = STAGES.find((s) => s.id === overId)?.id;
    if (stage) moveCard(String(e.active.id), stage);
  };

  const draggingCard = dragId ? cards.find((c) => c.id === dragId) : null;
  const stats = useMemo(() => ({
    total: cards.length,
    interviewing: cards.filter((c) => c.stage === "interviewing").length,
    offers: cards.filter((c) => c.stage === "offer").length,
  }), [cards]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow float">
              <Zap className="h-4 w-4 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-lg font-bold tracking-tight">CareerFlow</h1>
              <p className="text-[10px] text-muted-foreground">Calm in the chaos of job hunting</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 ml-3 pl-3 border-l border-border/50 text-[11px]">
            <Stat label="Tracking" value={stats.total} />
            <Stat label="Interviewing" value={stats.interviewing} accent />
            <Stat label="Offers" value={stats.offers} success />
          </div>

          <div className="relative flex-1 min-w-[160px] md:max-w-md md:mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, role, location..."
              className="pl-8 h-9 bg-background/40 border-border/60 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-lg bg-muted/30 border border-border/50 cursor-pointer">
              <Focus className={`h-3.5 w-3.5 ${focusMode ? "text-primary-glow" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">Focus</span>
              <Switch checked={focusMode} onCheckedChange={setFocusMode} />
            </label>

            <Button
              onClick={() => setAdding(true)}
              className="bg-gradient-primary hover:opacity-90 shadow-glow h-9 gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Add</span>
              <Plus className="h-3.5 w-3.5 sm:hidden" />
            </Button>
          </div>
        </div>

        {focusMode && (
          <div className="mt-3 glass rounded-2xl px-4 py-2.5 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
              <span className="font-display font-semibold">Focus Mode</span>
              <span className="text-muted-foreground">— showing only the {highlightedIds.size || 0} most urgent within 48h</span>
            </div>
            <button onClick={() => setFocusMode(false)} className="text-[11px] text-muted-foreground hover:text-foreground">Exit</button>
          </div>
        )}
      </header>

      {/* Kanban */}
      <main className="flex-1 px-4 sm:px-8 pb-8">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {STAGES.map((s) => (
              <KanbanColumn
                key={s.id}
                id={s.id}
                label={s.label}
                accent={s.accent}
                cards={cardsByStage(s.id)}
                highlightedIds={highlightedIds}
                dimmedIds={dimmedIds}
                onCardClick={(c) => setActive(c)}
              />
            ))}
          </div>
          <DragOverlay>
            {draggingCard && (
              <div className="rotate-2 opacity-90">
                <JobCardItem card={draggingCard} onClick={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>

      <AddCardDialog open={adding} onOpenChange={setAdding} onCreate={(c) => addCard(c as any)} />
      <CardDetailSheet
        card={active ? cards.find((c) => c.id === active.id) ?? null : null}
        onClose={() => setActive(null)}
        onUpdate={updateCard}
        onSetRoadmap={setRoadmap}
        onDelete={removeCard}
      />
    </div>
  );
};

function Stat({ label, value, accent, success }: { label: string; value: number; accent?: boolean; success?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className={`font-mono font-semibold ${accent ? "text-primary-glow" : success ? "text-success" : "text-foreground"}`}>{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export default Index;
