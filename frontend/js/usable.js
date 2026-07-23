import {
  calcualetRelativeTime,
  getAllCategories,
  getCityCookie,
  getPost,
  getPosts,
  getUrlParam,
  popularCities,
  removeParamFromUrl,
  updateCityCookie,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  // category modal
  const categoryModalBtn = document.querySelector(".header__category-btn");
  const overlayHeader = document.querySelector(".overlay-header");
  const categoryMenu = document.querySelector(".header__category-menu");
  const categoryContainer = document.querySelector(
    ".haeder__category-menu-list",
  );
  const backToAllPosts = document.querySelector(".header__category-menu-btn");

  window.categoryClickHandler = (categoryID) => {
    window.location.href = `http://127.0.0.1:5500/frontend/pages/main.html?category=${categoryID}`;
  };

  backToAllPosts.addEventListener("click", () => {
    removeParamFromUrl("category");
  });

  categoryModalBtn.addEventListener("click", () => {
    categoryMenu.classList.add("header__category-menu--active");
    overlayHeader.classList.add("overlay-header--active");
  });

  overlayHeader.addEventListener("click", () => {
    categoryMenu.classList.remove("header__category-menu--active");
    overlayHeader.classList.remove("overlay-header--active");
  });

  categoryContainer.innerHTML = "";
  getAllCategories().then((res) => {
    res.data.categories.map((category) => {
      categoryContainer.insertAdjacentHTML(
        "beforeend",
        `
          <li class="header__category-menu-item">
            <a class="header__category-menu-link" href="#" onclick="categoryClickHandler('${category.slug}')">
              <div class="header__category-menu-link-right">
                <i class="header__category-menu-icon bi bi-house"></i>
                ${category.title}
              </div>
              <div class="header__category-menu-link-left">
                <i
                  class="header__category-menu-arrow-icon bi bi-chevron-left"
                ></i>
              </div>
            </a>
            <div class="header__category-dropdown">
              <div class="row">
                ${category.subCategories
                  ?.map(
                    (subCategory) =>
                      `<div class="col-4">
                    <ul class="header__category-dropdown-list">
                      <a class="header__category-dropdown-title" href="#" onclick="categoryClickHandler('${subCategory.slug}')">
                        ${subCategory.title}
                      </a>
                      ${subCategory.subCategories
                        ?.map(
                          (subSubCategory) =>
                            `
                        <li class="header__category-dropdown-item" onclick="categoryClickHandler('${subSubCategory.slug}')">
                          <a class="header__category-dropdown-link" href="#">
                            ${subSubCategory.title}
                          </a>
                        </li>
                        `,
                        )
                        .join("")}
                    </ul>
                  </div>`,
                  )
                  .join("")}
              </div>
            </div>
          </li>
        `,
      );
    });
  });

  // get city and show modal
  const headerCityContainer = document.querySelector(".header__country");
  const headerCity = document.querySelector(".header__country-title");
  const modalCity = document.querySelector(".country-modal");
  const closeModalBtn = document.querySelector(".country-modal__close");
  const acceptModalBtn = document.querySelector(
    ".country-modal__accept--active",
  );
  const deleteAllCitiesBtn = document.querySelector(".country-modal__btn");
  const cityHeader = getCityCookie();
  let cityName = null;
  let tempCities = [];
  let posts = null;
  let backupPosts = null;

  window.addToModalHandler = async (cityId) => {
    const cityEl = document.querySelector(`#city-${cityId}`);
    const cityInp = cityEl.querySelector("input");
    const cityTitle = cityEl.querySelector("span").innerHTML;

    if (cityInp.checked) {
      if (!tempCities.some((city) => city.name === cityTitle)) {
        tempCities.push({
          id: cityId,
          name: cityTitle,
        });
      }
    } else {
      tempCities = tempCities.filter((city) => city.name !== cityTitle);
    }
    updateModalCities();
    console.log(tempCities);
  };

  window.cityDeleteHandler = (cityId) => {
    tempCities = tempCities.filter((city) => city.id !== cityId);
    const cityCheckbox = document.querySelector(`#city-${cityId} input`);
    if (cityCheckbox) {
      cityCheckbox.checked = false;
    }
    updateModalCities();
  };

  const findSubCategories = (category, categoryID) => {
    const urlParam = getUrlParam("category");
    const subCategoryInfo = category
      .flatMap((category) => category.subCategories)
      .find((subCategory) => subCategory.slug === urlParam);

    return subCategoryInfo;
  };

  const findSubSubCategories = (category, categoryID) => {
    const urlParam = getUrlParam("category");
    const subSubCategory = category
      .flatMap((categories) => categories.subCategories)
      .flatMap((subCategory) => subCategory.subCategories)
      .find((item) => item.slug === urlParam);

    return subSubCategory;
  };

  const findCategoryIdBySlug = (categories) => {
    const slug = getUrlParam("category");

    const category = categories.find((category) => category.slug === slug);
    if (category) return category._id;

    const subCategory = findSubCategories(categories);
    if (subCategory) return subCategory._id;

    const subSubCategory = findSubSubCategories(categories);
    if (subSubCategory) return subSubCategory._id;

    return null;
  };

  const productWrapper = document.querySelector("#product-wrapper");
  const response = await getAllCategories();
  const allCategories = response.data.categories;
  const searchValue = getUrlParam("q");
  const categpryType = findCategoryIdBySlug(allCategories);

  const renderPosts = (posts) => {
    if (productWrapper) {
      productWrapper.innerHTML = "";
    }

    if (posts.length > 0) {
      posts.forEach((product) => {
        if (productWrapper) {
          productWrapper.insertAdjacentHTML(
            "beforeend",
            `
                <div class="col-4">
                <div class="product-card" onclick="productHandler('${product._id}')">
                    <div class="product-card__right">
                    <div class="product-card__right-top">
                        <a class="product-card__link" href="#">${product.title}</a>
                    </div>
                    <div class="product-card__right-bottom">
                        <span class="product-card__condition">${product.dynamicFields?.[0].data}</span>
                        <span class="product-card__price">${product.price.toLocaleString()} تومان</span>
                        <span class="product-card__time">${calcualetRelativeTime(product.createdAt)}</span>
                    </div>
                    </div>
                    <div class="product-card__left">
                    <i class="product-card__icon bi bi-chat"></i>
                    ${
                      product.pics.length
                        ? `<img class="product-card__img img-fluid"
                            src="https://divarapi.liara.run/${product.pics[0].path}">`
                        : `<img class="product-card__img img-fluid"
                            src="../images/main/no product.png">`
                    }
                    </div>
                </div>
                </div>
                `,
          );
        }
      });
    } else {
      if (productWrapper) {
        productWrapper.insertAdjacentHTML(
          "beforeend",
          `<span>آگهی یافت نشد</span>`,
        );
      }
    }
  };

  const loadPosts = async () => {
    const cityIds = getCityCookie()
      ?.map((city) => city.id)
      .join("|");

    const response = await getPosts(cityIds, categpryType, searchValue);

    posts = response.data.posts;

    backupPosts = [...posts];

    renderPosts(posts);
  };

  const updateHeaderCity = () => {
    let cityText = "";

    if (cityName.length <= 2) {
      cityText = cityName.join("، ");
    } else {
      cityText = `${cityName[0]}، ${cityName[1]} و ${cityName.length - 2} شهر دیگر`;
    }

    headerCity.innerHTML = cityText;
  };

  const initCities = () => {
    if (!cityHeader) {
      window.location.href = "http://127.0.0.1:5500/frontend/pages/index.html";
      return;
    }

    cityName = cityHeader.map((city) => city.name);
    tempCities = [...cityHeader];

    updateHeaderCity();
  };

  const updateModalCities = () => {
    const selectedCityBox = document.querySelector(".country-modal__selected");
    selectedCityBox.innerHTML = "";
    tempCities.map((city) => {
      selectedCityBox.insertAdjacentHTML(
        "beforeend",
        `
          <div class="country-modal__selected-item">
            <span class="country-modal__selected-text">${city.name}</span>
            <button class="country-modal__selected-btn" onclick="cityDeleteHandler(${city.id})">
              <i class="country-modal__selected-icon bi bi-x"></i>
            </button>
          </div>
        `,
      );
    });
  };

  initCities();
  updateModalCities();

  popularCities().then((city) => {
    const popularCities = city.data.cities.filter(
      (town) => town.popular === true,
    );
    popularCities.map((province) => {
      const isChecked = cityName.some((city) => city === province.name);
      const cityList = document.querySelector(".country-modal__cities-list");
      cityList.insertAdjacentHTML(
        "beforeend",
        `
          <li class="country-modal__cities-item" id="${"city-" + province.id}">
              <span>${province.name}</span>
              <input class="country-modal__cities-checkbox" type="checkbox" onchange="addToModalHandler(${province.id})" ${isChecked ? "checked" : ""} ></input>
          </li>
        `,
      );
    });
  });

  headerCityContainer.addEventListener("click", () => {
    modalCity.classList.add("country-modal--active");

    closeModalBtn.addEventListener("click", () => {
      modalCity.classList.remove("country-modal--active");
    });

    acceptModalBtn.addEventListener("click", async () => {
      modalCity.classList.remove("country-modal--active");
      updateCityCookie(tempCities);
      cityName = tempCities.map((city) => city.name);
      updateHeaderCity();
      await loadPosts();
    });
  });

  deleteAllCitiesBtn.addEventListener("click", () => {
    tempCities = [];
    const allCheckBoxes = document.querySelectorAll(
      ".country-modal__cities-checkbox",
    );
    allCheckBoxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    updateModalCities();
  });
});
