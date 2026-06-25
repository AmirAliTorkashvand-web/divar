import { getCityCookie, getPosts } from "./funcs/shared.js";

window.addEventListener("load", async () => {
  const cityIds = getCityCookie()?.map((city) => city.id);
  const productWrapper = document.querySelector("#product-wrapper");

  getPosts(cityIds).then((response) => {
    console.log(response.data.posts);
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
                          <span class="product-card__time">لحظاتی پیش</span>
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
    } else{
      productWrapper.insertAdjacentHTML(
        "beforeend",`<span>آگهی یافت نشد</span>`,
      );
    }
  });
});
