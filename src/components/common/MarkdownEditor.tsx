import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

const MarkdownEditor = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  className,
}: MarkdownEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Markdown, Placeholder.configure({ placeholder })],
    content: value,
    contentType: "markdown",
    editorProps: {
      attributes: {
        ...(ariaLabel && { "aria-label": ariaLabel }),
        class: cn("markdown-editor outline-none", className),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getMarkdown()),
  });

  return <EditorContent editor={editor} />;
};

export default MarkdownEditor;
