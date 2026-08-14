/* ==========================================================================
   INSTRUMENTS CATALOG RENDERER & SEARCH SYSTEM
   Unified search, category tab filtering, and instant rendering for all instruments.
   ========================================================================== */

(function () {
  "use strict";

  let currentCategory = "all";
  let currentQuery = "";

  const inventoryGrid = document.getElementById("inventory-grid");
  const inventoryEmpty = document.getElementById("inventory-empty");
  const inventoryCount = document.getElementById("inventory-count");
  const heroSearchInput = document.getElementById("hero-search");
  const inventorySearchInput = document.getElementById("inventory-search");
  const heroClearBtn = document.getElementById("search-clear-btn");
  const inventoryClearBtn = document.getElementById("inventory-search-clear");

  function getCategoryMatch(entryCategory, selectedCategory) {
    const entryCat = (entryCategory || "").toLowerCase().trim();
    const selCat = (selectedCategory || "").toLowerCase().trim();

    if (selCat === "all") return true;
    if (selCat === "harmonium" || selCat === "harmoniums" || selCat === "keys") {
      return entryCat === "harmonium" || entryCat === "keys";
    }
    if (selCat === "flute" || selCat === "flutes") {
      return entryCat === "flute";
    }
    if (selCat === "wind") {
      return entryCat === "wind" || entryCat === "flute";
    }
    if (selCat === "drums" || selCat === "drum") {
      return entryCat === "drums" || entryCat === "drum";
    }
    if (selCat === "strings" || selCat === "string") {
      return entryCat === "strings" || entryCat === "string";
    }
    if (selCat === "percussion") {
      return entryCat === "percussion" || entryCat === "drums";
    }
    return entryCat === selCat;
  }

  function filterStaticProductCards(needle) {
    const productCards = document.querySelectorAll(".product-card");
    let matchCount = 0;

    productCards.forEach((card) => {
      const cardCat = card.getAttribute("data-category") || "";
      const text = card.textContent.toLowerCase();
      const catMatch = getCategoryMatch(cardCat, currentCategory);
      const nameMatch = !needle || text.includes(needle);

      const isMatch = catMatch && nameMatch;
      card.classList.toggle("is-hidden", !isMatch);
      if (isMatch) {
        card.classList.add("is-visible");
        matchCount++;
      }
    });
    return matchCount;
  }

  function updateSearchUIState(query) {
    currentQuery = query;
    const needle = query.trim().toLowerCase();
    const hasQuery = needle.length > 0;

    // Sync input values
    if (heroSearchInput && heroSearchInput.value !== query) heroSearchInput.value = query;
    if (inventorySearchInput && inventorySearchInput.value !== query) inventorySearchInput.value = query;

    // Show/hide clear buttons
    if (heroClearBtn) heroClearBtn.hidden = !hasQuery;
    if (inventoryClearBtn) inventoryClearBtn.hidden = !hasQuery;

    // Highlight active pill if matched
    document.querySelectorAll(".search-pill").forEach((pill) => {
      const pillQuery = (pill.getAttribute("data-query") || "").toLowerCase();
      const isActive = hasQuery && needle === pillQuery;
      pill.classList.toggle("is-active", isActive);
    });

    renderInventory();
  }

  function renderInventory() {
    const needle = currentQuery.trim().toLowerCase();
    const staticMatchCount = filterStaticProductCards(needle);

    if (!inventoryGrid) return;

    const entries = window.inventoryEntries || [];

    const filtered = entries.filter((entry) => {
      const catMatch = getCategoryMatch(entry.category, currentCategory);
      const nameMatch = !needle ||
        entry.name.toLowerCase().includes(needle) ||
        entry.category.toLowerCase().includes(needle);
      return catMatch && nameMatch;
    });

    inventoryGrid.innerHTML = "";

    const totalMatches = filtered.length + staticMatchCount;

    if (filtered.length === 0 && staticMatchCount === 0) {
      if (inventoryEmpty) {
        inventoryEmpty.hidden = false;
        inventoryEmpty.innerHTML = `
          <div class="empty-state-card">
            <span class="empty-icon">🔍</span>
            <h3>No instruments found matching "${escapeHtml(currentQuery)}"</h3>
            <p>Try searching for a different instrument like <em>Harmonium</em>, <em>Flute</em>, <em>Bangoes</em>, <em>Guitar</em>, or clear your filters.</p>
            <button type="button" class="btn btn-outline btn-sm" id="reset-search-btn">Clear Search & Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById("reset-search-btn");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            currentCategory = "all";
            document.querySelectorAll(".filter-tab").forEach((t) => {
              const isAll = t.getAttribute("data-filter") === "all";
              t.classList.toggle("is-active", isAll);
              t.setAttribute("aria-selected", String(isAll));
            });
            updateSearchUIState("");
          });
        }
      }
      if (inventoryCount) inventoryCount.textContent = "Showing 0 instruments";
      return;
    }

    if (inventoryEmpty) inventoryEmpty.hidden = true;
    if (inventoryCount) {
      const total = filtered.length;
      inventoryCount.textContent = `Showing ${total} collection item${total === 1 ? "" : "s"}`;
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach((entry, index) => {
      const card = document.createElement("article");
      card.className = "glass-card inventory-card reveal is-visible";
      if (index % 3 === 1) card.classList.add("reveal-delay-1");
      if (index % 3 === 2) card.classList.add("reveal-delay-2");

      const displayCategory = entry.category || "Instrument";
      const fallbackImg = "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop";

      card.innerHTML = `
        <div class="inventory-media">
          <img src="${entry.image}" alt="${escapeHtml(entry.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImg}';" />
        </div>
        <div class="inventory-content">
          <span class="inventory-tag">${escapeHtml(displayCategory)}</span>
          <h3>${highlightMatch(entry.name, needle)}</h3>
          <p>Available in our Sowcarpet showroom collection and ready for trial.</p>
          <a href="contact.html?instrument=${encodeURIComponent(entry.name)}" class="btn btn-outline btn-sm">Enquire Now</a>
        </div>
      `;

      fragment.appendChild(card);
    });

    inventoryGrid.appendChild(fragment);
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = escapeHtml(query);
    const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return escapedText.replace(regex, "<mark class='search-highlight'>$1</mark>");
  }

  // Setup tab filter listeners
  function initFilterTabs() {
    const tabs = document.querySelectorAll(".filter-tab");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        currentCategory = tab.getAttribute("data-filter") || "all";
        renderInventory();
      });
    });
  }

  // Setup search listeners & shortcuts
  function initSearchListeners() {
    [heroSearchInput, inventorySearchInput].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", (e) => {
        updateSearchUIState(e.target.value);
      });
    });

    [heroClearBtn, inventoryClearBtn].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener("click", () => {
        updateSearchUIState("");
        if (heroSearchInput) heroSearchInput.focus();
      });
    });

    // Suggestion pills
    document.querySelectorAll(".search-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const query = pill.getAttribute("data-query") || "";
        updateSearchUIState(query);
      });
    });

    // Global "/" key shortcut to focus search input
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement !== heroSearchInput && document.activeElement !== inventorySearchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        const activeInput = heroSearchInput || inventorySearchInput;
        if (activeInput) {
          activeInput.focus();
          activeInput.select();
        }
      }
    });
  }

  // Initialize page logic
  document.addEventListener("DOMContentLoaded", () => {
    initFilterTabs();
    initSearchListeners();

    // Check for hash in URL (e.g., instruments.html#drums)
    const hash = window.location.hash.replace("#", "").toLowerCase().trim();
    if (hash) {
      const tabs = document.querySelectorAll(".filter-tab");
      const targetTab = Array.from(tabs).find((t) => (t.getAttribute("data-filter") || "").toLowerCase() === hash);
      if (targetTab) {
        targetTab.click();
      } else {
        updateSearchUIState(hash);
      }
    } else {
      renderInventory();
    }
  });

  window.KMM_RENDER_INVENTORY = renderInventory;
  window.KMM_SET_SEARCH = updateSearchUIState;
})();
