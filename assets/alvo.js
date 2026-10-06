// Alvo das propostas (koteauto-onepage/como-ordenamos-as-propostas).
// Desenha o alvo e a lista interativa; a tabela com os mesmos dados está no HTML.
// Dados fictícios; a ordem foi calculada pela regra atual do ranking da aplicação.
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const stores = [
    { id: "A", color: "var(--loja-a)", ink: "#fff", price: 112000, trade: 38000, n: 48, pmt: 1790, rate: 2.08, km: 18000, year: 2025, pos: 2,
      why: "2º lugar: equilibrada. Parcela e taxa razoáveis, sem ser a melhor em nenhum critério." },
    { id: "B", color: "var(--loja-b)", ink: "#292a2c", price: 108500, trade: 34000, n: 48, pmt: 1980, rate: 2.55, km: 27000, year: 2024, pos: 5,
      why: "5º lugar: segunda mais barata, mas com parcela perto do limite, taxa alta e avaliação do usado baixa." },
    { id: "C", color: "var(--loja-c)", ink: "#292a2c", price: 115000, trade: 41000, n: 36, pmt: 1750, rate: 0.86, km: 12000, year: 2025, pos: 1,
      why: "1º lugar mesmo sendo uma das mais caras: menor taxa, prazo mais curto e parcela confortável, com boa avaliação do usado." },
    { id: "D", color: "var(--loja-d)", ink: "#fff", price: 104000, trade: 31000, n: 60, pmt: 1590, rate: 2.18, km: 41000, year: 2023, pos: 4,
      why: "4º lugar: o menor preço e a menor parcela, mas o pior usado, a maior quilometragem e o prazo mais longo." },
    { id: "E", color: "var(--loja-e)", ink: "#fff", price: 119000, trade: 44000, n: 48, pmt: 2140, rate: 2.91, km: 0, year: 2026, pos: 3,
      why: "3º lugar: carro zero km e a melhor avaliação do usado, mas parcela acima do limite e a taxa mais alta." },
  ];
  const brl = (v) => "R$ " + v.toLocaleString("pt-BR");
  const criteria = [
    { key: "pmt", label: "Parcela", lower: true, fmt: (s) => brl(s.pmt) },
    { key: "rate", label: "Taxa de juros", lower: true, fmt: (s) => "≈ " + s.rate.toLocaleString("pt-BR") + "% a.m." },
    { key: "n", label: "Prazo", lower: true, fmt: (s) => s.n + " meses" },
    { key: "trade", label: "Avaliação do usado", lower: false, fmt: (s) => brl(s.trade) },
    { key: "km", label: "Quilometragem", lower: true, fmt: (s) => s.km === 0 ? "0 km" : s.km.toLocaleString("pt-BR") + " km" },
    { key: "price", label: "Preço do carro", lower: true, ref: true, fmt: (s) => brl(s.price) },
  ];
  // posição em cada critério (empates dividem a mesma posição)
  for (const c of criteria) {
    const values = [...new Set(stores.map((s) => s[c.key]))].sort((a, b) => (c.lower ? a - b : b - a));
    c.rank = Object.fromEntries(stores.map((s) => [s.id, values.indexOf(s[c.key]) + 1]));
  }

  const svg = document.getElementById("alvo");
  const cx = 320, cy = 320;
  const bounds = [0, 62, 106, 146, 184, 222];   // anéis do 1º (centro) ao 5º
  const mid = (k) => (bounds[k - 1] + bounds[k]) / 2 + (k === 1 ? 10 : 0);
  const sector = (2 * Math.PI) / criteria.length;
  const start = -Math.PI / 2 - sector / 2;      // primeira fatia centrada no topo
  const pt = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const el = (tag, attrs, parent = svg) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    parent.appendChild(node);
    return node;
  };

  // textura para a fatia de referência
  const defs = el("defs", {});
  const pat = el("pattern", { id: "hatch", width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
  el("rect", { width: 8, height: 8, fill: "#ffffff" }, pat);
  el("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: "#e6dfd3", "stroke-width": 3 }, pat);

  const base = el("g", {});
  criteria.forEach((c, i) => {
    if (!c.ref) return;
    const a0 = start + i * sector, a1 = a0 + sector, R = bounds[5];
    const [x0, y0] = pt(R, a0), [x1, y1] = pt(R, a1);
    el("path", { d: `M${cx},${cy} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`, fill: "url(#hatch)" }, base);
  });
  for (let k = 5; k >= 1; k--) {
    el("circle", { cx, cy, r: bounds[k], fill: "none", stroke: k === 1 ? "#245951" : "#d9d1c4", "stroke-width": k === 1 ? 2.5 : 2 }, base);
  }
  el("circle", { cx, cy, r: bounds[1], fill: "#e7ece3", opacity: 0.55 }, base);
  criteria.forEach((_, i) => {
    const [x, y] = pt(bounds[5], start + i * sector);
    el("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "#cfc6b8", "stroke-width": 2, ...(criteria[i].ref || criteria[(i - 1 + criteria.length) % criteria.length].ref ? { "stroke-dasharray": "4 4" } : {}) }, base);
  });
  // rótulos dos anéis ao longo da divisória superior direita
  for (let k = 1; k <= 5; k++) {
    const [x, y] = pt(mid(k), start + sector);
    const t = el("text", { class: "lbl-ring", x: x + 5, y: y - 5, "font-size": 16, "font-weight": 700, fill: "#4f4943", "font-family": "Arial" }, base);
    t.textContent = k + "º";
  }
  // rótulos das fatias
  criteria.forEach((c, i) => {
    const a = start + (i + 0.5) * sector;
    const [x, y] = pt(bounds[5] + 38, a);
    const t = el("text", { x, y, "text-anchor": Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end", class: "lbl-crit", "dominant-baseline": "middle", "font-size": 21, "font-weight": 700, fill: c.ref ? "#4f4943" : "#292a2c", "font-family": "Arial" });
    t.textContent = c.label;
    if (c.ref) {
      const s = el("text", { class: "lbl-sub", x, y: y + 24, "text-anchor": t.getAttribute("text-anchor"), "font-size": 16, "font-weight": 700, fill: "#625a54", "font-family": "Arial" });
      s.textContent = "só para comparar";
    }
  });

  // perfis (linha ligando os marcadores da loja destacada) e marcadores
  const profiles = el("g", {});
  const markers = el("g", {});
  const slot = (j) => 0.14 + (j / (stores.length - 1)) * 0.72;   // posição fixa de cada loja dentro da fatia
  const tip = document.getElementById("tip");
  stores.forEach((s, j) => {
    const points = [];
    criteria.forEach((c, i) => {
      const a = start + (i + slot(j)) * sector;
      const [x, y] = pt(mid(c.rank[s.id]), a);
      if (!c.ref) points.push(`${x},${y}`);
      const g = el("g", { class: "marker", "data-store": s.id, tabindex: 0, role: "img", "aria-label": `Loja ${s.id}, ${c.label}: ${c.fmt(s)}, ${c.rank[s.id]}º neste critério` }, markers);
      el("circle", { class: "dot", cx: x, cy: y, r: 12.5, fill: s.color, stroke: "#ffffff", "stroke-width": 2 }, g);
      const t = el("text", { x, y: y + 0.5, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": 13, "font-weight": 700, fill: s.ink, "font-family": "Arial", "pointer-events": "none" }, g);
      t.textContent = s.id;
      const show = (ev) => {
        tip.innerHTML = `<strong>Loja ${s.id}</strong> · ${c.label}<br>${c.fmt(s)} · ${c.rank[s.id]}º neste critério`;
        const r = ev.target.getBoundingClientRect?.() ?? g.getBoundingClientRect();
        tip.style.left = Math.min(window.innerWidth - 250, r.left + r.width / 2 + 10) + "px";
        tip.style.top = (r.top - 50) + "px";
        tip.classList.add("on");
      };
      g.addEventListener("pointerenter", show);
      g.addEventListener("focus", show);
      g.addEventListener("pointerleave", () => tip.classList.remove("on"));
      g.addEventListener("blur", () => tip.classList.remove("on"));
      g.addEventListener("click", () => select(s.id));
    });
    el("polygon", { class: "profile", "data-store": s.id, points: points.join(" "), stroke: s.color, opacity: 0 }, profiles);
  });

  // legenda na ordem da KoteAuto
  const legend = document.getElementById("legenda");
  const why = document.getElementById("porque");
  [...stores].sort((a, b) => a.pos - b.pos).forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" aria-pressed="false" data-store="${s.id}">
      <span class="pos">${s.pos}º</span>
      <span class="chip" style="background:${s.color};color:${s.ink}">${s.id}</span>
      <span class="name"><strong>Loja ${s.id}</strong><span>${brl(s.price)} · ${s.n}x ${brl(s.pmt)}</span></span>
    </button>`;
    li.querySelector("button").addEventListener("click", () => select(s.id));
    legend.appendChild(li);
  });

  let selected = null;
  function select(id) {
    selected = selected === id ? null : id;
    markers.querySelectorAll(".marker").forEach((m) => m.classList.toggle("dim", !!selected && m.dataset.store !== selected));
    profiles.querySelectorAll(".profile").forEach((p) => p.setAttribute("opacity", p.dataset.store === selected ? 0.9 : 0));
    legend.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.store === selected)));
    // traz os marcadores da loja escolhida para frente
    if (selected) markers.querySelectorAll(`.marker[data-store="${selected}"]`).forEach((m) => markers.appendChild(m));
    const s = stores.find((x) => x.id === selected);
    why.textContent = s ? `Loja ${s.id} · ${s.why}` : "Toque em uma loja para ver por que ela ficou nessa posição.";
  }


  select("C");   // abre mostrando a 1ª colocada
})();
