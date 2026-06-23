import { popularCities, setCityCookie } from "./funcs/shared.js";

const cityClickHandler = (event, city) => {
  event.preventDefault();
  setCityCookie(city);
  window.location.href = `http://127.0.0.1:5500/frontend/pages/main.html?city=${city}`;
};

window.cityClickHandler = cityClickHandler;

window.addEventListener("load", () => {
  popularCities().then((data) => {
    console.log(data);
    const cityWrapper = document.querySelector(".city-wrapper");

    data.map((city) => {
      cityWrapper.insertAdjacentHTML(
        "beforeend",
        `
                <div class="col-2 d-flex justify-content-center">
                    <li class="main__cities-item">
                        <a class="main__cities-link" href="#" onclick = "cityClickHandler(event,'${city.href}')">${city.name}</a>
                    </li>
                </div>
            `,
      );
    });
  });
});
