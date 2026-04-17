import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobCard, RoadmapStep, STAGES } from "@/lib/types";
import { aiBuildRoadmap } from "@/lib/ai";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Wand2, Loader2, FileText, Sparkles, CheckCircle2, Circle, Trash2, Calendar, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  card: JobCard | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<JobCard>) => void;
  onSetRoadmap: (id: string, steps: RoadmapStep[]) => void;
  onDelete: (id: string) => void;
}

export function CardDetailSheet({ card, onClose, onUpdate, onSetRoadmap, onDelete }: Props) {
  const [building, setBuilding] = useState(false);
  const [reflection, setReflection] = useState(card?.reflection ?? "");

  if (!card) return null;

  const activeStepIdx = (() => {
    const map: Record<string, number> = { backlog: 0, applied: 1, interviewing: 2, offer: 3, closed: 3 };
    return map[card.stage] ?? 0;
  })();

  const handleBuild = async () => {
    setBuilding(true);
    try {
      const { steps } = await aiBuildRoadmap({
        company: card.company,
        role: card.role,
        requirements: card.requirements,
        summary: card.summary,
      });
      const built: RoadmapStep[] = steps.map((s, i) => ({
        id: `${Date.now()}-${i}`,
        title: s.title,
        description: s.description,
        checklist: s.checklist.map((t, j) => ({ id: `${i}-${j}`, text: t, done: false })),
      }));
      onSetRoadmap(card.id, built);
      toast.success("Roadmap built — let's go.");
    } catch (e: any) {
      toast.error(e.message || "Failed to build roadmap");
    } finally {
      setBuilding(false);
    }
  };

  const toggleCheck = (stepId: string, itemId: string) => {
    const next = card.roadmap.map((s) =>
      s.id === stepId
        ? { ...s, checklist: s.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) }
        : s
    );
    onSetRoadmap(card.id, next);
  };

  const saveReflection = () => {
    onUpdate(card.id, { reflection });
    toast.success("Reflection saved");
  };

  return (
    <Sheet open={!!card} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="glass-strong border-l-glass-border w-full sm:max-w-xl overflow-y-auto p-0">
        <div className="p-6 border-b border-border/40 bg-gradient-to-br from-primary/15 via-transparent to-accent/10">
          <SheetHeader>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{card.company}</p>
            <SheetTitle className="font-display text-2xl text-gradient">{card.role}</SheetTitle>
          </SheetHeader>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {card.salary && <span className="inline-flex items-center gap-1 text-accent font-mono"><Briefcase className="h-3 w-3" />{card.salary}</span>}
            {card.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{card.location}</span>}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdate(card.id, { stage: s.id })}
                className={cn(
                  "text-[10px] px-2.5 py-1 rounded-full border transition-all",
                  card.stage === s.id
                    ? "bg-gradient-primary text-primary-foreground border-transparent shadow-glow"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Deadline</Label>
            <Input
              type="datetime-local"
              value={card.deadline ? new Date(card.deadline).toISOString().slice(0, 16) : ""}
              onChange={(e) => onUpdate(card.id, { deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              className="mt-1 bg-background/40 border-border/60 text-xs h-8 max-w-[240px]"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {card.summary && (
            <section>
              <h3 className="text-sm font-display font-semibold mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.summary}</p>
              {card.requirements && card.requirements.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {card.requirements.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="mt-1 h-1 w-1 rounded-full bg-accent shrink-0" />{r}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-display font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary-glow" /> Stepwise Roadmap
              </h3>
              <Button size="sm" variant="outline" onClick={handleBuild} disabled={building} className="h-7 text-xs">
                {building ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Wand2 className="h-3 w-3 mr-1" /> {card.roadmap.length ? "Regenerate" : "AI Build"}</>}
              </Button>
            </div>

            {card.roadmap.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center">
                <p className="text-xs text-muted-foreground mb-3">No roadmap yet. Let AI break this goal into actionable steps.</p>
                <Button onClick={handleBuild} disabled={building} className="bg-gradient-primary shadow-glow">
                  {building ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wand2 className="h-4 w-4 mr-2" />One-click decompose</>}
                </Button>
              </div>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />
                {card.roadmap.map((step, i) => {
                  const active = i === activeStepIdx;
                  const done = step.checklist.length > 0 && step.checklist.every((c) => c.done);
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative pb-5"
                    >
                      <div className={cn(
                        "absolute -left-[19px] top-1 h-3 w-3 rounded-full ring-4 ring-background transition-all",
                        done ? "bg-success" : active ? "bg-gradient-primary shadow-glow scale-125" : "bg-muted"
                      )} />
                      <div className={cn(
                        "rounded-xl p-3 transition-all",
                        active ? "glass flow-border" : "bg-muted/20"
                      )}>
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-sm font-semibold">{step.title}</h4>
                          {active && <span className="text-[9px] uppercase tracking-wider text-primary-glow font-mono">Now</span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                        {step.checklist.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {step.checklist.map((c) => (
                              <li key={c.id}>
                                <button
                                  onClick={() => toggleCheck(step.id, c.id)}
                                  className="w-full text-left flex items-start gap-2 text-xs hover:text-foreground transition-colors group"
                                >
                                  {c.done ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-px" />
                                  ) : (
                                    <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-px group-hover:text-foreground" />
                                  )}
                                  <span className={cn(c.done && "line-through text-muted-foreground")}>{c.text}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-sm font-display font-semibold mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Document Vault
            </h3>
            <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
              Drop the resume version used for this application
              <p className="mt-1 text-[10px] opacity-70">PDF preview · coming soon</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-display font-semibold mb-2">AI Reflection</h3>
            <Textarea
              placeholder="How did the interview feel? What questions caught you off guard?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[100px] bg-background/40 border-border/60 text-sm"
            />
            <Button size="sm" onClick={saveReflection} variant="secondary" className="mt-2">
              Save reflection
            </Button>
          </section>

          <div className="pt-4 border-t border-border/40 flex justify-between">
            <Button variant="ghost" size="sm" onClick={() => { onDelete(card.id); onClose(); }} className="text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
