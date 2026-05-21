const API_URL = "http://127.0.0.1:8000/api/stories/";

/* ==============================
   ELEMENTS
============================== */
const hero = document.querySelector(".hero");
const cards = document.querySelector(".cards");

const contentView = document.getElementById("contentView");
const submitView = document.getElementById("submitStoryView");

const sectionTitle = document.getElementById("sectionTitle");
const sectionContent = document.getElementById("sectionContent");

const submitBtn = document.getElementById("submitStoryBtn");
const backBtn = document.getElementById("backBtn");
const submitBackBtn = document.getElementById("submitBackBtn");

const storyForm = document.getElementById("storyForm");

let stories = [];
let currentView = "home";

/* ==============================
   UTIL
============================== */
function showToast(message) {
  document.querySelectorAll(".toast").forEach(t => t.remove());

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 50);
  setTimeout(() => toast.remove(), 3000);
}

/* ==============================
   LOAD STORIES
============================== */
function loadStories(callback) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      stories = data;
      if (callback) callback();
    });
}

/* ==============================
   RENDER STORIES (GRID)
============================== */
function renderStories(list, title) {
  currentView = "stories";

  hero.classList.add("hidden");
  cards.classList.add("hidden");
  submitView.classList.add("hidden");

  contentView.classList.remove("hidden");
  contentView.classList.add("fade");

  sectionTitle.textContent = title;
  backBtn.style.display = "block";

  if (!list.length) {
    sectionContent.innerHTML = "<p>No stories yet.</p>";
    return;
  }

  sectionContent.innerHTML = `
    <div class="story-grid">
      ${list.map((story, i) => `
        <div class="story" data-index="${i}">
          ${story.storyteller_photo ? `
            <img src="${story.storyteller_photo}" class="story-img"/>
          ` : ""}

          <h3>${story.title}</h3>
          <p>${story.content.substring(0, 100)}...</p>
          <small>${story.status}</small>
        </div>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".story").forEach(card => {
    card.onclick = () => openStory(list[card.dataset.index]);
  });
}

/* ==============================
   OPEN STORY
============================== */
function openStory(story) {
  currentView = "story";

  contentView.classList.remove("hidden");
  contentView.classList.add("fade");

  sectionTitle.innerHTML = `<h1>${story.title}</h1>`;

  sectionContent.innerHTML = `
    <div class="story-reader">

      ${story.storyteller_photo ? `
        <img src="${story.storyteller_photo}" class="story-main-img"/>
      ` : ""}

      <p class="story-content">${story.content}</p>

      <div class="story-meta">
        <small>Status: ${story.status}</small>
      </div>

    </div>
  `;
}

/* ==============================
   NAVIGATION
============================== */
backBtn.onclick = () => {
  if (currentView === "story") {
    renderStories(stories, "Stories");
  } else {
    contentView.classList.add("hidden");
    hero.classList.remove("hidden");
    cards.classList.remove("hidden");
    backBtn.style.display = "none";
    currentView = "home";
  }
};

submitBtn.onclick = () => {
  hero.classList.add("hidden");
  cards.classList.add("hidden");
  contentView.classList.add("hidden");
  submitView.classList.remove("hidden");
};

submitBackBtn.onclick = () => {
  submitView.classList.add("hidden");
  hero.classList.remove("hidden");
  cards.classList.remove("hidden");
};

/* ==============================
   CATEGORY
============================== */
document.querySelectorAll(".card").forEach(card => {
  card.onclick = () => {
    const category = card.dataset.category;

    loadStories(() => {
      renderStories(
        category === "Stories"
          ? stories
          : stories.filter(s => s.category === category),
        category
      );
    });
  };
});

/* ==============================
   SUBMIT
============================== */
storyForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const btn = this.querySelector("button[type='submit']");
  btn.disabled = true;
  btn.innerText = "Submitting...";

  const formData = new FormData(this);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (res.status === 201) {
      showToast("✅ Story submitted");
      this.reset();

      submitView.classList.add("hidden");
      hero.classList.remove("hidden");
      cards.classList.remove("hidden");

      loadStories();
    } else {
      showToast("❌ Error submitting story");
    }

  } catch {
    showToast("❌ Network error");
  }

  btn.disabled = false;
  btn.innerText = "Submit";
});

/* ==============================
   INIT
============================== */
backBtn.style.display = "none";
loadStories();
``