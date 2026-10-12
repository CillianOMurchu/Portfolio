// Password form shown in place of the Streaming page until the visitor logs in.
import { Lock } from "lucide-react";
import React, { useState } from "react";
import { useStreamAuth } from "../../context/StreamAuthContext";
import { Button } from "../ui/button";

const StreamLogin: React.FC = () => {
  const { login } = useStreamAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    const ok = await login(password);
    setPending(false);
    if (!ok) {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="flex h-full items-center justify-center px-4">
      <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-3 rounded-lg border bg-card p-6">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Lock className="size-4 text-primary" aria-hidden="true" />
          Private page
        </h1>
        <label htmlFor="stream-password" className="text-sm text-muted-foreground">
          Password
        </label>
        <input
          id="stream-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(false);
          }}
          aria-invalid={error}
          aria-describedby={error ? "stream-password-error" : undefined}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive"
        />
        {error && (
          <p id="stream-password-error" role="alert" className="text-sm text-destructive">
            Wrong password.
          </p>
        )}
        <Button type="submit" disabled={pending || !password}>
          {pending ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </div>
  );
};

export default StreamLogin;
