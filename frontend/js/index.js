import {
  getAllCities,
  getAllSocials,
  getCityCookie,
  popularCities,
  setCityCookie,
} from "./funcs/shared.js";

const cityClickHandler = (event, city) => {
  event.preventDefault();
  setCityCookie(city);
  window.location.href = "http://127.0.0.1:5500/frontend/pages/main.html";
};

const loadCityPosts = () => {
  const cityCookie = getCityCookie();

  if (cityCookie) {
    window.location.href = "http://127.0.0.1:5500/frontend/pages/main.html";
  }
};

window.cityClickHandler = cityClickHandler;
let cityList = null;

const search = (event) => {
  const citySearchResults = document.querySelector(".search-result-cities");

  const citySearchTitle = event.target.value;
  const cityResults = cityList.filter((city) =>
    city.name.startsWith(citySearchTitle),
  );

  if (cityResults) {
    citySearchResults.classList.add("active");
    citySearchResults.innerHTML = "";
    cityResults.map((city) => {
      citySearchResults.insertAdjacentHTML(
        "beforeend",
        `
          <li onclick='cityClickHandler(event, ${JSON.stringify({
            id: city.id,
            name: city.name,
          })})'>
            ${city.name}
          </li>
        `,
      );
    });
  }

  if (!citySearchTitle.trim()) {
    citySearchResults.classList.remove("active");
  }
};

window.addEventListener("load", async () => {
  // get popular cities and show
  popularCities().then((response) => {
    const cityWrapper = document.querySelector(".city-wrapper");
    const popularCities = response.data.cities.filter(
      (town) => town.popular === true,
    );

    popularCities.map((city) => {
      console.log(popularCities);
      cityWrapper.insertAdjacentHTML(
        "beforeend",
        `
        <div class="col-2 d-flex justify-content-center">
          <li class="main__cities-item">
            <a class="main__cities-link" onclick='cityClickHandler(event, ${JSON.stringify(
              {
                id: city.id,
                name: city.name,
              },
            )})'>
            ${city.name}
          </a>
        </div>
        `,
      );
    });
  });

  // get city cookie and redirect
  const cityCookie = getCityCookie();
  loadCityPosts(cityCookie);

  // get all cities and search
  const searchInput = document.querySelector(".main__input");
  searchInput.addEventListener("keyup", (event) => search(event));
  cityList = await getAllCities().then((response) => response.data.cities);

  // get socials
  getAllSocials().then((response) => {
    const socialWrapper = document.querySelector(".footer__list");
    response.data.socials.map((social) => {
      socialWrapper.insertAdjacentHTML(
        "beforeend",
        `
          <li class="footer__item">
            <a class="footer__link" href="${social.link}">
              <img src="${social.icon.path}" alt="" class="footer__icon bi-instagram"></img>
            </a>
          </li>
        `,
      );
    });
  });
});
