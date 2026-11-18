"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import ListEditor from "./ListEditor";
import RichTextEditor from "./RichTextEditor";
import { Button, Field, Input, Select, Textarea } from "./ui";
import { WHY_CHOOSE_ICONS, homepageErrors, homepageSchema, type HomepageContent } from "@/lib/homepage/schema";
import type { StoredImage } from "@/lib/upload-rules";

type Errors = Record<string, string>;

/** One collapsible card per homepage section. Only text and images are editable; layout stays fixed. */
export default function HomepageForm({ initial, fromDb }: { initial: HomepageContent; fromDb: boolean }) {
  const router = useRouter();
  const [c, setC] = useState<HomepageContent>(initial);
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(initial));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(0);
  const dirty = JSON.stringify(c) !== snapshot;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const onBusy = (b: boolean) => setBusy((n) => Math.max(0, n + (b ? 1 : -1)));
  const err = (path: string) => errors[path];
  const sectionHasError = (prefix: string) => Object.keys(errors).some((k) => k.startsWith(prefix));

  // Section updaters
  const hero = (p: Partial<HomepageContent["hero"]>) => setC((x) => ({ ...x, hero: { ...x.hero, ...p } }));
  const rp = (p: Partial<HomepageContent["rentalProducts"]>) => setC((x) => ({ ...x, rentalProducts: { ...x.rentalProducts, ...p } }));
  const wc = (p: Partial<HomepageContent["whyChoose"]>) => setC((x) => ({ ...x, whyChoose: { ...x.whyChoose, ...p } }));
  const tm = (p: Partial<HomepageContent["testimonials"]>) => setC((x) => ({ ...x, testimonials: { ...x.testimonials, ...p } }));
  const faq = (p: Partial<HomepageContent["homeFaq"]>) => setC((x) => ({ ...x, homeFaq: { ...x.homeFaq, ...p } }));

  async function save() {
    const parsed = homepageSchema.safeParse(c);
    if (!parsed.success) {
      setErrors(homepageErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/homepage/", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(c) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Errors };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        toast.error(data.error ?? "Could not save the homepage.");
        return;
      }
      setErrors({});
      setSnapshot(JSON.stringify(c));
      toast.success("Homepage saved. The website updates within a few seconds.");
      router.refresh();
    } catch {
      toast.error("Network error. Your changes are not saved yet.");
    } finally {
      setSaving(false);
    }
  }

  const img = (src: string, width = 0, height = 0): StoredImage | null => (src ? { url: src, width, height } : null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
      className="space-y-4 pb-24"
      noValidate
    >
      {!fromDb && (
        <p className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          The homepage currently shows its original built-in content. Your first save stores it in the database; from then on, edits here appear on the website.
        </p>
      )}

      {/* ---------------- Hero */}
      <Section title="Hero" open error={sectionHasError("hero")}>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <Field label="Small heading (above the title)" error={err("hero.kicker")}>
              <Input value={c.hero.kicker} onChange={(e) => hero({ kicker: e.target.value })} />
            </Field>
            <Field label="Main heading" error={err("hero.headline")}>
              <Input value={c.hero.headline} onChange={(e) => hero({ headline: e.target.value })} />
            </Field>
            <Field label="Rotating words (one per line)" error={err("hero.rotating") ?? err("hero.rotating.0")} hint="Shown one after another next to the heading.">
              <Textarea
                rows={3}
                value={c.hero.rotating.join("\n")}
                onChange={(e) => hero({ rotating: e.target.value.split("\n").map((w) => w.trimStart()) })}
                onBlur={() => hero({ rotating: c.hero.rotating.map((w) => w.trim()).filter(Boolean) })}
              />
            </Field>
            <Field label="Subheading" error={err("hero.text")}>
              <RichTextEditor variant="minimal" ariaLabel="Hero subheading" value={c.hero.text} onChange={(v) => hero({ text: v })} invalid={!!err("hero.text")} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Button 1 text" error={err("hero.primary.label")}>
                <Input value={c.hero.primary.label} onChange={(e) => hero({ primary: { ...c.hero.primary, label: e.target.value } })} />
              </Field>
              <Field label="Button 1 link" error={err("hero.primary.href")}>
                <Input value={c.hero.primary.href} onChange={(e) => hero({ primary: { ...c.hero.primary, href: e.target.value } })} placeholder="/contact/" />
              </Field>
              <Field label="Button 2 text" error={err("hero.secondary.label")}>
                <Input value={c.hero.secondary.label} onChange={(e) => hero({ secondary: { ...c.hero.secondary, label: e.target.value } })} />
              </Field>
              <Field label="Button 2 link" error={err("hero.secondary.href")}>
                <Input value={c.hero.secondary.href} onChange={(e) => hero({ secondary: { ...c.hero.secondary, href: e.target.value } })} />
              </Field>
            </div>
          </div>
          <div className="space-y-3">
            <ImageUpload
              label="Hero image"
              folder="homepage"
              aspect="3 / 2"
              value={img(c.hero.image.src, c.hero.image.width, c.hero.image.height)}
              onChange={(v) => hero({ image: { ...c.hero.image, src: v?.url ?? "", width: v?.width ?? 0, height: v?.height ?? 0 } })}
              onBusyChange={onBusy}
            />
            {err("hero.image.src") && <p className="text-sm text-red-600">{err("hero.image.src")}</p>}
            <Field label="Image alt text">
              <Input value={c.hero.image.alt} onChange={(e) => hero({ image: { ...c.hero.image, alt: e.target.value } })} />
            </Field>
          </div>
        </div>
      </Section>

      {/* ---------------- Rental products */}
      <Section title="Rental Products (carousel)" error={sectionHasError("rentalProducts")}>
        <div className="space-y-4">
          <Field label="Title" error={err("rentalProducts.title")}>
            <Input value={c.rentalProducts.title} onChange={(e) => rp({ title: e.target.value })} />
          </Field>
          <Field label="Text" error={err("rentalProducts.text")}>
            <RichTextEditor variant="minimal" ariaLabel="Rental products text" value={c.rentalProducts.text} onChange={(v) => rp({ text: v })} />
          </Field>
          <ListEditor<HomepageContent["rentalProducts"]["slides"][number]>
            items={c.rentalProducts.slides}
            onChange={(slides) => rp({ slides })}
            itemLabel={(s) => s.caption || s.alt}
            addLabel="Add slide"
            min={1}
            max={20}
            newItem={() => ({ src: "", alt: "", caption: "" })}
            renderItem={(s, update, i) => (
              <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
                <ImageUpload
                  folder="homepage"
                  aspect="424 / 252"
                  value={img(s.src, s.width, s.height)}
                  onChange={(v) => update({ src: v?.url ?? "", width: v?.width, height: v?.height })}
                  onBusyChange={onBusy}
                />
                <div className="space-y-3">
                  {err(`rentalProducts.slides.${i}.src`) && <p className="text-sm text-red-600">{err(`rentalProducts.slides.${i}.src`)}</p>}
                  <Field label="Caption">
                    <Input value={s.caption} onChange={(e) => update({ caption: e.target.value })} />
                  </Field>
                  <Field label="Alt text">
                    <Input value={s.alt} onChange={(e) => update({ alt: e.target.value })} />
                  </Field>
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* ---------------- Why choose */}
      <Section title="Why Choose Renton? (service boxes)" error={sectionHasError("whyChoose")}>
        <div className="space-y-4">
          <Field label="Title" error={err("whyChoose.title")}>
            <Input value={c.whyChoose.title} onChange={(e) => wc({ title: e.target.value })} />
          </Field>
          <Field label="Text" error={err("whyChoose.text")}>
            <RichTextEditor variant="minimal" ariaLabel="Why choose text" value={c.whyChoose.text} onChange={(v) => wc({ text: v })} />
          </Field>
          <ListEditor<HomepageContent["whyChoose"]["boxes"][number]>
            items={c.whyChoose.boxes}
            onChange={(boxes) => wc({ boxes })}
            itemLabel={(b) => b.title}
            addLabel="Add box"
            min={1}
            max={12}
            newItem={() => ({ title: "", text: "", icon: "support", iconColor: "#0081F5", bg: "#F2F9FE", iconAlt: "" })}
            renderItem={(b, update, i) => (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Title" error={err(`whyChoose.boxes.${i}.title`)}>
                    <Input value={b.title} onChange={(e) => update({ title: e.target.value })} />
                  </Field>
                  <Field label="Icon">
                    <Select value={b.icon} onChange={(e) => update({ icon: e.target.value as (typeof WHY_CHOOSE_ICONS)[number] })}>
                      {WHY_CHOOSE_ICONS.map((k) => (
                        <option key={k} value={k}>
                          {k[0].toUpperCase() + k.slice(1)}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Text" error={err(`whyChoose.boxes.${i}.text`)}>
                  <RichTextEditor variant="minimal" ariaLabel={`Box ${i + 1} text`} value={b.text} onChange={(v) => update({ text: v })} />
                </Field>
                <div className="grid gap-3 sm:grid-cols-3">
                  <ColorField label="Icon colour" value={b.iconColor} onChange={(v) => update({ iconColor: v })} error={err(`whyChoose.boxes.${i}.iconColor`)} />
                  <ColorField label="Background" value={b.bg} onChange={(v) => update({ bg: v })} error={err(`whyChoose.boxes.${i}.bg`)} />
                  <Field label="Icon description">
                    <Input value={b.iconAlt} onChange={(e) => update({ iconAlt: e.target.value })} />
                  </Field>
                </div>
              </>
            )}
          />
        </div>
      </Section>

      {/* ---------------- Testimonials */}
      <Section title="Testimonials (Our Happy Clients!)" error={sectionHasError("testimonials")}>
        <div className="space-y-4">
          <Field label="Title" error={err("testimonials.title")}>
            <Input value={c.testimonials.title} onChange={(e) => tm({ title: e.target.value })} />
          </Field>
          <ListEditor<HomepageContent["testimonials"]["items"][number]>
            items={c.testimonials.items}
            onChange={(items) => tm({ items })}
            itemLabel={(t) => t.name}
            addLabel="Add testimonial"
            max={30}
            newItem={() => ({ content: "", name: "", job: "", img: null })}
            renderItem={(t, update, i) => (
              <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                <ImageUpload
                  folder="homepage"
                  aspect="1 / 1"
                  hint="Photo (optional)"
                  value={t.img ? img(t.img.src) : null}
                  onChange={(v) => update({ img: v ? { src: v.url, alt: t.img?.alt || t.name } : null })}
                  onBusyChange={onBusy}
                />
                <div className="space-y-3">
                  <Field label="Testimonial" error={err(`testimonials.items.${i}.content`)}>
                    <Textarea rows={4} value={t.content} onChange={(e) => update({ content: e.target.value })} />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Name" error={err(`testimonials.items.${i}.name`)}>
                      <Input value={t.name} onChange={(e) => update({ name: e.target.value })} />
                    </Field>
                    <Field label="Job / role">
                      <Input value={t.job} onChange={(e) => update({ job: e.target.value })} />
                    </Field>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* ---------------- FAQ */}
      <Section title="FAQ" error={sectionHasError("homeFaq")}>
        <div className="space-y-4">
          <Field label="Title" error={err("homeFaq.title")}>
            <Input value={c.homeFaq.title} onChange={(e) => faq({ title: e.target.value })} />
          </Field>
          <Field label="Intro" error={err("homeFaq.intro")}>
            <RichTextEditor variant="minimal" ariaLabel="FAQ intro" value={c.homeFaq.intro} onChange={(v) => faq({ intro: v })} />
          </Field>
          <div className="grid gap-4 xl:grid-cols-2">
            {c.homeFaq.columns.map((col, ci) => (
              <div key={ci} className="space-y-2">
                <h3 className="text-sm font-semibold text-slate-700">{ci === 0 ? "Left column" : "Right column"}</h3>
                <ListEditor<HomepageContent["homeFaq"]["columns"][number][number]>
                  items={col}
                  onChange={(items) => faq({ columns: c.homeFaq.columns.map((x, j) => (j === ci ? items : x)) })}
                  itemLabel={(f) => f.q}
                  addLabel="Add question"
                  max={30}
                  newItem={() => ({ q: "", a: "" })}
                  renderItem={(f, update, i) => (
                    <>
                      <Field label="Question" error={err(`homeFaq.columns.${ci}.${i}.q`)}>
                        <Input value={f.q} onChange={(e) => update({ q: e.target.value })} />
                      </Field>
                      <Field label="Answer" error={err(`homeFaq.columns.${ci}.${i}.a`)}>
                        <RichTextEditor variant="minimal" ariaLabel={`Answer ${i + 1}`} value={f.a} onChange={(v) => update({ a: v })} />
                      </Field>
                    </>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:left-60">
        <div className="flex items-center justify-end gap-3">
          {busy > 0 && <span className="text-xs text-slate-500">Waiting for uploads…</span>}
          {dirty && !saving && busy === 0 && <span className="text-xs text-amber-700">Unsaved changes</span>}
          {Object.keys(errors).length > 0 && <span className="text-xs text-red-600">{Object.keys(errors).length} field(s) need attention</span>}
          <Button type="submit" loading={saving} disabled={busy > 0 || (!dirty && fromDb)}>
            Save homepage
          </Button>
        </div>
      </div>
    </form>
  );
}

function Section({ title, open, error, children }: { title: string; open?: boolean; error?: boolean; children: React.ReactNode }) {
  return (
    <details open={open || error} className="group rounded-lg border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-base font-semibold text-slate-900">
          {title}
          {error && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Needs attention</span>}
        </span>
        <span className="text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="border-t border-slate-200 p-4 sm:p-5">{children}</div>
    </details>
  );
}

function ColorField({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
  const isHex = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <Field label={label} error={error}>
      <div className="flex gap-2">
        <input
          type="color"
          value={isHex ? value : "#ffffff"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-9 w-11 shrink-0 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
          aria-label={`${label} picker`}
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}
