console.log("Rwanda for All — Phase 8 ✅");

/* ================= AUTH STATE ================= */

/*
Simulated authentication.
In Phase 9, this becomes:
- JWT
- API login
- Session cookies
*/

let sessionUser = JSON.parse(localStorage.getItem("sessionUser"));

const identityBox = document.getElementById("identityBox");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const newStoryBtn = document.getElementById("newStoryBtn");
const verifierBtn = document.getElementById("verifierDashboardBtn");
const moderatorBtn = document.getElementById("moderatorDashboardBtn");

/* ---------------- Render Identity ---------------- */

function renderIdentity() {
  if (!sessionUser) {
    identityBox.innerHTML = `<strong>Not signed in</strong>`;
    return;
  }

  identityBox.innerHTML = `
    <strong>Signed in as:</strong> ${sessionUser.name}<br/>
    <strong>Role:</strong> ${sessionUser.role.replace("_", " ")}<br/>
    <strong>Nationality Verified:</strong>
    ${sessionUser.nationalityVerified ? "Yes" : "No"}
  `;
}

/* ---------------- Role Permissions ---------------- */

function applyPermissions() {
  loginBtn.style.display = sessionUser ? "none" : "inline-block";
  logoutBtn.style.display = sessionUser ? "inline-block" : "none";

  newStoryBtn.style.display =
    sessionUser && sessionUser.role === "verified_rwandan"
      ? "inline-block"
      : "none";

  verifierBtn.style.display =
    sessionUser && sessionUser.role === "verifier"
      ? "inline-block"
      : "none";

  moderatorBtn.style.display =
    sessionUser && sessionUser.role === "moderator"
      ? "inline-block"
      : "none";
}

/* ---------------- LOGIN / LOGOUT ---------------- */

loginBtn.onclick = () => {
  // Mock sign-in
  sessionUser = {
    id: "user-001",
    name: "Sample User",
    role: "verified_rwandan", // change to verifier/moderator to test
    nationalityVerified: true
  };

  localStorage.setItem("sessionUser", JSON.stringify(sessionUser));
  renderIdentity();
  applyPermissions();
};

logoutBtn.onclick = () => {
  sessionUser = null;
  localStorage.removeItem("sessionUser");
  renderIdentity();
  applyPermissions();
};

/* Init */
renderIdentity();
applyPermissions();

/* ================= STORIES ================= */

let stories = [];
const hero = document.querySelector(".hero");
const cards = document.querySelector(".cards");
const view = document.getElementById("contentView");
const titleEl = document.getElementById("sectionTitle");
const contentEl = document.getElementById("sectionContent");
const backBtn = document.querySelector(".back-btn");

/* Load stories */
fetch("./data/stories.json")
  .then(res => res.json())
  .then(baseStories => {
    const userStories = JSON.parse(localStorage.getItem("userStories") || "[]");
    stories = [...baseStories, ...userStories];
  });

/* Category navigation */
document.querySelectorAll(".card").forEach(card => {
  card.onclick = () => {
    const category = card.dataset.category;

    hero.classList.add("hidden");
    cards.classList.add("hidden");
    view.classList.remove("hidden");

    titleEl.textContent = category;
    contentEl.innerHTML = stories
      .filter(s => s.category === category)
      .map(s => `
        <div class="story-item" onclick="openStory('${s.id}')">
          <strong>${s.title}</strong>
          <div class="status">${s.status.toUpperCase()}</div>
        </div>
      `).join("");
  };
});

/* Open story */
window.openStory = function (id) {
  const s = stories.find(st => st.id === id);
  if (!s) return;

  titleEl.textContent = s.title;
  contentEl.innerHTML = `
    <div class="status">Status: ${s.status.toUpperCase()}</div>
    <p><strong>Category:</strong> ${s.category}</p>
    <p><strong>Created:</strong> ${new Date(s.created_at).toLocaleString()}</p>
    <p style="margin-top:16px">${s.content}</p>
  `;
};

/* Back */
backBtn.onclick = () => {
  view.classList.add("hidden");
  hero.classList.remove("hidden");
  cards.classList.remove("hidden");
};