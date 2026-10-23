// Password form shown in place of the Streaming page until the visitor logs in.
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useStreamAuth } from "../../context/StreamAuthContext";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

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
    <div className="flex h-full items-center justify-center px-(--gutter)">
      <Card variant="paper" padding="md" className="w-full max-w-sm">
        <form onSubmit={submit} className="flex flex-col gap-(--space-5)">
          <div>
            <p className="label mb-2">Restricted</p>
            <h1 className="m-0 text-3xl">
              Private <em>page</em>
            </h1>
          </div>
          <Input
            id="stream-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(false);
            }}
            error={error ? "Wrong password." : undefined}
          />
          <Button
            type="submit"
            fullWidth
            loading={pending}
            disabled={!password}
            rightIcon={<ArrowRight strokeWidth={1.5} strokeLinecap="square" />}
          >
            {pending ? "Checking" : "Unlock"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StreamLogin;
