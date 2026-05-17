const API_URL = "http://127.0.0.1:8000/api/stories/";

console.log("API URL:", API_URL);

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

/* ==============================
   LOAD STORIES
============================== */
function loadStories(callback) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      stories = data;
      if (callback) callback();
    })
    .catch(err => console.error("Load error:", err));
}

/* ==============================
   RENDER STORIES
============================== */
function renderStories(list, title) {
  hero.classList.add("hidden");
  cards.classList.add("hidden");
  submitView.classList.add("hidden");

  contentView.classList.remove("hidden");
  sectionTitle.textContent = title;

  sectionContent.innerHTML = list.length
    ? list.map(story => `
      <div class="story">
        <h3>${story.title}</h3>
        <p>${story.content}</p>
        <small>Status: ${story.status}</small>
      </div>
    `).join("")
    : "<p>No stories yet.</p>";
}

/* ==============================
   NAVIGATION
============================== */
submitBtn.onclick = () => {
  hero.classList.add("hidden");
  cards.classList.add("hidden");
  contentView.classList.add("hidden");
  submitView.classList.remove("hidden");
};

backBtn.onclick = () => {
  contentView.classList.add("hidden");
  hero.classList.remove("hidden");
  cards.classList.remove("hidden");
};

submitBackBtn.onclick = () => {
  submitView.classList.add("hidden");
  hero.classList.remove("hidden");
  cards.classList.remove("hidden");
};

/* ==============================
   CATEGORY FILTER
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
   ✅ CLEAN STABLE SUBMIT HANDLER
============================== */
storyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  console.log("✅ FORM EVENT TRIGGERED");

  const formData = new FormData(this);

  const btn = this.querySelector("button[type='submit']");
  btn.innerText = "Submitting...";
  btn.disabled = true;

  console.log("➡️ Sending request to:", API_URL);

  fetch(API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => {
      console.log("⬅️ STATUS:", res.status);

      if (res.status === 201) {
        alert("✅ Story saved successfully");
        this.reset();
      } else {
        alert("❌ Server error: " + res.status);
      }
    })
    .catch(err => {
      console.error("❌ FETCH ERROR:", err);
      alert("❌ Network issue");
    })
    .finally(() => {
      btn.innerText = "Submit";
      btn.disabled = false;
    });
});

/* ==============================
   INIT
============================== */
loadStories();