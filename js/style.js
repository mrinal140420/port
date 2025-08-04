document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPage = window.location.pathname.split("/").pop();
  const overlay = document.createElement("div");
  overlay.className = "page-overlay";
  document.body.appendChild(overlay);

  // 🟢 Highlight Active Nav Link
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 🟣 Intercept Navbar Link Clicks (AJAX overlay load)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("href");

      // Fetch & load page content
      fetch(page)
        .then((res) => res.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const content = doc.querySelector("body").innerHTML;

          overlay.innerHTML = `
            <div class="overlay-inner">
              <button class="overlay-close">&times;</button>
              ${content}
            </div>
          `;

          document.body.classList.add("overlay-open");

          // Close overlay
          overlay.querySelector(".overlay-close").addEventListener("click", () => {
            document.body.classList.remove("overlay-open");
            overlay.innerHTML = "";
          });

          // 🟡 If the loaded page has a portfolio grid → inject from JSON
          const grid = overlay.querySelector(".portfolio-grid");
          if (grid) {
            loadProjects(grid); // ⬅️ Function defined below
          }
        });
    });
  });

  // 🔁 If current page has static portfolio grid (e.g. on portfolio.html load directly)
  const staticGrid = document.querySelector(".portfolio-grid");
  if (staticGrid) {
    loadProjects(staticGrid);
  }
});

// 🔵 Scroll-based effects (placeholder)
window.addEventListener("scroll", () => {
  // Future scroll animations
});

// 🟡 Load Projects from JSON
function loadProjects(container) {
  fetch("assets/data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      container.innerHTML = ""; // Clear existing content

      projects.forEach((project, index) => {
        const aniId = `lottie-${index}`;
        const card = document.createElement("div");
        card.className = "portfolio-card";

        card.innerHTML = `
          <div class="lottie-container" id="${aniId}"></div>
          <div class="portfolio-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.demo}" target="_blank" class="btn-sm">Live</a>
            <a href="${project.github}" target="_blank" class="btn-sm">Code</a>
          </div>
        `;

        container.appendChild(card);

        // 🔁 Load Lottie animation
        lottie.loadAnimation({
          container: document.getElementById(aniId),
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: project.image
        });
      });
    })
    .catch((err) => {
      console.error("Error loading project data:", err);
      container.innerHTML = "<p class='error'>Failed to load projects.</p>";
    });
}
