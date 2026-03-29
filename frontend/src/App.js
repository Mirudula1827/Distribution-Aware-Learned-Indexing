import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, LineChart, Line, Legend, CartesianGrid } from "recharts";

const algorithms = [
  { key: "linear", label: "Linear Search", desc: "Sequential scan" },
  { key: "binary", label: "Binary Search", desc: "Divide & conquer" },
  { key: "simple", label: "Simple Learned", desc: "ML-guided index" },
  { key: "rmi", label: "Distribution-Aware RMI", desc: "Recursive model index" },
];

function ResultCard({ algo, data, delay }) {
  return (
    <div
      style={{
        animationDelay: `${delay}ms`,
      }}
      className="result-card"
    >
      <div className="card-header">
        <span className="card-label">{algo.label}</span>
        <span className="card-desc">{algo.desc}</span>
      </div>
      <div className="card-stats">
        <div className="stat">
          <span className="stat-value">{data.index}</span>
          <span className="stat-name">index</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-value">{data.steps}</span>
          <span className="stat-name">steps</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [key, setKey] = useState("");
  const [distribution, setDistribution] = useState("uniform");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    if (key === "") return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: Number(key), distribution }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Could not reach the backend. Make sure it's running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #f7f5f2;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .dot-grid {
          position: fixed;
          pointer-events: none;
        }
        .dot-grid--tl { top: 0; left: 0; }
        .dot-grid--br { bottom: 0; right: 0; }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 48px;
        }

        .title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.6rem, 6vw, 4rem);
          font-weight: 400;
          color: #1a1816;
          letter-spacing: -0.02em;
          text-align: center;
        }

        .title span {
          color: #8a7f72;
        }

        .input-section {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .input-field, .select-field {
          background: #ffffff;
          border: 1px solid #e8e4de;
          border-radius: 12px;
          padding: 12px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: #1a1816;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }

        .input-field {
          width: 160px;
        }

        .input-field::placeholder { color: #b5afa7; }

        .input-field:focus, .select-field:focus {
          border-color: #c5bdb4;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }

        .select-wrapper {
          position: relative;
        }

        .select-wrapper::after {
          content: '▾';
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #8a7f72;
          pointer-events: none;
          font-size: 0.8rem;
        }

        .select-field {
          padding-right: 36px;
          cursor: pointer;
          width: 150px;
        }

        .run-btn {
          background: #1a1816;
          color: #f7f5f2;
          border: none;
          border-radius: 12px;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .run-btn:hover:not(:disabled) {
          background: #2e2b28;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.14);
        }

        .run-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .run-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .results-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          max-width: 480px;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .result-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          opacity: 0;
          animation: cardIn 0.45s ease forwards;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card-header {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .card-label {
          font-weight: 500;
          font-size: 0.95rem;
          color: #1a1816;
        }

        .card-desc {
          font-size: 0.78rem;
          color: #a89f96;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        .card-stats {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #1a1816;
          line-height: 1;
        }

        .stat-name {
          font-size: 0.7rem;
          color: #b5afa7;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 400;
        }

        .stat-divider {
          width: 1px;
          height: 32px;
          background: #eae6e0;
        }

        .error-msg {
          background: #fff8f6;
          border: 1px solid #f0d8d2;
          border-radius: 12px;
          padding: 14px 20px;
          color: #a05a4a;
          font-size: 0.88rem;
          max-width: 480px;
          text-align: center;
          animation: fadeUp 0.4s ease both;
        }

        .loading-dots span {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #8a7f72;
          margin: 0 2px;
          animation: bounce 0.9s ease infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        .egg-trigger {
          cursor: default;
          user-select: none;
          color: #8a7f72;
        }

        .egg-msg {
          display: none;
          font-size: 0.78rem;
          color: #a89f96;
          font-style: italic;
          font-weight: 300;
          letter-spacing: 0.01em;
          margin-top: -32px;
          animation: fadeUp 0.3s ease both;
        }

        .egg-msg.egg-visible {
          display: block;
        }

        .graph-section {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 24px 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          animation: fadeUp 0.5s ease 0.4s both;
        }

        .graph-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          color: #b5afa7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
        }

        .recharts-tooltip-wrapper .custom-tooltip {
          background: #ffffff;
          border: 1px solid #eae6e0;
          border-radius: 10px;
          padding: 8px 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: #1a1816;
        }

        .results-with-chart {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 16px;
          width: 100%;
          max-width: 820px;
          animation: fadeUp 0.5s ease both;
        }

        .results-with-chart .results-container {
          animation: none;
          flex: 0 0 auto;
          width: 360px;
        }

        .inline-chart-card {
          flex: 1;
          background: #ffffff;
          border-radius: 20px;
          padding: 22px 16px 16px 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          animation: fadeUp 0.5s ease 0.35s both;
          min-width: 0;
        }

        .inline-chart-title {
          font-size: 0.68rem;
          font-weight: 400;
          color: #b5afa7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding-left: 14px;
          margin-bottom: 14px;
        }

        .complexity-section {
          width: 100%;
          max-width: 820px;
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 28px 22px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          animation: fadeUp 0.5s ease 0.5s both;
        }

        .complexity-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 24px;
        }

        .complexity-title {
          font-size: 0.68rem;
          font-weight: 400;
          color: #b5afa7;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .complexity-subtitle {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          font-weight: 400;
          color: #1a1816;
          letter-spacing: -0.01em;
        }

        .complexity-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 18px;
        }

        .complexity-legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.75rem;
          color: #8a7f72;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        @media (max-width: 700px) {
          .results-with-chart {
            flex-direction: column;
            max-width: 480px;
          }
          .results-with-chart .results-container {
            width: 100%;
          }
          .complexity-section {
            max-width: 480px;
          }
        }
      `}</style>

      <svg className="dot-grid dot-grid--tl" aria-hidden="true" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const x = 16 + col * 20;
            const y = 16 + row * 20;
            const dist = Math.sqrt(col * col + row * row);
            const opacity = Math.max(0.05, 0.45 - dist * 0.07);
            return <circle key={`${row}-${col}`} cx={x} cy={y} r="2" fill="#8a7f72" opacity={opacity} />;
          })
        )}
      </svg>

      <svg className="dot-grid dot-grid--br" aria-hidden="true" width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const x = 16 + col * 20;
            const y = 16 + row * 20;
            const dr = 5 - row, dc = 5 - col;
            const dist = Math.sqrt(dc * dc + dr * dr);
            const opacity = Math.max(0.05, 0.45 - dist * 0.07);
            return <circle key={`${row}-${col}`} cx={x} cy={y} r="2" fill="#8a7f72" opacity={opacity} />;
          })
        )}
      </svg>

      <div className="page">
        <h1 className="title">Learned <span>Index</span><span className="egg-trigger" onClick={() => document.getElementById('egg-msg').classList.toggle('egg-visible')}>.</span></h1>
        <div id="egg-msg" className="egg-msg">bro u just clicked a dot on a search algorithm visualiser at {new Date().getHours() < 12 ? "this hour?? go touch grass 🌿" : new Date().getHours() < 18 ? "2pm?? shouldn't u be productive 💀" : "night?? log off bestie 🌙"}</div>

        <div className="input-section">
          <input
            type="number"
            className="input-field"
            placeholder="Enter key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
          />

          <div className="select-wrapper">
            <select
              className="select-field"
              value={distribution}
              onChange={(e) => setDistribution(e.target.value)}
            >
              <option value="uniform">Uniform</option>
              <option value="random">Random</option>
              <option value="skewed">Skewed</option>
            </select>
          </div>

          <button
            className="run-btn"
            onClick={handleRun}
            disabled={loading || key === ""}
          >
            {loading ? (
              <span className="loading-dots">
                <span /><span /><span />
              </span>
            ) : "Run"}
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {result && (() => {
          const barData = [
            { name: "Linear", steps: result.linear.steps },
            { name: "Binary", steps: result.binary.steps },
            { name: "Simple", steps: result.simple.steps },
            { name: "RMI",    steps: result.rmi.steps    },
          ];

          // Time complexity curves over a wide n range
          const nValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1000];
          const complexityData = nValues.map(n => ({
            n,
            "Linear O(n)":         n,
            "Binary O(log n)":     +Math.log2(n).toFixed(2),
            "Simple O(log log n)": +Math.log2(Math.log2(n)).toFixed(2),
            "RMI O(1)":            1,
          }));

          const algoColors = {
            "Linear O(n)":         "#1a1816",
            "Binary O(log n)":     "#7a7068",
            "Simple O(log log n)": "#b5afa7",
            "RMI O(1)":            "#c5bdb4",
          };

          const tooltipStyle = {
            background: "#ffffff",
            border: "1px solid #eae6e0",
            borderRadius: 10,
            padding: "8px 14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            color: "#1a1816",
          };

          return (
            <>
              {/* Side-by-side: cards + bar chart */}
              <div className="results-with-chart">
                <div className="results-container">
                  {algorithms.map((algo, i) => (
                    <ResultCard
                      key={algo.key}
                      algo={algo}
                      data={result[algo.key]}
                      delay={i * 80}
                    />
                  ))}
                </div>

                <div className="inline-chart-card">
                  <p className="inline-chart-title">Steps taken</p>
                  <ResponsiveContainer width="100%" height="100%" minHeight={220}>
                    <BarChart
                      data={barData}
                      layout="vertical"
                      barCategoryGap="22%"
                      margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                    >
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fill: "#c5bdb4" }}
                        tickCount={4}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        width={46}
                        tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fill: "#a89f96" }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.03)" }}
                        contentStyle={tooltipStyle}
                        formatter={(v) => [`${v} steps`, ""]}
                        labelFormatter={(l) => l}
                      />
                      <Bar dataKey="steps" radius={[0, 6, 6, 0]}>
                        {barData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? "#a89f96" : "#e8e4de"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time complexity section */}
              <div className="complexity-section">
                <div className="complexity-header">
                  <p className="complexity-title">Time complexity</p>
                  <p className="complexity-subtitle">How steps grow with input size <em>n</em></p>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={complexityData} margin={{ top: 8, right: 24, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="#f0ece6" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="n"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fill: "#c5bdb4" }}
                      label={{ value: "n (input size)", position: "insideBottomRight", offset: -4, fontSize: 10, fill: "#c5bdb4", fontFamily: "'DM Sans', sans-serif" }}
                    />
                    <YAxis
                      scale="log"
                      domain={[0.8, "auto"]}
                      allowDataOverflow
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fill: "#c5bdb4" }}
                      tickCount={5}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelFormatter={(v) => `n = ${v}`}
                      formatter={(v, name) => [v, name]}
                    />
                    <Line key="Linear O(n)"         type="monotone" dataKey="Linear O(n)"         stroke="#1a1816" strokeWidth={2}   dot={false} activeDot={{ r: 3 }} />
                    <Line key="Binary O(log n)"     type="monotone" dataKey="Binary O(log n)"     stroke="#7a7068" strokeWidth={1.8} dot={false} activeDot={{ r: 3 }} strokeDasharray="6 3" />
                    <Line key="Simple O(log log n)" type="monotone" dataKey="Simple O(log log n)" stroke="#b5afa7" strokeWidth={1.6} dot={false} activeDot={{ r: 3 }} strokeDasharray="3 3" />
                    <Line key="RMI O(1)"            type="monotone" dataKey="RMI O(1)"            stroke="#c5bdb4" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} strokeDasharray="1 4" strokeLinecap="round" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="complexity-legend">
                  {[
                    { name: "Linear",  label: "O(n)",          color: "#1a1816", dash: "solid" },
                    { name: "Binary",  label: "O(log n)",       color: "#7a7068", dash: "6 3" },
                    { name: "Simple",  label: "O(log log n)",   color: "#b5afa7", dash: "3 3" },
                    { name: "RMI",     label: "O(1) amortized", color: "#c5bdb4", dash: "1 4" },
                  ].map(({ name, label, color, dash }) => (
                    <div key={name} className="complexity-legend-item">
                      <svg width="20" height="10" style={{ flexShrink: 0 }}>
                        <line
                          x1="0" y1="5" x2="20" y2="5"
                          stroke={color} strokeWidth="2"
                          strokeDasharray={dash === "solid" ? undefined : dash}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span><strong style={{ color: "#1a1816", fontWeight: 500 }}>{name}</strong> — {label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}