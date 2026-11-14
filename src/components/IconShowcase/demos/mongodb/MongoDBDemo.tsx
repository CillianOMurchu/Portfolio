import { useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { DOCUMENTS, STACK_FILTERS, type ProjectDocument } from "./constants";
import {
  DOCUMENT_CLOSED, DOCUMENT_JSON, DOCUMENT_LIST, DOCUMENT_OPEN, DOCUMENT_YEAR, FILTER_OFF, FILTER_ON,
  MONGODB_COLOR, QUERY_PANEL, QUERY_TEXT, STACK_TAG, STACK_TAG_MATCH,
} from "./styles";

const queryFor = (stack: string | null) =>
  stack ? `db.projects.find({ stack: { $in: ["${stack}"] } })` : "db.projects.find({})";

const pluralise = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

interface DocumentCardProps {
  document: ProjectDocument;
  isOpen: boolean;
  activeStack: string | null;
  toggle: () => void;
}

function DocumentCard({ document, isOpen, activeStack, toggle }: DocumentCardProps) {
  return (
    <button type="button" onClick={toggle} className={isOpen ? DOCUMENT_OPEN : DOCUMENT_CLOSED}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-strong">{document.name}</span>
        <span className={DOCUMENT_YEAR}>{document.year}</span>
      </div>
      {isOpen ? (
        <pre className={DOCUMENT_JSON}>{JSON.stringify(document, null, 2)}</pre>
      ) : (
        <div className="mt-1 flex flex-wrap gap-1">
          {document.stack.map(tech => (
            <span key={tech} className={tech === activeStack ? STACK_TAG_MATCH : STACK_TAG}>{tech}</span>
          ))}
        </div>
      )}
    </button>
  );
}

export default function MongoDBDemo() {
  const [activeStack, setActiveStack] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const matches = activeStack ? DOCUMENTS.filter(doc => doc.stack.includes(activeStack)) : DOCUMENTS;
  const toggleStack = (stack: string) => setActiveStack(current => (current === stack ? null : stack));
  const toggleDocument = (id: string) => setOpenId(current => (current === id ? null : id));

  return (
    <DemoShell>
      <CodePanel accent={MONGODB_COLOR} className={QUERY_PANEL}>
        <span className="text-muted">{"> "}</span>
        <span className={QUERY_TEXT}>{queryFor(activeStack)}</span>
        <span className="text-muted"> // {pluralise(matches.length, "document")}</span>
      </CodePanel>

      <div className="flex flex-wrap gap-2">
        {STACK_FILTERS.map(stack => (
          <button key={stack} type="button" onClick={() => toggleStack(stack)} className={stack === activeStack ? FILTER_ON : FILTER_OFF}>
            {stack === activeStack && "✓ "}{stack}
          </button>
        ))}
      </div>

      <div className={DOCUMENT_LIST}>
        {matches.map(doc => (
          <DocumentCard key={doc._id} document={doc} isOpen={openId === doc._id} activeStack={activeStack} toggle={() => toggleDocument(doc._id)} />
        ))}
        {matches.length === 0 && <p className="py-4 text-center text-sm text-muted">No documents match</p>}
      </div>
    </DemoShell>
  );
}
