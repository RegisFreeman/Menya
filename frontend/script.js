console.log("Menya script loaded ✅");

let knowledgeBase = [];

/* =========================
   ELEMENTS
========================= */
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

const heroSection = document.querySelector(".hero");
const cardsSection = document.querySelector(".cards");
const contentView = document.getElementById("contentView");
const sectionTitle = document.getElementById("sectionTitle");
const sectionContent = document.getElementById("sectionContent");
const backBtn = document.querySelector(".back-btn");

/* =========================
   LOAD DATA
========================= */
fetch("./data/articles.json")
  .then(response => response.json())
  .then(data => {
    knowledgeBase = data;
    console.log("Articles loaded ✅");
  })
  .catch(error => {
    console.error("Failed to load articles:", error);
  });

/* =========================
   VIEW HELPERS
========================= */
function showArticle(article) {
  heroSection.classList.add("hidden");
  cardsSection.classList.add("hidden");

  sectionTitle.textContent = article.title;
  sectionContent.innerHTML = `
    <p><strong>Category:</strong> ${article.category}</p>
    <p style="margin-top: 16px;">${article.content}</p>
  `;

  contentView.classList.remove("hidden");
}

/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  resultsContainer.innerHTML = "";

  if (!query || knowledgeBase.length === 0) return;

  const matches = knowledgeBase.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.category.toLowerCase().includes(query) ||
    article.content.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML =
      '<p class="no-results">No results found</p>';
    return;
  }

  matches.forEach(article => {
    const result = document.createElement("div");
    result.className = "result-item";
    result.innerHTML = `
      <strong>${article.title}</strong>
      <span>${article.category}</span>
      <p>${article.content.substring(0, 80)}...</p>
    `;

    result.addEventListener("click", () => showArticle(article));
    resultsContainer.appendChild(result);
  });
});

/* =========================
   CARD NAVIGATION
========================= */
const sections = {
  knowledge: "Knowledge Base",
  lineage: "Family Lineage",
  history: "History & Heritage"
};

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    heroSection.classList.add("hidden");
    cardsSection.classList.add("hidden");

    sectionTitle.textContent = sections[card.dataset.section];
    sectionContent.innerHTML =
      "<p>Use the search bar to explore articles in this section.</p>";

    contentView.classList.remove("hidden");
  });
});

/* =========================
   BACK
========================= */
backBtn.addEventListener("click", () => {
  contentView.classList.add("hidden");
  heroSection.classList.remove("hidden");
  cardsSection.classList.remove("hidden");
  searchInput.value = "";
  resultsContainer.innerHTML = "";
});
