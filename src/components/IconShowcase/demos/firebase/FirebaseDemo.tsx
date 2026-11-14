import { useEffect, useRef, useState } from "react";
import CodePanel from "../components/CodePanel";
import DemoShell from "../components/DemoShell";
import { FIELD_ORDER, FLASH_DURATION_MS, INITIAL_DOCUMENT, SNAPSHOT_INTERVAL_MS, type FieldKey, type UserDocument } from "./constants";
import { nextSnapshot } from "./snapshot";
import {
  CONSOLE, CONSOLE_BODY, CONSOLE_PATH, FIELD_IDLE, FIELD_KEY, FIELD_UPDATED, FIELD_VALUE, FIREBASE_COLOR,
  LISTENER_CODE, LISTENER_FN, LISTEN_OFF, LISTEN_ON, LIVE_DOT_OFF, LIVE_DOT_ON, PATH_COLLECTION, PATH_DOCUMENT,
  PATH_SEGMENT, STATUS_TONE, UPDATED_BADGE,
} from "./styles";

const formatValue = (value: string | number) => (typeof value === "string" ? `"${value}"` : value.toLocaleString());

function DocumentField({ name, document, isUpdated }: { name: FieldKey; document: UserDocument; isUpdated: boolean }) {
  const valueTone = name === "status" ? STATUS_TONE[document.status] : "";
  return (
    <div className={isUpdated ? FIELD_UPDATED : FIELD_IDLE}>
      <span className={FIELD_KEY}>{name}:</span>
      <span className={`${FIELD_VALUE} ${valueTone}`}>
        {formatValue(document[name])}
        {isUpdated && <span className={UPDATED_BADGE}>← updated</span>}
      </span>
    </div>
  );
}

export default function FirebaseDemo() {
  const [document, setDocument] = useState(INITIAL_DOCUMENT);
  const [isListening, setIsListening] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<ReadonlySet<FieldKey>>(new Set());
  const tick = useRef(0);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const receiveSnapshot = () => {
    const snapshot = nextSnapshot(document, tick.current++);
    setDocument(snapshot.document);
    setUpdatedFields(new Set(snapshot.changedFields));
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setUpdatedFields(new Set()), FLASH_DURATION_MS);
  };
  // The interval always calls the latest closure, so it sees the current document.
  const receiveSnapshotRef = useRef(receiveSnapshot);
  receiveSnapshotRef.current = receiveSnapshot;

  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => receiveSnapshotRef.current(), SNAPSHOT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <DemoShell>
      <div className={CONSOLE}>
        <div className={CONSOLE_PATH}>
          <span className={PATH_COLLECTION}>firestore</span>
          <span className="text-muted">/</span>
          <span className={PATH_SEGMENT}>users</span>
          <span className="text-muted">/</span>
          <span className={PATH_DOCUMENT}>cillian</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className={isListening ? LIVE_DOT_ON : LIVE_DOT_OFF} />
            <span className={isListening ? "text-success" : "text-muted"}>{isListening ? "live" : "off"}</span>
          </div>
        </div>
        <div className={CONSOLE_BODY}>
          {FIELD_ORDER.map(name => <DocumentField key={name} name={name} document={document} isUpdated={updatedFields.has(name)} />)}
        </div>
      </div>

      <CodePanel accent={FIREBASE_COLOR} className={LISTENER_CODE}>
        <span className={LISTENER_FN}>onSnapshot</span>
        <span className="text-muted">(docRef, (doc) {"=>"} {"{"}</span>
        <div className="ml-4 text-muted">setData(doc.<span className={PATH_SEGMENT}>data</span>())</div>
        <span className="text-muted">{"}"} )</span>
      </CodePanel>

      <button type="button" onClick={() => setIsListening(current => !current)} className={isListening ? LISTEN_ON : LISTEN_OFF}>
        {isListening ? "⏹ Unsubscribe listener" : "▶ Subscribe to document"}
      </button>
    </DemoShell>
  );
}
