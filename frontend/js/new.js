import { getAllCategories } from "./funcs/shared.js";

window.addEventListener("load", async () => {
  const showAllCategoriesEl = document.querySelector(".show-categoies");
  const allCategoriesContainerEl = document.querySelector(".box-container");
  const showDescriptionEl = document.querySelector(".switch input");
  const backCategoryBtn = document.querySelector(".back-category-btn");
  const allCategories = await getAllCategories();
  const categoryContainerEl = document.querySelector("#categories-container");
  const categories = allCategories.data.categories;
  let categoryHistory = [];

  showDescriptionEl.addEventListener("change", () => {
    document.querySelectorAll(".category-description").forEach((span) => {
      span.classList.toggle("active", showDescriptionEl.checked);
    });
  });

  window.categoryClickHandler = (categorySlug) => {
    showAllCategoriesEl.classList.remove("active");

    const category = categories.find(
      (category) => category.slug === categorySlug,
    );

    if (category) {
      categoryHistory.push({
        type: "main",
        data: categories,
      });
      const subCategories = category.subCategories;
      allCategoriesContainerEl.innerHTML = "";
      subCategories.map((subCategory) => {
        generateTempelateCategories(subCategory);
      });
      backCategoryBtn.classList.add("back-category-btn--active");
    } else {
      const subCategoriesContainer = categories.flatMap(
        (category) => category.subCategories,
      );
      const parentCategory = categories.find((category) =>
        category.subCategories.some(
          (subCategory) => subCategory.slug === categorySlug,
        ),
      );
      const subCategory = subCategoriesContainer.find(
        (category) => category.slug === categorySlug,
      );
      allCategoriesContainerEl.innerHTML = "";
      if (subCategory.subCategories.length) {
        const subSubCategories = subCategory.subCategories;
        allCategoriesContainerEl.innerHTML = "";
        categoryHistory.push({
          type: "sub",
          data: parentCategory.subCategories,
        });
        subSubCategories.map((subSubCategory) => {
          generateTempelateCategories(subSubCategory);
        });
      } else {
      }
    }
  };

  backCategoryBtn.addEventListener("click", () => {
    const previous = categoryHistory.pop();

    if (previous) {
      allCategoriesContainerEl.innerHTML = "";

      previous.data.map((category) => {
        generateTempelateCategories(category);
      });
    }

    if (categoryHistory.length === 0) {
      backCategoryBtn.classList.remove("back-category-btn--active");
    }
  });

  window.goToRegisterPost = (categorySlug) => {
    location.href = `/frontend/pages/registerPost.html?category=${categorySlug}`;
  };

  const generateTempelateCategories = (category) => {
    const hasChild = category.subCategories?.length > 0;

    allCategoriesContainerEl.insertAdjacentHTML(
      "beforeend",
      `
      <div class="box" onclick="${hasChild ? `categoryClickHandler('${category.slug}')` : `goToRegisterPost('${category.slug}')`}">
          <div class="details">
              <div>
                  <i class="bi bi-house-door"></i>
                  <p>${category.title}</p>
              </div>
              <span class="category-description">${category.description}</span>
          </div>
          ${hasChild ? `<i class="bi bi-chevron-left"></i>` : ""}
      </div>
    `,
    );
  };

  showAllCategoriesEl.addEventListener("click", () => {
    showAllCategoriesEl.classList.remove("active");
    categoryContainerEl.classList.add("active");
    categories.map((category) => {
      generateTempelateCategories(category);
    });
  });
});
