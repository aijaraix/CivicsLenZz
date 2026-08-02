/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { civicLenzSpecs, SpecSection } from "../specsData";
import { Search, ChevronRight, FileText, Database, Shield, BookOpen } from "lucide-react";

export function SpecsViewer() {
  const [activeSpecId, setActiveSpecId] = useState<string>("spec-product");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSpecs = civicLenzSpecs.filter(
    (spec) =>
      spec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSpec = civicLenzSpecs.find((s) => s.id === activeSpecId) || civicLenzSpecs[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" id="specs-viewer-container">
      <div className="border-b border-gray-100 p-6 bg-slate-50/50">
        <div className="max-w-3xl">
          <h2 className="text-xl font-sans font-medium text-slate-900 tracking-tight" id="specs-viewer-title">
            CivicLenZ.ai Technical Blueprints & Architecture Core
          </h2>
          <p className="text-sm text-slate-500 mt-1" id="specs-viewer-desc">
            Explore specifications, database models, crawl scheduling strategies, and AI cognitive pipelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[640px]">
        {/* Left Side: Index & Search */}
        <div className="md:col-span-4 border-r border-gray-100 p-4 bg-slate-50/20 max-h-[700px] overflow-y-auto">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter blueprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              id="spec-filter-input"
            />
          </div>

          <div className="space-y-1">
            {filteredSpecs.map((spec) => {
              const isActive = spec.id === activeSpecId;
              let Icon = FileText;
              if (spec.id.includes("schema")) Icon = Database;
              if (spec.id.includes("trust")) Icon = Shield;
              if (spec.id.includes("homepage") || spec.id.includes("profile")) Icon = BookOpen;

              return (
                <button
                  key={spec.id}
                  onClick={() => setActiveSpecId(spec.id)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition duration-150 flex items-start gap-2.5 ${
                    isActive
                      ? "bg-slate-900 text-white font-medium shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  id={`btn-${spec.id}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <div className="truncate">
                    <p className="font-sans font-medium line-clamp-1">{spec.title}</p>
                    <p className={`line-clamp-1 mt-0.5 ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                      {spec.subtitle}
                    </p>
                  </div>
                  <ChevronRight className={`ml-auto h-3.5 w-3.5 shrink-0 self-center ${isActive ? "text-slate-200" : "text-slate-300"}`} />
                </button>
              );
            })}
            {filteredSpecs.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-8 font-sans">No matching specifications found.</p>
            )}
          </div>
        </div>

        {/* Right Side: Active Document Viewer */}
        <div className="md:col-span-8 p-6 md:p-8 max-h-[700px] overflow-y-auto bg-white">
          <div className="prose max-w-none text-slate-800 font-sans text-sm block" id="active-spec-doc">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <span className="text-2xs font-mono px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">
                Blueprint Section ID: {activeSpec.id}
              </span>
              <h3 className="text-2xl font-sans font-medium text-slate-900 mt-2 tracking-tight">
                {activeSpec.title}
              </h3>
              <p className="text-xs text-indigo-600 font-medium font-sans mt-0.5 uppercase tracking-wide">
                {activeSpec.subtitle}
              </p>
            </div>

            {/* Render the Markdown beautifully */}
            <div className="space-y-4 leading-relaxed font-sans text-slate-700" id="spec-markdown-body">
              {activeSpec.content.split("\n\n").map((block, bIdx) => {
                const trimmed = block.trim();
                if (trimmed.startsWith("###")) {
                  return (
                    <h4 key={bIdx} className="text-md font-sans font-medium text-slate-900 mt-6 mb-2 border-b border-gray-50 pb-1">
                      {trimmed.replace("###", "").trim()}
                    </h4>
                  );
                }
                if (trimmed.startsWith("####")) {
                  return (
                    <h5 key={bIdx} className="text-sm font-sans font-medium text-slate-800 mt-4 mb-1">
                      {trimmed.replace("####", "").trim()}
                    </h5>
                  );
                }
                if (trimmed.startsWith("- **") || trimmed.startsWith("- `") || trimmed.startsWith("-")) {
                  const listItems = trimmed.split("\n");
                  return (
                    <ul key={bIdx} className="list-disc pl-5 space-y-1 text-xs text-slate-600 ml-1">
                      {listItems.map((item, iIdx) => {
                        const cleanItem = item.replace(/^-\s*/, "").trim();
                        return <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineCode(cleanItem) }} />;
                      })}
                    </ul>
                  );
                }
                if (trimmed.startsWith("1. **") || trimmed.startsWith("1.")) {
                  const listItems = trimmed.split("\n");
                  return (
                    <ol key={bIdx} className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 ml-1">
                      {listItems.map((item, iIdx) => {
                        const cleanItem = item.replace(/^\d+\.\s*/, "").trim();
                        return <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineCode(cleanItem) }} />;
                      })}
                    </ol>
                  );
                }
                if (trimmed.startsWith("`") || trimmed.startsWith("```")) {
                  const codeLines = trimmed.split("\n").filter(l => !l.startsWith("```"));
                  return (
                    <pre key={bIdx} className="font-mono text-2xs bg-slate-950 text-slate-200 p-4 rounded-lg overflow-x-auto border border-slate-800">
                      <code>{codeLines.join("\n")}</code>
                    </pre>
                  );
                }
                return (
                  <p
                    key={bIdx}
                    className="text-xs text-slate-600 leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{ __html: formatInlineCode(trimmed) }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple helper to replace markdown links and bold inline styles for display
function formatInlineCode(text: string): string {
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/`(.*?)`/g, "<code class='font-mono text-slate-800 bg-slate-100 font-semibold px-1 py-0.2 rounded'>$1</code>"); // inline code

  return formatted;
}
