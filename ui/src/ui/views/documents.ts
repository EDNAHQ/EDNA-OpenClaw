import { html, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { icons } from "../icons.ts";

export type DocumentsProps = {
  loading: boolean;
  error: string | null;
  fileList: string[];
  activeFile: string | null;
  content: string;
  draft: string;
  editMode: boolean;
  saving: boolean;
  onFileSelect: (name: string) => void;
  onDraftChange: (content: string) => void;
  onToggleEdit: () => void;
  onSave: () => void;
  onRefresh: () => void;
};

function renderMarkdown(raw: string): string {
  // Basic markdown rendering - converts common patterns to HTML
  let html = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Code blocks
  html = html.replace(/```[\s\S]*?\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>");
  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  // Paragraphs
  html = html.replace(/\n\n/g, "</p><p>");
  html = `<p>${html}</p>`;
  html = html.replace(/<p><\/p>/g, "");
  return html;
}

function fileIcon(name: string) {
  if (name.endsWith(".md")) return icons.fileText;
  if (name.endsWith(".json")) return icons.settings;
  if (name.endsWith(".yaml") || name.endsWith(".yml")) return icons.settings;
  return icons.fileText;
}

export function renderDocuments(props: DocumentsProps) {
  return html`
    <div class="docs-layout">
      <div class="file-sidebar">
        <div class="file-sidebar-header">Files</div>
        ${props.loading && props.fileList.length === 0
          ? html`<div class="muted" style="padding: 12px; font-size: 0.82rem;">Loading files...</div>`
          : nothing}
        ${props.fileList.map(
          (name) => html`
            <div
              class="file-item ${props.activeFile === name ? "active" : ""}"
              @click=${() => props.onFileSelect(name)}
            >
              <span style="display:flex;width:16px;height:16px;">${fileIcon(name)}</span>
              <span class="file-name">${name}</span>
            </div>
          `,
        )}
        ${props.fileList.length === 0 && !props.loading
          ? html`<div class="muted" style="padding: 12px; font-size: 0.82rem;">No files found. Select an agent in the Agents tab first.</div>`
          : nothing}
        <div class="file-divider"></div>
        <button class="action-btn" style="margin: 8px 12px;" @click=${props.onRefresh} ?disabled=${props.loading}>
          Refresh Files
        </button>
      </div>

      <div class="editor-area">
        ${props.error
          ? html`<div class="callout info" style="margin-bottom: 12px;">${props.error}</div>`
          : nothing}

        ${props.activeFile
          ? html`
              <div class="editor-toolbar">
                <div class="editor-filename">
                  ${props.activeFile}
                  ${props.editMode ? html`<span>Editing</span>` : html`<span>Preview</span>`}
                </div>
                <button
                  class="edit-toggle-btn ${props.editMode ? "editing" : ""}"
                  @click=${props.onToggleEdit}
                >
                  ${props.editMode ? html`${icons.eye} Preview` : html`${icons.edit} Edit`}
                </button>
                ${props.editMode && props.draft !== props.content
                  ? html`
                      <button class="save-btn" @click=${props.onSave} ?disabled=${props.saving}>
                        ${props.saving ? "Saving..." : "Save"}
                      </button>
                    `
                  : nothing}
              </div>

              ${props.editMode
                ? html`
                    <textarea
                      class="editor-textarea"
                      .value=${props.draft}
                      @input=${(e: InputEvent) =>
                        props.onDraftChange((e.target as HTMLTextAreaElement).value)}
                    ></textarea>
                  `
                : html`
                    <div class="md-preview">
                      ${props.content
                        ? unsafeHTML(renderMarkdown(props.content))
                        : html`
                            <div class="md-empty-hint">
                              ${icons.fileText}
                              <p>Select a file to view its contents</p>
                            </div>
                          `}
                    </div>
                  `}
            `
          : html`
              <div class="md-preview">
                <div class="md-empty-hint">
                  ${icons.fileText}
                  <p>Select a file from the sidebar to view or edit</p>
                </div>
              </div>
            `}
      </div>
    </div>
  `;
}
