(() => {
  const storageKey = "campus-stores.shift.v1";
  const root = document.getElementById("campus-stores");
  const q = (selector) => root.querySelector(selector);
  const requests = [
    {
      id: "RQ-214",
      club: "Film Society",
      event: "Courtyard screening",
      owner: "Isha Rao",
      due: "Fri 8 pm",
      items: ["HDMI projector", "Portable speaker", "USB-C → HDMI adapter"],
      note: "Playback is from a USB-C-only laptop. The host will collect at 4 pm.",
    },
    {
      id: "RQ-209",
      club: "Debate Union",
      event: "Finals rehearsal",
      owner: "Tara Shah",
      due: "Sat 10 am",
      items: ["Wireless microphone"],
      note: "Rehearsal runs into the evening.",
    },
    {
      id: "RQ-217",
      club: "Photo Circle",
      event: "Street portrait walk",
      owner: "Dev Menon",
      due: "Sat noon",
      items: ["Digital camera"],
      note: "Collection on Saturday morning.",
    },
  ];
  const assets = [
    { id: "PR-04", type: "HDMI projector", model: "BenQ MH550", bin: "A2" },
    {
      id: "PR-06",
      type: "HDMI projector",
      model: "Epson EB-X49",
      bin: "Workshop",
      repair: true,
    },
    { id: "SP-02", type: "Portable speaker", model: "JBL Eon One", bin: "B1" },
    { id: "SP-05", type: "Portable speaker", model: "Bose S1", bin: "B2" },
    {
      id: "AD-12",
      type: "USB-C → HDMI adapter",
      model: "Belkin AVC002",
      bin: "C4",
    },
    {
      id: "AD-15",
      type: "USB-C → HDMI adapter",
      model: "Anker A8312",
      bin: "C4",
    },
    { id: "MI-09", type: "Wireless microphone", model: "Shure BLX", bin: "B3" },
    { id: "CA-03", type: "Digital camera", model: "Sony A6400", bin: "D2" },
  ];
  const people = [
    "Isha Rao",
    "Kabir Sen",
    "Leela Das",
    "Tara Shah",
    "Dev Menon",
  ];
  const shifts = [
    {
      time: "Friday · 3:45 pm",
      title: "Pickup at the counter",
      text: "Kabir is here for the Film Society screening. The film starts at four. Can he leave with everything he needs?",
      next: "Move to return time",
    },
    {
      time: "Friday · 7:30 pm",
      title: "The kit comes back in pieces",
      text: "Kabir has brought back the projector and speaker. “Leela still has the adapter. She’ll drop it off tomorrow at nine.” Take the return and hand over to the morning shift.",
      next: "Move to next morning",
    },
    {
      time: "Saturday · 9:00 am",
      title: "Morning shift",
      text: "You’ve just taken over. Leela walks in with an adapter. Work out what was outstanding from the screening and close the loan for the right item.",
    },
  ];
  const pages = [
    ["Requests", "clipboard-list"],
    ["Inventory", "package"],
    ["Loan register", "book-open"],
    ["Shift handover", "clipboard-list"],
    ["Desk book", "messages-square"],
  ];
  const original = () => ({
    version: 2,
    tab: "Requests",
    phase: 0,
    selected: "",
    filter: "All items",
    loans: [
      {
        num: 401,
        req: "RQ-209",
        asset: "MI-09",
        who: "Tara Shah",
        due: "Sat 10 am",
        back: false,
        needsVerification: false,
        verificationNote: "",
      },
    ],
    notes: [],
    editing: false,
    verifying: null,
    verificationFor: null,
    onlyOpen: true,
    notice: "Sample shift · All records are fictional.",
  });
  let s = original();
  const getAsset = (id) => assets.find((x) => x.id === id);
  const getReq = (id) => requests.find((x) => x.id === id);
  const out = (id) => s.loans.find((l) => l.asset === id && !l.back);
  const esc = (x) =>
    String(x).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const opts = (list) =>
    list
      .map(([v, t]) => '<option value="' + esc(v) + '">' + esc(t) + "</option>")
      .join("");
  const btn = (label, act, val = "", style = "") =>
    '<button type="button" data-action="' +
    act +
    '" data-val="' +
    esc(val) +
    '" class="' +
    style +
    '">' +
    esc(label) +
    "</button>";
  const head = (title, sub, control = "") =>
    '<div class="sectionhead"><div><h2>' +
    title +
    "</h2><small>" +
    sub +
    "</small></div>" +
    control +
    "</div>";
  const row = (label, sub, right) =>
    '<div class="row"><div><strong>' +
    esc(label) +
    "</strong><small>" +
    esc(sub) +
    "</small></div><div>" +
    right +
    "</div></div>";
  const badge = (t, good = false) =>
    '<span class="tag' + (good ? " good" : "") + '">' + esc(t) + "</span>";
  function requestPage() {
    let html = head(
      "Approved requests",
      "Student Activities Office · 3 approved forms",
    );
    if (s.selected) {
      const r = getReq(s.selected);
      html +=
        btn("Back to list", "close") +
        '<div class="record"><small>' +
        r.id +
        " · Approved</small><h3>" +
        r.event +
        "</h3><p>" +
        r.club +
        " · Filed by " +
        r.owner +
        "</p><p><b>Return by</b> " +
        r.due +
        "</p><p><b>Approved equipment</b></p><ul>" +
        r.items.map((x) => "<li>" + x + "</li>").join("") +
        "</ul><p>" +
        r.note +
        "</p></div>";
    } else
      html += requests
        .map((r) =>
          row(
            r.event,
            r.id + " · " + r.club,
            btn("View form", "request", r.id),
          ),
        )
        .join("");
    return html;
  }
  function inventory() {
    let html = head(
      "Inventory",
      "Physical units · home shelf and current availability",
    );
    html +=
      '<div class="buttons"><label>Show <select data-filter>' +
      opts(
        ["All items", "On shelf", "On loan", "In repair"].map((f) => [f, f]),
      ) +
      "</select></label></div>";
    for (const a of assets) {
      const status = a.repair
        ? "In repair"
        : out(a.id)
          ? "On loan"
          : "On shelf";
      if (s.filter !== "All items" && s.filter !== status) continue;
      html += row(
        a.id + " · " + a.type,
        a.model + " · " + a.bin,
        badge(status, status === "On shelf"),
      );
    }
    return html;
  }
  function register() {
    let html = head(
      "Loan register",
      "One slip per physical unit",
      s.editing
        ? btn("Cancel", "cancel")
        : btn("New issue slip", "new", "", "primary"),
    );
    if (s.editing) {
      const available = assets.filter((a) => !a.repair && !out(a.id));
      const select = (label, key, options) =>
        "<label><span>" +
        label +
        '</span><select name="' +
        key +
        '" required><option value="">Select…</option>' +
        opts(options) +
        "</select></label>";
      return (
        html +
        '<form data-issue><div class="form">' +
        select(
          "Approved request",
          "req",
          requests.map((r) => [r.id, r.id + " · " + r.club]),
        ) +
        select(
          "Unit leaving the desk",
          "asset",
          available.map((a) => [a.id, a.id + " · " + a.type]),
        ) +
        select("Collected by", "who", people.map((p) => [p, p])) +
        select(
          "Return by",
          "due",
          ["Fri 8 pm", "Sat 9 am", "Sat 10 am", "Sat noon"].map((d) => [d, d]),
        ) +
        '</div><button type="submit" class="primary">Save issue slip</button></form>'
      );
    }
    html +=
      '<div class="buttons">' +
      ["Outstanding", "All slips"]
        .map(
          (v, i) =>
            '<button type="button" data-action="scope" data-val="' +
            i +
            '" aria-pressed="' +
            (s.onlyOpen === (i === 0)) +
            '">' +
            v +
            "</button>",
        )
        .join("") +
      "</div>";
    const shown = s.loans
      .filter((l) => !s.onlyOpen || !l.back)
      .slice()
      .reverse();
    if (!shown.length) html += "<p>No outstanding slips.</p>";
    for (const l of shown) {
      let right;
      if (l.back) right = badge("Returned and recorded", true);
      else if (l.needsVerification)
        right = badge("Reported · waiting for verification");
      else right = btn("Verify return", "verify-return", String(l.num), "primary");
      html += row(
        "L-" + l.num + " · " + l.asset,
        l.req + " · " + l.who + " · Due " + l.due,
        right,
      );
    }
    return html;
  }
  function handover() {
    let html = head(
      "Shift handover",
      "Outstanding equipment grouped by approved request",
    );
    const pending = s.loans.filter((l) => !l.back);
    if (!pending.length)
      return html + '<div class="handover-summary good-summary">No outstanding equipment. The handover is clear.</div>'; 

    const grouped = requests
      .map((r) => ({ r, loans: pending.filter((l) => l.req === r.id) }))
      .filter((g) => g.loans.length);

    for (const { r, loans } of grouped) {
      html +=
        '<section class="handover-group"><h3>' +
        r.id +
        " · " +
        esc(r.club) +
        '</h3><p class="handover-due">Due ' +
        esc(r.due) +
        "</p>";
      for (const l of loans) {
        const status = l.needsVerification
          ? badge("Reported returned · waiting for physical verification")
          : badge("Still outstanding");
        let action = "";
        if (l.needsVerification)
          action = btn("Check physical item", "verify-return", String(l.num), "primary");
        else
          action =
            btn("Verify return", "verify-return", String(l.num), "primary") +
            '<button type="button" data-action="needs-verification" data-val="' +
            l.num +
            '" class="secondary">Needs verification</button>';
        html +=
          '<div class="handover-item"><div><strong>' +
          esc(l.asset) +
          '</strong><small>Borrower: ' +
          esc(l.who) +
          " · Due " +
          esc(l.due) +
          " · L-" +
          l.num +
          "</small>" +
          (l.verificationNote
            ? '<small class="handover-note">Note: ' + esc(l.verificationNote) + "</small>"
            : "") +
          '</div><div class="handover-actions">' + status + action + "</div></div>";
      }
      html += "</section>";
    }

    if (s.verificationFor !== null) {
      const l = s.loans.find((loan) => loan.num === s.verificationFor);
      if (l && !l.back)
        html +=
          '<div class="verification-panel"><h3>Mark for physical verification</h3><p>' +
          esc(l.asset) +
          " · L-" +
          l.num +
          '</p><form data-needs-verification><div class="form"><label class="full"><span>Short note</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><div class="buttons">' +
          '<button type="submit" class="primary">Mark needs verification</button>' +
          btn("Cancel", "cancel-verification") +
          "</div></form></div>";
    }

    if (s.verifying !== null) {
      const l = s.loans.find((loan) => loan.num === s.verifying);
      if (l && !l.back)
        html +=
          '<div class="verification-panel"><h3>Confirm physical item</h3><p>Loan ' +
          esc(l.asset) +
          " · L-" +
          l.num +
          '</p><form data-verify><div class="form"><label class="full"><span>Type the physical item ID exactly (for example ' +
          esc(l.asset) +
          ')</span><input name="physicalId" autocomplete="off" required /></label><label class="full"><span>Optional verification note</span><textarea name="note" rows="2" maxlength="400"></textarea></label></div><div class="buttons">' +
          '<button type="submit" class="primary">Confirm verified return</button>' +
          btn("Cancel", "cancel-verification") +
          "</div></form></div>";
    }

    const completed = s.loans.filter((l) => l.back);
    if (completed.length) {
      html += '<section class="handover-completed"><h3>Returned and recorded</h3>';
      for (const l of completed)
        html += '<div class="handover-item"><div><strong>' + esc(l.asset) + '</strong><small>' + esc(l.req) + " · " + esc(l.who) + " · L-" + l.num + "</small></div>" + badge("Returned and recorded", true) + "</div>";
      html += "</section>";
    }
    return html;
  }
  function deskbook() {
    let html = head(
      "Desk book",
      "Messages from clubs and notes for the next shift",
    );
    const entries = [
      [
        "Friday · 3:20 pm",
        "Isha Rao · Film Society",
        "Kabir Sen is picking up our whole screening kit. Please issue it in his name. I’m setting up in the courtyard.",
      ],
      [
        "Friday · 3:30 pm",
        "Tara Shah · Debate Union",
        "Our microphone stays with me overnight. I’ll return it by 10 am Saturday.",
      ],
    ];
    if (s.phase >= 1)
      entries.push([
        "Friday · 7:30 pm",
        "Kabir Sen · Film Society",
        "I brought the projector and speaker. Leela Das has our adapter. She’ll be at the counter at 9 am tomorrow.",
      ]);
    for (const n of s.notes)
      entries.push([shifts[n.phase].time, "Counter handover", n.text]);
    for (const [t, author, body] of entries.slice().reverse())
      html +=
        '<article class="record"><small>' +
        esc(t) +
        "</small><h3>" +
        esc(author) +
        "</h3><p>" +
        esc(body) +
        "</p></article>";
    return (
      html +
      '<form data-note><div class="form"><label class="full"><span>Note for the next shift</span><textarea name="note" rows="2" maxlength="400" required></textarea></label></div><button type="submit">Add handover note</button></form>'
    );
  }
  const screens = {
    Requests: requestPage,
    Inventory: inventory,
    "Loan register": register,
    "Shift handover": handover,
    "Desk book": deskbook,
  };
  function paint() {
    const phase = shifts[s.phase];
    q("[data-clock]").textContent = phase.time;
    q("[data-shift-title]").textContent = phase.title;
    q("[data-shift]").textContent = phase.text;
    const advance = q('[data-action="advance"]');
    advance.hidden = !phase.next;
    advance.textContent = phase.next || "";
    q("[data-nav]").innerHTML = pages
      .map(
        ([n, icon]) =>
          '<button type="button" data-action="tab" data-val="' +
          n +
          '" aria-pressed="' +
          (s.tab === n) +
          '"><svg aria-hidden="true" class="store-icon"><use href="#icon-' +
          icon +
          '"></use></svg>' +
          n +
          "</button>",
      )
      .join("");
    q("[data-page]").innerHTML = screens[s.tab]();
    if (q("[data-filter]")) q("[data-filter]").value = s.filter;
    q("[data-status]").textContent = s.notice;
  }
  function commit(msg) {
    if (msg) s.notice = msg;
    paint();
    try {
      localStorage.setItem(storageKey, JSON.stringify(s));
    } catch {
      q("[data-status]").textContent +=
        " Browser storage is unavailable. Progress lasts for this visit.";
    }
  }
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const v = b.dataset.val;
    switch (b.dataset.action) {
      case "restart":
        s = original();
        break;
      case "advance":
        if (s.phase < 2) s.phase++;
        if (s.phase === 1) {
          for (const l of s.loans)
            if (!l.back && l.req === "RQ-214" && (l.asset === "PR-04" || l.asset === "SP-02")) {
              l.needsVerification = true;
              l.verificationNote = "Kabir reported this item returned at 7:30 pm; physical check is still pending.";
            }
        }
        s.notice = "Shift time updated.";
        break;
      case "tab":
        s.tab = v;
        s.editing = false;
        s.verifying = null;
        s.verificationFor = null;
        break;
      case "close":
        s.selected = "";
        s.verifying = null;
        s.verificationFor = null;
        break;
      case "request":
        s.selected = v;
        break;
      case "new":
        s.editing = true;
        break;
      case "cancel":
        s.editing = false;
        break;
      case "scope":
        s.onlyOpen = v === "0";
        break;
      case "verify-return":
        s.verifying = Number(v);
        s.verificationFor = null;
        break;
      case "needs-verification":
        s.verificationFor = Number(v);
        s.verifying = null;
        break;
      case "cancel-verification":
        s.verifying = null;
        s.verificationFor = null;
        break;
    }
    commit();
  });
  root.addEventListener("change", (e) => {
    if (e.target.matches("[data-filter]")) {
      s.filter = e.target.value;
      commit();
    }
  });
  root.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    const form = new FormData(f);
    if (f.matches("[data-note]")) {
      const text = String(form.get("note")).trim();
      if (!text) return;
      s.notes.push({ phase: s.phase, text });
      commit("Handover note saved.");
      return;
    }
    if (f.matches("[data-verify]")) {
      const physicalId = String(form.get("physicalId")).trim();
      const note = String(form.get("note")).trim();
      const l = s.loans.find((loan) => loan.num === s.verifying);
      if (!l) return;
      if (physicalId !== l.asset) {
        s.notice = "Wrong physical item ID. " + l.asset + " was not returned.";
        commit();
        return;
      }
      l.back = true;
      l.needsVerification = false;
      l.verificationNote = note;
      s.verifying = null;
      s.verificationFor = null;
      commit("Verified return: " + l.asset + " is back at the desk and the loan is closed.");
      return;
    }
    if (f.matches("[data-needs-verification]")) {
      const note = String(form.get("note")).trim();
      const l = s.loans.find((loan) => loan.num === s.verificationFor);
      if (!l || !note) return;
      l.needsVerification = true;
      l.verificationNote = note;
      s.verificationFor = null;
      commit("" + l.asset + " remains on loan and is marked for physical verification.");
      return;
    }
    if (!f.matches("[data-issue]")) return;
    const [req, asset, who, due] = ["req", "asset", "who", "due"].map((k) =>
      form.get(k),
    );
    const unit = getAsset(asset),
      r = getReq(req);
    if (!r || !unit || unit.repair || out(asset) || !people.includes(who))
      return;
    if (!r.items.includes(unit.type)) {
      q("[data-status]").textContent =
        "This equipment type is outside the approved request. Choose an approved unit.";
      return;
    }
    if (
      s.loans.some(
        (l) => l.req === req && !l.back && getAsset(l.asset).type === unit.type,
      )
    ) {
      q("[data-status]").textContent =
        "The approved quantity of this equipment type is already on loan.";
      return;
    }
    const num = Math.max(...s.loans.map((l) => l.num)) + 1;
    s.loans.push({ num, req, asset, who, due, back: false, needsVerification: false, verificationNote: "" });
    s.editing = false;
    commit("Issued " + asset + " to " + who + " on slip L-" + num + ".");
  });
  function restore(d) {
    if (
      !d ||
      d.version !== 2 ||
      !Object.hasOwn(screens, d.tab) ||
      !shifts[d.phase] ||
      (d.selected && !getReq(d.selected)) ||
      !Array.isArray(d.notes) ||
      !d.notes.every(
        (n) => n && shifts[n.phase] && typeof n.text === "string",
      ) ||
      !Array.isArray(d.loans) ||
      !d.loans.length ||
      !d.loans.every(
        (l) =>
          l && getReq(l.req) && getAsset(l.asset) && Number.isInteger(l.num),
      )
    )
      return;
    s = {
      ...original(),
      ...d,
      loans: d.loans.map((l) => ({
        ...l,
        needsVerification: Boolean(l.needsVerification),
        verificationNote: typeof l.verificationNote === "string" ? l.verificationNote : "",
      })),
      notes: d.notes.map((n) => ({ ...n })),
    };
    paint();
  }
  paint();
  try {
    restore(JSON.parse(localStorage.getItem(storageKey)));
  } catch {
    // Keep the fresh shift when storage is unavailable or the saved data is invalid.
  }
})();
