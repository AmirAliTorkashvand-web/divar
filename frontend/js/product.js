import {
  calcualetRelativeTime,
  getCookie,
  getPost,
  getToken,
  getUrlParam,
} from "./funcs/shared.js";

window.addEventListener("load", () => {
  const breadcrumbsEl = document.querySelector(".main__breadcrumb");
  const productNameEl = document.querySelector(".product__name");
  const productLocationAndTimeEl = document.querySelector(".product__location");
  const productInfoEl = document.querySelector(".product__info-list");
  const postDescriptionEl = document.querySelector(".product__intro-desc");
  const swiperContainer = document.querySelector(".swiper-container");
  const noteInputEl = document.querySelector(".product-preview__input");
  const loginModalEl = document.querySelector(".login-modal");
  const overlayEl = document.querySelector(".overlay");

  const postID = getUrlParam("post");

  getPost(postID).then((res) => {
    const postDetail = res.data.post;
    console.log(postDetail);

    breadcrumbsEl.insertAdjacentHTML(
      "beforeend",
      `
            <li class="main__breadcrumb-item">
                <a class="main__breadcrumb-link" href="#">
                    ${postDetail.breadcrumbs.category.title}
                    <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
                </a>
            </li>
            <li class="main__breadcrumb-item">
                <a class="main__breadcrumb-link" href="#">
                   ${postDetail.breadcrumbs.subCategory.title}
                    <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
                </a>
            </li>
            <li class="main__breadcrumb-item">
                <a class="main__breadcrumb-link" href="#">
                   ${postDetail.breadcrumbs.subSubCategory.title}
                    <i class="main__breadcrumb-icon bi bi-chevron-left"></i>
                </a>
            </li>
    `,
    );

    postDetail.dynamicFields.map((field) => {
      productInfoEl.insertAdjacentHTML(
        "beforeend",
        `
            <li class="product__info-item">
                <span class="product__info-key">${field.name}</span>
                <span class="product__info-value">${field.data}</span>
            </li>
        `,
      );
    });
    if (postDetail.pics.length) {
      postDetail.pics.forEach((picture) => {
        swiperContainer.insertAdjacentHTML(
          "beforeend",
          `
      <div class="swiper-slide">
        <img src="https://divarapi.liara.run/${picture.path}" class="product-preview__slider-img">
      </div>
      `,
        );
      });
    } else {
      swiperContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="swiper-slide">
          <img class="product-preview__slider-img" src="../images/main/no product.png">
        </div>
        `,
      );
    }

    const isLogin = getCookie("user");
    let noteID = null;

    if (isLogin) {
      if (postDetail.note) {
        noteInputEl.value = postDetail.note.content;
        noteID = postDetail.note._id;
      }

      noteInputEl.addEventListener("blur", async (event) => {
        if (postDetail.note) {
          const res = await fetch(
            `https://divarapi.liara.run/v1/note/${noteID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
              },
              body: JSON.stringify({
                content: event.target.value,
              }),
            },
          );
          console.log(res);
        } else {
          const res = await fetch("https://divarapi.liara.run/v1/note/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              postId: postDetail._id,
              content: event.target.value,
            }),
          });
          const data = await res.json();
          const dataNote = data.data.note;
          noteID = dataNote._id;
          postDetail.note = data.data.note;
        }
      });
    } else {
      noteInputEl.addEventListener("click", () => {
        loginModalEl.classList.add("login-modal--active");
        overlayEl.classList.add("overlay--active");
      });
    }

    productNameEl.innerHTML = postDetail.title;
    productLocationAndTimeEl.innerHTML = `${calcualetRelativeTime(postDetail.updatedAt)} در ${postDetail.city.name} , ${postDetail.neighborhood.name}`;
    postDescriptionEl.innerHTML = postDetail.description;
  });
});
