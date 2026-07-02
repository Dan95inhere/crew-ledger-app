import React, { useState, useMemo } from "react";
import { Plus, Receipt, BarChart3, Phone, Calendar, Check, ChevronLeft, ChevronRight, Clock, Wrench, X, PhoneCall, Tags, Trash2 } from "lucide-react";

const INK = "#20291F";
const PAPER = "#E9E7DC";
const PAPER_DARK = "#DEDACB";
const AMBER = "#D98E2B";
const COPPER = "#B0563A";
const TEAL = "#2F7A5E";
const LINE = "#C9C4AE";

const todayStr = () => new Date().toISOString().slice(0, 10);
const monthKey = (d) => d.slice(0, 7);
const fmtMoney = (n) => "NT$" + Number(n).toLocaleString("zh-Hant");
const fmtMonthLabel = (key) => {
  const [y, m] = key.split("-");
  return `${y}年${Number(m)}月`;
};
const uid = () => Date.now() + Math.floor(Math.random() * 1000);

function Stub({ children }) {
  return (
    <div className="relative" style={{ background: PAPER, border: `1.5px solid ${LINE}`, borderRadius: 4 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: -1,
          height: 12,
          backgroundImage: `repeating-radial-gradient(circle at 10px 6px, transparent 0 3px, ${PAPER} 3px 20px)`,
        }}
      />
      {children}
    </div>
  );
}

function Stamp({ label, color }) {
  return (
    <span
      className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm"
      style={{ border: `1.5px solid ${color}`, color, transform: "rotate(-3deg)", fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.08em" }}
    >
      {label}
    </span>
  );
}

const inputStyle = { background: "#fff", border: `1.5px solid ${LINE}`, color: INK };

export default function CrewLedger() {
  const [tab, setTab] = useState("ledger");
  const [entryType, setEntryType] = useState("expense");

  const [catalog, setCatalog] = useState([
    { id: 1, category: "水管材料", item: "PVC 管件", unit: "支" },
    { id: 2, category: "水管材料", item: "止水閥", unit: "個" },
    { id: 3, category: "電材", item: "電線 2.0mm", unit: "捲" },
    { id: 4, category: "電材", item: "無熔絲開關", unit: "個" },
  ]);

  const [materials, setMaterials] = useState([
    { id: 1, date: todayStr(), item: "PVC 管件", amount: 1250, category: "水管材料", quantity: 10, unit: "支" },
    { id: 2, date: todayStr(), item: "電線 2.0mm", amount: 2380, category: "電材", quantity: 1, unit: "捲" },
  ]);
  const [income, setIncome] = useState([
    { id: 1, date: todayStr(), client: "陳先生 (漏水修繕)", amount: 4500, note: "含工資" },
  ]);
  const [calls, setCalls] = useState([
    { id: 1, receivedAt: todayStr(), client: "林小姐", phone: "0912-345-678", note: "浴室水龍頭漏水", status: "pending", date: "", time: "" },
    { id: 2, receivedAt: todayStr(), client: "阿興水電行", phone: "0933-222-111", note: "廚房迴路跳電", status: "scheduled", date: todayStr(), time: "14:00" },
  ]);

  const [form, setForm] = useState({ item: "", amount: "", category: "", quantity: "", unit: "", client: "", note: "" });
  const [showSuggest, setShowSuggest] = useState(false);
  const [callForm, setCallForm] = useState({ client: "", phone: "", note: "" });
  const [scheduling, setScheduling] = useState(null);
  const [statMonth, setStatMonth] = useState(monthKey(todayStr()));
  const [catalogForm, setCatalogForm] = useState({ category: "", item: "", unit: "" });

  const resetForm = () => setForm({ item: "", amount: "", category: "", quantity: "", unit: "", client: "", note: "" });

  const upsertCatalog = (category, item, unit) => {
    if (!item) return;
    setCatalog((prev) => {
      const exists = prev.some((c) => c.item === item);
      if (exists) {
        return prev.map((c) => (c.item === item ? { ...c, category: category || c.category, unit: unit || c.unit } : c));
      }
      return [...prev, { id: uid(), category: category || "其他材料", item, unit: unit || "" }];
    });
  };

  const submitEntry = () => {
    if (entryType === "expense") {
      if (!form.item || !form.amount) return;
      setMaterials((m) => [
        { id: uid(), date: todayStr(), item: form.item, amount: Number(form.amount), category: form.category || "其他材料", quantity: form.quantity ? Number(form.quantity) : "", unit: form.unit || "" },
        ...m,
      ]);
      upsertCatalog(form.category, form.item, form.unit);
    } else {
      if (!form.client || !form.amount) return;
      setIncome((i) => [{ id: uid(), date: todayStr(), client: form.client, amount: Number(form.amount), note: form.note }, ...i]);
    }
    resetForm();
  };

  const itemSuggestions = useMemo(() => {
    if (!form.item) return [];
    const q = form.item.trim();
    return catalog.filter((c) => c.item.includes(q)).slice(0, 6);
  }, [form.item, catalog]);

  const pickSuggestion = (c) => {
    setForm({ ...form, item: c.item, category: c.category, unit: c.unit });
    setShowSuggest(false);
  };

  const submitCall = () => {
    if (!callForm.client) return;
    setCalls((c) => [{ id: uid(), receivedAt: todayStr(), client: callForm.client, phone: callForm.phone, note: callForm.note, status: "pending", date: "", time: "" }, ...c]);
    setCallForm({ client: "", phone: "", note: "" });
  };

  const confirmSchedule = (id, date, time) => {
    setCalls((cs) => cs.map((c) => (c.id === id ? { ...c, date, time, status: "scheduled" } : c)));
    setScheduling(null);
  };
  const completeCall = (id) => setCalls((cs) => cs.map((c) => (c.id === id ? { ...c, status: "done" } : c)));

  const addCatalogEntry = () => {
    if (!catalogForm.item) return;
    upsertCatalog(catalogForm.category, catalogForm.item, catalogForm.unit);
    setCatalogForm({ category: "", item: "", unit: "" });
  };
  const removeCatalogEntry = (id) => setCatalog((c) => c.filter((x) => x.id !== id));

  const catalogByCategory = useMemo(() => {
    const map = {};
    catalog.forEach((c) => {
      const key = c.category || "其他材料";
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return map;
  }, [catalog]);

  const monthlyExpense = useMemo(() => materials.filter((m) => monthKey(m.date) === statMonth).reduce((s, m) => s + m.amount, 0), [materials, statMonth]);
  const monthlyIncome = useMemo(() => income.filter((i) => monthKey(i.date) === statMonth).reduce((s, i) => s + i.amount, 0), [income, statMonth]);
  const net = monthlyIncome - monthlyExpense;

  const trend = useMemo(() => {
    const keys = [];
    const base = new Date(statMonth + "-01T00:00:00");
    for (let i = 5; i >= 0; i--) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return keys.map((k) => ({
      key: k,
      label: `${Number(k.split("-")[1])}月`,
      支出: materials.filter((m) => monthKey(m.date) === k).reduce((s, m) => s + m.amount, 0),
      收入: income.filter((i) => monthKey(i.date) === k).reduce((s, i) => s + i.amount, 0),
    }));
  }, [materials, income, statMonth]);

  const maxTrend = Math.max(1, ...trend.map((t) => Math.max(t.收入, t.支出)));

  const pendingCalls = calls.filter((c) => c.status === "pending");
  const scheduledCalls = calls.filter((c) => c.status === "scheduled").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const doneCalls = calls.filter((c) => c.status === "done");

  const shiftMonth = (dir) => {
    const [y, m] = statMonth.split("-").map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setStatMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col" style={{ background: PAPER_DARK, color: INK, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .display { font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.02em; }
      `}</style>

      <div className="px-5 pt-6 pb-4" style={{ background: INK, color: PAPER }}>
        <div className="flex items-center gap-2">
          <Wrench size={20} style={{ color: AMBER }} />
          <h1 className="display text-2xl font-bold tracking-wide">工班日誌</h1>
        </div>
        <p className="text-xs mt-1 opacity-70">材料 · 收支 · 電話待辦，一本記清楚</p>
      </div>

      <div className="flex-1 px-4 py-4 pb-24 max-w-md mx-auto w-full">
        {tab === "ledger" && (
          <div>
            <div className="flex rounded-md overflow-hidden mb-4" style={{ border: `1.5px solid ${INK}` }}>
              <button onClick={() => setEntryType("expense")} className="flex-1 py-2 text-sm font-semibold display text-base" style={{ background: entryType === "expense" ? COPPER : "transparent", color: entryType === "expense" ? "#fff" : INK }}>
                進貨支出
              </button>
              <button onClick={() => setEntryType("income")} className="flex-1 py-2 text-sm font-semibold display text-base" style={{ background: entryType === "income" ? TEAL : "transparent", color: entryType === "income" ? "#fff" : INK }}>
                收款收入
              </button>
            </div>

            <Stub>
              <div className="p-4 pt-5 space-y-2">
                {entryType === "expense" ? (
                  <>
                    <div className="relative">
                      <input
                        placeholder="材料品項（例：PVC 管件）— 輸入一字自動帶出"
                        value={form.item}
                        onChange={(e) => { setForm({ ...form, item: e.target.value }); setShowSuggest(true); }}
                        onFocus={() => setShowSuggest(true)}
                        onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
                        className="w-full px-3 py-2 rounded text-sm outline-none"
                        style={inputStyle}
                      />
                      {showSuggest && itemSuggestions.length > 0 && (
                        <div className="absolute z-10 left-0 right-0 mt-1 rounded shadow-lg overflow-hidden" style={{ background: "#fff", border: `1.5px solid ${LINE}` }}>
                          {itemSuggestions.map((c) => (
                            <button
                              key={c.id}
                              onMouseDown={() => pickSuggestion(c)}
                              className="w-full text-left px-3 py-2 text-sm flex justify-between items-center hover:bg-black/5"
                            >
                              <span>{c.item}</span>
                              <span className="text-xs opacity-50">{c.category} · {c.unit}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <input
                      placeholder="分類（例：水管材料 / 電材）"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 rounded text-sm outline-none"
                      style={inputStyle}
                    />
                    <div className="flex gap-2">
                      <input
                        placeholder="數量"
                        type="number"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="w-1/2 px-3 py-2 rounded text-sm outline-none mono"
                        style={inputStyle}
                      />
                      <input
                        placeholder="單位（支/個/捲）"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="w-1/2 px-3 py-2 rounded text-sm outline-none"
                        style={inputStyle}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <input placeholder="客戶／案場名稱" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                    <input placeholder="備註（選填）" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                  </>
                )}
                <div className="flex gap-2">
                  <input placeholder="金額" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="flex-1 px-3 py-2 rounded text-sm outline-none mono" style={inputStyle} />
                  <button onClick={submitEntry} className="px-4 rounded font-semibold flex items-center gap-1 text-sm text-white" style={{ background: entryType === "expense" ? COPPER : TEAL }}>
                    <Plus size={16} /> 記一筆
                  </button>
                </div>
              </div>
            </Stub>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold opacity-60 display tracking-wider">今日紀錄</p>
              {[...materials, ...income]
                .filter((e) => e.date === todayStr())
                .sort((a, b) => b.id - a.id)
                .map((e) => {
                  const isExpense = "item" in e;
                  return (
                    <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                      <div className="flex items-center gap-2">
                        <Stamp label={isExpense ? e.category : "收款"} color={isExpense ? COPPER : TEAL} />
                        <span className="text-sm">
                          {isExpense ? e.item : e.client}
                          {isExpense && e.quantity ? <span className="text-xs opacity-50 ml-1">{e.quantity}{e.unit}</span> : null}
                        </span>
                      </div>
                      <span className="mono text-sm font-semibold" style={{ color: isExpense ? COPPER : TEAL }}>
                        {isExpense ? "−" : "+"}{fmtMoney(e.amount)}
                      </span>
                    </div>
                  );
                })}
              {materials.filter((e) => e.date === todayStr()).length + income.filter((e) => e.date === todayStr()).length === 0 && (
                <p className="text-sm opacity-50 py-4 text-center">今天還沒有紀錄</p>
              )}
            </div>
          </div>
        )}

        {tab === "catalog" && (
          <div>
            <Stub>
              <div className="p-4 pt-5 space-y-2">
                <p className="text-xs font-semibold opacity-60 display tracking-wider mb-1 flex items-center gap-1">
                  <Tags size={13} /> 新增分類 / 品項
                </p>
                <input placeholder="分類（例：水管材料）" value={catalogForm.category} onChange={(e) => setCatalogForm({ ...catalogForm, category: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                <div className="flex gap-2">
                  <input placeholder="品項名稱" value={catalogForm.item} onChange={(e) => setCatalogForm({ ...catalogForm, item: e.target.value })} className="flex-1 px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                  <input placeholder="單位" value={catalogForm.unit} onChange={(e) => setCatalogForm({ ...catalogForm, unit: e.target.value })} className="w-20 px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                  <button onClick={addCatalogEntry} className="px-3 rounded font-semibold text-sm text-white" style={{ background: AMBER }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </Stub>

            <p className="text-xs opacity-50 mt-3 mb-3">在「進貨支出」輸入品項時會自動帶出這裡的資料；新增支出紀錄也會自動存進這張表。</p>

            <div className="space-y-4">
              {Object.keys(catalogByCategory).length === 0 && <p className="text-sm opacity-50 py-4 text-center">還沒有任何品項</p>}
              {Object.entries(catalogByCategory).map(([cat, items]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold display tracking-wider mb-1.5" style={{ color: COPPER }}>{cat}</p>
                  <div className="space-y-1.5">
                    {items.map((it) => (
                      <div key={it.id} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                        <span className="text-sm">{it.item}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs mono opacity-60">{it.unit || "—"}</span>
                          <button onClick={() => removeCatalogEntry(it.id)} className="opacity-40 hover:opacity-90">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => shiftMonth(-1)} className="p-2 rounded" style={{ background: PAPER, border: `1px solid ${LINE}` }}><ChevronLeft size={18} /></button>
              <span className="display text-lg font-semibold">{fmtMonthLabel(statMonth)}</span>
              <button onClick={() => shiftMonth(1)} className="p-2 rounded" style={{ background: PAPER, border: `1px solid ${LINE}` }}><ChevronRight size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-4 rounded" style={{ background: PAPER, border: `1.5px solid ${LINE}` }}>
                <p className="text-xs opacity-60 mb-1">月支出</p>
                <p className="mono text-xl font-bold" style={{ color: COPPER }}>{fmtMoney(monthlyExpense)}</p>
              </div>
              <div className="p-4 rounded" style={{ background: PAPER, border: `1.5px solid ${LINE}` }}>
                <p className="text-xs opacity-60 mb-1">月收入</p>
                <p className="mono text-xl font-bold" style={{ color: TEAL }}>{fmtMoney(monthlyIncome)}</p>
              </div>
            </div>
            <div className="p-4 rounded mb-5" style={{ background: INK, color: PAPER }}>
              <p className="text-xs opacity-70 mb-1">淨利</p>
              <p className="mono text-2xl font-bold" style={{ color: net >= 0 ? AMBER : "#E27C6B" }}>{net >= 0 ? "+" : ""}{fmtMoney(net)}</p>
            </div>

            <p className="text-xs font-semibold opacity-60 display tracking-wider mb-2">近 6 個月趨勢</p>
            <div className="p-4 rounded" style={{ background: PAPER, border: `1.5px solid ${LINE}` }}>
              <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
                {trend.map((t) => (
                  <div key={t.key} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1" style={{ height: 110 }}>
                      <div style={{ width: 8, height: `${(t.支出 / maxTrend) * 100}%`, background: COPPER, borderRadius: 2 }} />
                      <div style={{ width: 8, height: `${(t.收入 / maxTrend) * 100}%`, background: TEAL, borderRadius: 2 }} />
                    </div>
                    <span className="text-[10px] opacity-60">{t.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 justify-center text-xs">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: COPPER }} />支出</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: TEAL }} />收入</span>
              </div>
            </div>
          </div>
        )}

        {tab === "calls" && (
          <div>
            <Stub>
              <div className="p-4 pt-5 space-y-2">
                <p className="text-xs font-semibold opacity-60 display tracking-wider mb-1 flex items-center gap-1">
                  <PhoneCall size={13} /> 接到生意電話，先記下來
                </p>
                <input placeholder="客戶名稱" value={callForm.client} onChange={(e) => setCallForm({ ...callForm, client: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                <input placeholder="電話（選填）" value={callForm.phone} onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })} className="w-full px-3 py-2 rounded text-sm outline-none mono" style={inputStyle} />
                <div className="flex gap-2">
                  <input placeholder="需求（例：漏水 / 跳電）" value={callForm.note} onChange={(e) => setCallForm({ ...callForm, note: e.target.value })} className="flex-1 px-3 py-2 rounded text-sm outline-none" style={inputStyle} />
                  <button onClick={submitCall} className="px-4 rounded font-semibold text-sm text-white" style={{ background: AMBER }}><Plus size={16} /></button>
                </div>
              </div>
            </Stub>

            {pendingCalls.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold display tracking-wider mb-2" style={{ color: AMBER }}>尚未安排時間 · {pendingCalls.length}</p>
                <div className="space-y-2">
                  {pendingCalls.map((c) => (
                    <div key={c.id} className="p-3 rounded" style={{ background: "#FBEFDA", border: `1.5px solid ${AMBER}` }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold">{c.client}</p>
                          {c.phone && <p className="text-xs mono opacity-70">{c.phone}</p>}
                          {c.note && <p className="text-xs opacity-70 mt-0.5">{c.note}</p>}
                        </div>
                        <button onClick={() => setScheduling(scheduling === c.id ? null : c.id)} className="text-xs px-2 py-1 rounded flex items-center gap-1 text-white shrink-0" style={{ background: AMBER }}>
                          <Calendar size={12} /> 安排
                        </button>
                      </div>
                      {scheduling === c.id && <ScheduleRow onConfirm={(d, t) => confirmSchedule(c.id, d, t)} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scheduledCalls.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold display tracking-wider mb-2" style={{ color: TEAL }}>已安排</p>
                <div className="space-y-2">
                  {scheduledCalls.map((c) => (
                    <div key={c.id} className="p-3 rounded flex justify-between items-center" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                      <div>
                        <p className="text-sm font-semibold">{c.client}</p>
                        <p className="text-xs opacity-70">{c.note}</p>
                        <p className="text-xs mono mt-1 flex items-center gap-1" style={{ color: TEAL }}><Clock size={11} /> {c.date} {c.time}</p>
                      </div>
                      <button onClick={() => completeCall(c.id)} className="p-2 rounded" style={{ background: TEAL, color: "#fff" }}><Check size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doneCalls.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold opacity-40 display tracking-wider mb-2">已完成</p>
                <div className="space-y-1.5">
                  {doneCalls.map((c) => (
                    <div key={c.id} className="px-3 py-2 rounded text-xs opacity-45 line-through" style={{ background: PAPER }}>{c.client} · {c.note}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center" style={{ background: INK }}>
        <div className="max-w-md w-full flex" style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          {[
            { id: "ledger", label: "記帳", icon: Receipt },
            { id: "catalog", label: "分類品項", icon: Tags },
            { id: "stats", label: "統計", icon: BarChart3 },
            { id: "calls", label: "待辦電話", icon: Phone, badge: pendingCalls.length },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex-1 flex flex-col items-center gap-1 py-3 relative" style={{ color: tab === t.id ? AMBER : "#8C9186" }}>
              <t.icon size={19} />
              <span className="text-[10px] display tracking-wide">{t.label}</span>
              {t.badge > 0 && (
                <span className="absolute top-1.5 right-[22%] w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-bold" style={{ background: COPPER }}>{t.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScheduleRow({ onConfirm }) {
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("09:00");
  return (
    <div className="flex gap-2 mt-2 pt-2" style={{ borderTop: `1px dashed ${AMBER}` }}>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-2 py-1.5 rounded text-xs mono outline-none" style={{ border: `1px solid ${AMBER}` }} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="px-2 py-1.5 rounded text-xs mono outline-none" style={{ border: `1px solid ${AMBER}` }} />
      <button onClick={() => onConfirm(date, time)} className="px-3 rounded text-xs font-semibold text-white" style={{ background: "#20291F" }}>確定</button>
    </div>
  );
}
