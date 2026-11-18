"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload-client";
import { IMAGE_EXTENSIONS } from "@/lib/upload-rules";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onBusyChange?: (busy: boolean) => void;
  invalid?: boolean;
  /** "minimal": bold, italic, lists and links only (short homepage texts). */
  variant?: "full" | "minimal";
  ariaLabel?: string;
};

/**
 * TipTap editor for blog bodies: headings, bold, italic, lists, links, images (uploaded to
 * Vercel Blob through the shared upload logic) and blockquotes. Outputs HTML.
 */
export default function RichTextEditor({ value, onChange, onBusyChange, invalid, variant = "full", ariaLabel = "Post content" }: Props) {
  const minimal = variant === "minimal";
  const editor = useEditor({
    immediatelyRender: false, // required with SSR (Next.js)
    extensions: [
      StarterKit.configure({
        heading: minimal ? false : { levels: [2, 3, 4] },
        blockquote: minimal ? false : undefined,
        horizontalRule: minimal ? false : undefined,
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: minimal ? "Write here…" : "Write your post… Use H2 for main sections." }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `rte-content ${minimal ? "min-h-[90px]" : "min-h-[360px]"} px-4 py-3 focus:outline-none`,
        "aria-label": ariaLabel,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  return (
    <div
      className={`overflow-hidden rounded-md border bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20 ${
        invalid ? "border-red-400" : "border-slate-300"
      }`}
    >
      {editor ? <Toolbar editor={editor} onBusyChange={onBusyChange} minimal={minimal} /> : <div className="h-11 border-b border-slate-200 bg-slate-50" />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, onBusyChange, minimal }: { editor: Editor; onBusyChange?: (busy: boolean) => void; minimal?: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<number | null>(null);

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: !minimal && e.isActive("heading", { level: 2 }),
      h3: !minimal && e.isActive("heading", { level: 3 }),
      h4: !minimal && e.isActive("heading", { level: 4 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: !minimal && e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  function setLink() {
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Link URL (leave empty to remove the link)", prev || "https://");
    if (url === null) return;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
      toast.error("Links must start with https://, /, mailto: or tel:");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }

  async function insertImage(file: File | undefined) {
    if (!file) return;
    setUploading(0);
    onBusyChange?.(true);
    try {
      const img = await uploadImage(file, "blog-content", { onProgress: setUploading });
      const alt = window.prompt("Describe the image (alt text, for SEO and screen readers):", "") ?? "";
      editor
        .chain()
        .focus()
        .setImage({ src: img.url, alt: alt.trim(), ...(img.width ? { width: img.width, height: img.height } : {}) } as Parameters<
          Editor["commands"]["setImage"]
        >[0])
        .run();
      toast.success("Image added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(null);
      onBusyChange?.(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const btn = (active: boolean) =>
    `inline-flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-medium ${
      active ? "bg-blue-100 text-blue-800" : "text-slate-700 hover:bg-slate-200"
    } disabled:cursor-not-allowed disabled:opacity-40`;
  const sep = <span className="mx-1 h-5 w-px bg-slate-300" aria-hidden="true" />;

  return (
    <div
      className={`${minimal ? "" : "sticky top-14 z-10 lg:top-0"} flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5`}
      role="toolbar"
      aria-label="Formatting"
    >
      {!minimal && (
        <>
      <button type="button" className={btn(s.h2)} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
        H2
      </button>
      <button type="button" className={btn(s.h3)} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
        H3
      </button>
      <button type="button" className={btn(s.h4)} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} title="Heading 4">
        H4
      </button>
      {sep}
        </>
      )}
      <button type="button" className={`${btn(s.bold)} font-bold`} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold (Ctrl+B)">
        B
      </button>
      <button type="button" className={`${btn(s.italic)} italic`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic (Ctrl+I)">
        I
      </button>
      {sep}
      <button type="button" className={btn(s.bullet)} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bulleted list">
        • List
      </button>
      <button type="button" className={btn(s.ordered)} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
        1. List
      </button>
      {!minimal && (
        <button type="button" className={btn(s.quote)} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
          ❝ Quote
        </button>
      )}
      {sep}
      <button type="button" className={btn(s.link)} onClick={setLink} title="Add or edit link">
        🔗 Link
      </button>
      {!minimal && (
        <button type="button" className={btn(false)} onClick={() => fileRef.current?.click()} disabled={uploading !== null} title="Insert image">
          {uploading !== null ? `Uploading ${uploading}%` : "🖼 Image"}
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={IMAGE_EXTENSIONS.map((e) => `.${e}`).join(",")}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => void insertImage(e.target.files?.[0])}
      />
      {sep}
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()} disabled={!s.canUndo} title="Undo">
        ↶
      </button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()} disabled={!s.canRedo} title="Redo">
        ↷
      </button>
    </div>
  );
}
