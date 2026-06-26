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

  // get all categories
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

  const createSubSubCategories = (subCategory) => {
    return `
      <li>${subCategory.title}</li>
    `;
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

        console.log(subCategory);

        categoryWrapper.insertAdjacentHTML("beforeend", 
          `
            <a class="sidebar__category-link">
              ${subCategory.title}
            </a>
            <div class="subCategories">
              ${subCategory.subCategories.map((subCategory) => createSubCategories(subCategory)).join("")}
            </div>
          `
        )
      } else {
        categoryInfos.map((category) => {
          console.log(category);
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
});
