# ACADEMY AND EVOLUTION — Continuous Parser Learning & Benchmarking

The CivicsLenZz Harvester operates an autonomous adaptation loop ("The Academy") to refine parsers as government web layouts change.

---

## 1. The Autonomous Improvement Loop

```
  [FETCH SOURCE] ──► [DETECT DOM ANOMALY / ZERO RESULTS]
                             │
                             ▼
                    [ANALYZE RAW BYTES]
                             │
                             ▼
              [PROPOSE PARSER MODIFICATION]
                             │
                             ▼
                  [REGRESSION TEST SUITE]
                             │
                             ▼
                [BENCHMARK & SAFE PROMOTION]
                             │
                             ▼
                 [DEPLOY UPDATED PARSER]
```

---

## 2. Invariants for Autonomous Evolution

1. **Deterministic Execution**:
   * While LLMs (such as Gemini) can analyze HTML structure to propose new regex patterns or Cheerio CSS selectors, runtime extraction must execute via **deterministic code**.
2. **Regression Testing**:
   * Any change to a parser must run against the historical snapshot corpus in `data/snapshots/` to ensure previously parsed fields do not break.
3. **Fail-Closed on Unknown Structures**:
   * If a government site redesign causes a parser to extract 0 records, the parser must **fail closed** and emit an alert rather than silently returning an empty dataset.
4. **Versioned Adapters**:
   * Every parser maintains an explicit version string (e.g., `parser_version: "1.0.0"`). When an adapter is updated, the version increments and is recorded in the Ingest Contract payload.
