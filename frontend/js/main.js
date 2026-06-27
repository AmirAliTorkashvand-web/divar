import {
  addParamToUrl,
  calcualetRelativeTime,
  getAllCategories,
  getCityCookie,
  getPosts,
  getUrlParam,
} from "./funcs/shared.js";

window.categoryClickHandler = (categoryID) => {
  addParamToUrl("category", categoryID);
};

window.addEventListener("load", async () => {
  // get all posts
  const cityIds = getCityCookie()?.map((city) => city.id);
  const productWrapper = document.querySelector("#product-wrapper");

  getPosts(cityIds).then((response) => {
    productWrapper.innerHTML = "";

    if (response.data.posts.length > 0) {
      response.data.posts.map((product) => {
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
  });

  // get all categories and sub categories and filters
  const categoryWrapper = document.querySelector(".sidebar__category-item");

  const findSubCategories = (category, categoryID) => {
    const urlParam = getUrlParam("category");
    const subCategoryInfo = category
      .flatMap((category) => category.subCategories)
      .find((subCategory) => subCategory.slug === urlParam);

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
                  <select name="" id="">
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

  inputEl.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      if (event.target.value.trim()) {
        addParamToUrl("q", event.target.value.trim());
      }
    }
  });
});
