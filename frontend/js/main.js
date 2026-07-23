import {
  addParamToUrl,
  calcualetRelativeTime,
  getAllCategories,
  getAllCities,
  getCityCookie,
  getPosts,
  getUrlParam,
  popularCities,
  removeCityCookie,
  removeParamFromUrl,
  setCityCookie,
  updateCityCookie,
} from "./funcs/shared.js";

window.categoryClickHandler = (categoryID) => {
  addParamToUrl("category", categoryID);
};

window.addEventListener("load", async () => {
  let posts = null;
  let backupPosts = null;
  let appliedFIlters = {};
  window.selectBoxFilterHandler = (value, slug) => {
    appliedFIlters[slug] = value;
    console.log({ slug, value });
    filterPosts(posts);
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

  // get all posts
  const productWrapper = document.querySelector("#product-wrapper");

  const response = await getAllCategories();
  const allCategories = response.data.categories;
  const categpryType = findCategoryIdBySlug(allCategories);
  const searchValue = getUrlParam("q");

  const renderPosts = (posts) => {
    productWrapper.innerHTML = "";

    if (posts.length > 0) {
      posts.forEach((product) => {
        productWrapper.insertAdjacentHTML(
          "beforeend",
          `
        <div class="col-4">
          <div class="product-card">
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
      });
    } else {
      productWrapper.insertAdjacentHTML(
        "beforeend",
        `<span>آگهی یافت نشد</span>`,
      );
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
  await loadPosts();

  // get all categories and sub categories and filters
  const categoryWrapper = document.querySelector(".sidebar__category-item");

  const findSubCategorieParent = (category, categoryID) => {
    const subCategoryInfo = category
      .flatMap((category) => category.subCategories)
      .find((subID) => subID._id === categoryID);

    return subCategoryInfo;
  };

  const createSubCategories = (subCategory) => {
    return `
      <li onclick="categoryClickHandler('${subCategory.slug}')">${subCategory.title}</li>
    `;
  };

  const createFilterOptions = (options) => {
    return options
      .map(
        (option) => `
        <option value="${option}">${option}</option>
      `,
      )
      .join("");
  };

  const createSubSubCategories = (subCategory) => {
    return `
      <li>${subCategory.title}</li>
    `;
  };

  const renderFilters = (category) => {
    const allFilters = category.filters;

    if (allFilters.length > 0) {
      const filtersContainer = document.querySelector(".sidebar__filters");
      allFilters.map((filter) => {
        const filterOptions = filter.options;
        if (filter.type === "selectbox") {
          filtersContainer.insertAdjacentHTML(
            "beforeend",
            `
              <div class="sidebar__filter">
                <div class="sidebar__filter-title-wrapper">
                  <i class="sidebar__filter-icon bi bi-chevron-down"></i>
                  <span class="sidebar__filter-title">${filter.name}</span>
                </div>
                <div class="sidebar__filter-price sidebar__filter-item">
                  <select name="" id="" class="sidebar__filter-price-input" onChange="selectBoxFilterHandler(event.target.value , '${filter.slug}')">
                    ${createFilterOptions(filterOptions)}
                  </select>
                  
                </div>
              </div>
            `,
          );
        }
      });
    } else {
      return;
    }
  };

  getAllCategories().then((response) => {
    const categoryName = getUrlParam("category");

    if (categoryName) {
      const categoryInfos = response.data.categories.filter(
        (category) => category.slug === categoryName,
      );

      if (!categoryInfos.length) {
        const subCategory = findSubCategories(
          response.data.categories,
          categoryName,
        );

        if (subCategory) {
          renderFilters(subCategory);

          categoryWrapper.insertAdjacentHTML(
            "beforeend",
            `
              <a class="sidebar__category-link">
                ${subCategory.title}
              </a>
              <div class="subCategories">
                ${subCategory.subCategories.map((subCategory) => createSubCategories(subCategory)).join("")}
              </div>
            `,
          );
          console.log(subCategory);
        } else {
          let subCategoryID = null;
          const subSubCategories = findSubSubCategories(
            response.data.categories,
            categoryName,
          );

          subCategoryID = subSubCategories.parent;

          const subCategoryParent = findSubCategorieParent(
            response.data.categories,
            subCategoryID,
          );

          categoryWrapper.insertAdjacentHTML(
            "beforeend",
            `
              <a class="sidebar__category-link">
                ${subSubCategories.title}
              </a>
              <div class="subCategories">
                ${subCategoryParent.title}
              </div>
            `,
          );
        }
      } else {
        categoryInfos.map((category) => {
          renderFilters(category);
          categoryWrapper.insertAdjacentHTML(
            "beforeend",
            `
            <a class="sidebar__category-link" href="#" onclick="categoryClickHandler('${category.slug}')">
              ${category.title}
            </a>
            <div class="subCategories">
              ${category.subCategories.map((subCategory) => createSubCategories(subCategory)).join("")}
            </div>
            `,
          );
        });
      }
    } else {
      response.data.categories.map((category) => {
        categoryWrapper.insertAdjacentHTML(
          "beforeend",
          `
            <a class="sidebar__category-link" href="#" onclick="categoryClickHandler('${category.slug}')">
              ${category.title}
            </a>
          `,
        );
      });
    }
  });

  // search in posts
  const inputEl = document.querySelector(".header__form-input");
  const dropdownEl = document.querySelector(".header__searchbar-dropdown");
  const crossEl = document.querySelector(".cross-svg");

  inputEl.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (event.target.value.trim()) {
        addParamToUrl("q", event.target.value.trim());
      }
    }
  });
  const inputValue = getUrlParam("q");
  if (inputValue) {
    inputEl.value = inputValue;
  }
  crossEl.addEventListener("mousedown", (event) => {
    inputEl.value = "";
    removeParamFromUrl("q");
  });
  inputEl.addEventListener("focus", () => {
    crossEl.classList.add("header__searchbar-dropdown-active");
    dropdownEl.classList.add("header__searchbar-dropdown-active");
  });

  inputEl.addEventListener("blur", () => {
    crossEl.classList.remove("header__searchbar-dropdown-active");
    dropdownEl.classList.remove("header__searchbar-dropdown-active");
  });

  // photo and exchange and min max filter
  const photoController = document.querySelector("#photo-contoller");
  const exchangeController = document.querySelector("#exchange-contoller");
  const minPrice = document.querySelector(".sidebar__filter-price-input-min");
  const maxPrice = document.querySelector(".sidebar__filter-price-input-max");

  const filterPosts = (posts) => {
    let filteredPosts = [...backupPosts];

    for (const slug in appliedFIlters) {
      console.log("slug -> ", slug);

      filteredPosts = filteredPosts.filter((post) => {
        return post.dynamicFields.some(
          (field) => field.slug === slug && field.data === appliedFIlters[slug],
        );
      });
    }

    if (photoController.checked) {
      filteredPosts = filteredPosts.filter((post) => post.pics.length > 0);
    }

    if (exchangeController.checked) {
      filteredPosts = filteredPosts.filter((post) => post.exchange);
    }

    const minValue = minPrice.value;
    const maxValue = maxPrice.value;

    if (minValue !== "default") {
      const min = Number(minValue);

      if (maxValue !== "default") {
        const max = Number(maxValue);

        filteredPosts = filteredPosts.filter(
          (post) => post.price >= min && post.price <= max,
        );
      } else {
        filteredPosts = filteredPosts.filter((post) => post.price >= min);
      }
    } else if (maxValue !== "default") {
      const max = Number(maxValue);

      filteredPosts = filteredPosts.filter((post) => post.price <= max);
    }

    renderPosts(filteredPosts);
  };

  minPrice?.addEventListener("change", () => {
    filterPosts(posts);
  });
  maxPrice?.addEventListener("change", () => {
    filterPosts(posts);
  });
  photoController.addEventListener("change", (event) => {
    filterPosts(posts);
  });
  exchangeController.addEventListener("change", (event) => {
    filterPosts(posts);
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

  // category modal
  const categoryModalBtn = document.querySelector(".header__category-btn");
  const overlayHeader = document.querySelector(".overlay-header");
  const categoryMenu = document.querySelector(".header__category-menu");
  const categoryContainer = document.querySelector(
    ".haeder__category-menu-list",
  );
  const backToAllPosts = document.querySelector(".header__category-menu-btn");

  backToAllPosts.addEventListener("click", () => {
    removeParamFromUrl("category")
  })

  categoryModalBtn.addEventListener("click", () => {
    categoryMenu.classList.add("header__category-menu--active");
    overlayHeader.classList.add("overlay-header--active");
  });

  overlayHeader.addEventListener("click", () => {
    categoryMenu.classList.remove("header__category-menu--active");
    overlayHeader.classList.remove("overlay-header--active");
  });

  getAllCategories().then((res) => {
    console.log(res.data.categories);
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
                ${category.subCategories?.map(
                    (subCategory) =>
                      `<div class="col-4">
                    <ul class="header__category-dropdown-list">
                      <a class="header__category-dropdown-title" href="#" onclick="categoryClickHandler('${subCategory.slug}')">
                        ${subCategory.title}
                      </a>
                      ${subCategory.subCategories?.map(
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
});
