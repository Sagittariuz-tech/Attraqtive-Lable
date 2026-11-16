"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { demoAccounts, useDemoAuth, type DemoRole } from "@/lib/demo-auth";

export function DemoSignIn({ allowed = "both", onSignedIn }: { allowed?: DemoRole | "both"; onSignedIn?: (role: DemoRole) => void }) {
  const [role, setRole] = useState<DemoRole>(allowed === "both" ? "customer" : allowed);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const signIn = useDemoAuth(state => state.signIn);
  const id = useId();
  const sample = demoAccounts[role];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!signIn(role, email, code)) {
      setError("Use the sample credentials for the selected account.");
      return;
    }
    setError("");
    onSignedIn?.(role);
  }

  return <div className="demo-sign-in">
    {allowed === "both" && <fieldset className="variant-group"><legend>Choose a demo account</legend>
      <div className="view-tabs">{([["customer", "Customer"], ["admin", "Boutique owner"]] as const).map(([value, label]) =>
        <button type="button" key={value} aria-pressed={role === value} onClick={() => {
          setRole(value); setEmail(""); setCode(""); setError("");
        }}>{label}</button>)}</div>
    </fieldset>}
    <p className="notice">Use the sample credentials below. This preview stores a simulated session in this tab.</p>
    <form onSubmit={submit} noValidate>
      <div className="field"><label htmlFor={id + "-email"}>Demo email</label>
        <input id={id + "-email"} type="email" autoComplete="off" value={email} onChange={event => { setEmail(event.target.value); setError(""); }} aria-invalid={!!error} /></div>
      <div className="field"><label htmlFor={id + "-code"}>Demo access code</label>
        <input id={id + "-code"} autoComplete="off" value={code} onChange={event => { setCode(event.target.value); setError(""); }} aria-invalid={!!error} /></div>
      {error && <p role="alert" className="error">{error}</p>}
      <div className="button-row">
        <button className="button button-dark" type="submit">Sign in <ArrowRight size={16} /></button>
        <button className="button button-outline" type="button" onClick={() => { setEmail(sample.email); setCode(sample.code); setError(""); }}>Use sample credentials</button>
      </div>
    </form>
    <p className="fine">{sample.email} · {sample.code}</p>
  </div>;
}
