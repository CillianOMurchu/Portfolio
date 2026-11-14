import { useState } from "react";
import DemoShell from "../components/DemoShell";
import ContributionGraph from "./ContributionGraph";
import { COMMITS, type Commit } from "./constants";
import { COMMIT_CLOSED, COMMIT_HASH, COMMIT_MESSAGE, COMMIT_OPEN } from "./styles";

function CommitRow({ commit, isOpen, toggle }: { commit: Commit; isOpen: boolean; toggle: () => void }) {
  return (
    <button type="button" onClick={toggle} className={isOpen ? COMMIT_OPEN : COMMIT_CLOSED}>
      <div className="flex items-center gap-2">
        <span className={COMMIT_HASH}>{commit.hash}</span>
        <span className={COMMIT_MESSAGE}>{commit.message}</span>
        <span className="shrink-0 text-sm text-muted">{commit.ago}</span>
      </div>
      {isOpen && (
        <div className="mt-1.5 flex gap-3 font-mono text-sm">
          <span className="text-success">+{commit.additions}</span>
          <span className="text-danger">-{commit.deletions}</span>
        </div>
      )}
    </button>
  );
}

export default function GitHubDemo() {
  const [openHash, setOpenHash] = useState<string | null>(null);
  const toggleCommit = (hash: string) => setOpenHash(current => (current === hash ? null : hash));

  return (
    <DemoShell>
      <ContributionGraph />
      <div className="flex flex-col gap-1">
        {COMMITS.map(commit => (
          <CommitRow key={commit.hash} commit={commit} isOpen={openHash === commit.hash} toggle={() => toggleCommit(commit.hash)} />
        ))}
      </div>
    </DemoShell>
  );
}
