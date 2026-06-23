"use client";

import { useRef, useState } from "react";

/** Hidden honeypot + load timestamp — include values in JSON POST body. */
export function useFormSpamFields() {
  const formStarted = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const spamFields = {
    website: honeypot,
    _formStarted: formStarted.current,
  };

  function SpamFields() {
    return (
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0 pointer-events-none"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
    );
  }

  return { spamFields, SpamFields };
}
