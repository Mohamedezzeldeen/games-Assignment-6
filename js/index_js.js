class Game {
    constructor(id, title, genre, platform, status, description, thumbnail, gameUrl) {
      this.id = id;
      this.title = title;
      this.genre = genre;
      this.platform = platform;
      this.status = status;
      this.description = description;
      this.thumbnail = thumbnail;
      this.gameUrl = gameUrl;
    }
  }
  
  class UI {
    static displayGames(games) {
      const cardsContainer = document.querySelector(".row");
      let cardsHTML = "";
  
      games.forEach(game => {
        cardsHTML += `
          <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="card bg-transparent px-3 pt-3" data-id="${game.id}">
              <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}">
              <div class="card-body px-0">
                <div class="d-flex justify-content-between">
                  <h5 class="card-title text-white">${game.title}</h5>
                  <span class="badge bg-primary">Free</span>
                </div>
                <p class="card-text text-center opacity-50">
                  ${game.description.split(" ").slice(0, 10).join(" ")}...
                </p>
              </div>
              <div class="card-footer d-flex justify-content-between px-0">
                <small class="text-white badge rounded-pill text-bg-secondary">${game.genre}</small>
                <small class="text-white badge rounded-pill text-bg-secondary">${game.platform}</small>
              </div>
            </div>
          </div>
        `;
      });
  
      cardsContainer.innerHTML = cardsHTML;
    }
  
    static displayDetails(game) {
      document.getElementById("cardImageDetId").setAttribute("src", game.thumbnail);
      document.getElementById("titleId").innerText = `Title: ${game.title}`;
      document.getElementById("categoryId").innerHTML = `Category: <span class="badge bg-primary">${game.genre}</span>`;
      document.getElementById("platformId").innerHTML = `Platform: <span class="badge bg-primary">${game.platform}</span>`;
      document.getElementById("statusId").innerHTML = `Status: <span class="badge bg-primary">${game.status}</span>`;
      document.getElementById("descriptionId").innerText = game.description;
      document.getElementById("gameLinkId").setAttribute("href", game.gameUrl);
  
      // Show/hide sections
      document.getElementById("secOfDet").style.display = "block";
      document.getElementById("mainIdSec").style.display = "none";
      document.getElementById("headerId").classList.add("d-none")
      document.getElementById("navId").classList.add("d-none")
    }
  }
  
  class App {
    static async fetchGames(category = "mmorpg") {
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "d2d7a5dddbmshffc99fd518f2334p17fc87jsne5e96c8c8c82",
          "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com"
        }
      };
  
      const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`, options);
      const gamesData = await response.json();
      return gamesData.map(game => new Game(
        game.id,
        game.title,
        game.genre,
        game.platform,
        game.status,
        game.short_description,
        game.thumbnail,
        game.game_url
      ));
    }
  
    static async fetchGameDetails(id) {
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "d2d7a5dddbmshffc99fd518f2334p17fc87jsne5e96c8c8c82",
          "x-rapidapi-host": "free-to-play-games-database.p.rapidapi.com"
        }
      };
  
      const response = await fetch(`https://free-to-play-games-database.p.rapidapi.com/api/game?id=${id}`, options);
      const game = await response.json();
      return new Game(
        game.id,
        game.title,
        game.genre,
        game.platform,
        game.status,
        game.description,
        game.thumbnail,
        game.game_url
      );
    }
  
    static async init() {
      const games = await this.fetchGames();
      UI.displayGames(games);
  
      document.querySelector(".row").addEventListener("click", async (e) => {
        const card = e.target.closest(".card");
        if (card) {
          const gameId = card.dataset.id;
          const details = await this.fetchGameDetails(gameId);
          UI.displayDetails(details);
        }
      });
  
      document.getElementById("closeDetId").addEventListener("click", () => {
        // إخفاء صفحة التفاصيل
        document.getElementById("secOfDet").style.display = "none";
        
        // إعادة إظهار الصفحة الرئيسية
        document.getElementById("mainIdSec").style.display = "block";
        document.getElementById("headerId").classList.remove("d-none");
        document.getElementById("navId").classList.remove("d-none");
      });
  
      const navLinks = document.querySelectorAll(".nav-link");
      navLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
          navLinks.forEach(nav => nav.classList.remove("active"));
          e.target.classList.add("active");
          const category = e.target.id;
          const games = await this.fetchGames(category);
          UI.displayGames(games);
        });
      });
    }
  }
  
  // Initialize the application
  App.init();
  


// إظهار الـ Loader عند بدء التحميل
document.getElementById("loader").style.visibility = "visible";

// إخفاء الـ Loader عند الانتهاء
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.visibility = "hidden";
    }, 500); // وقت الإخفاء متزامن مع CSS transition
});
