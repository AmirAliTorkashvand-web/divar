import {
  addParamToUrl,
  calcualetRelativeTime,
  getAllCategories,
  getCityCookie,
  getPosts,
  getUrlParam,
  removeParamFromUrl,
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

  window.productHandler = (productID) => {
    window.location.href = `product.html?post=${productID}`;
  };

  const renderPosts = (posts) => {
    productWrapper.innerHTML = "";

    console.log(posts);
    if (posts.length > 0) {
      posts.forEach((product) => {
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
});
