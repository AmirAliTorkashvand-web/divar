import { popularCities } from "./funcs/shared.js";

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
                        <a class="main__cities-link" href="${city.href}">${city.name}</a>
                    </li>
                </div>
            `,
      );
    });
  });
});
