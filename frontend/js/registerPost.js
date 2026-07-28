import {
  getAllSubCategories,
  getToken,
  getUrlParam,
  popularCities,
  showSwal,
} from "./funcs/shared.js";

window.addEventListener("load", async () => {
  const categoryNameEl = document.querySelector(".category_details p");
  const cityContainerEl = document.querySelector("#slct");
  const neighbourContainerEl = document.querySelector("#slct-neighbour");
  const uploaderInputEl = document.querySelector(".uploader-box input");
  const uploadedImagesEl = document.querySelector(".box-img");
  const priceResultEl = document.querySelector(".price-result");
  const priceInputEl = document.querySelector("#price");
  const postTitleEl = document.querySelector(".post-title");
  const postDescriptionEl = document.querySelector(".post-description");
  const groupsEl = document.querySelector(".groups");
  const mapIconControllEl = document.querySelector(".icon-controll");
  const submitBtn = document.querySelector(".submit-btn");
  const exchangeEls = document.querySelectorAll('input[name="exchange"]');
  const categorySlug = getUrlParam("category");
  const allSubcategories = await getAllSubCategories();
  const subCategories = allSubcategories.data.categories;
  const subCategory = subCategories.find(
    (category) => category.slug === categorySlug,
  );
  console.log(subCategory);

  let city;
  let neighborhood;
  let mapDetail = { x: null, y: null };
  let markerIcon = null;
  let iconStatus = "FIRST_ICON";
  let provinceID;
  let postPics = [];
  let price;
  let exchange = false;
  let postTitle;
  let postDescription;
  let categoryFields = {};
  let map = L.map("map").setView([35.715298, 51.404343], 13);

  let firstIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjciIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNyA0OCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBpbi1hIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0E2MjYyNiIgc3RvcC1vcGFjaXR5PSIuMzIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQTYyNjI2Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9InBpbi1jIiBkPSJNMTguNzk0MzMzMywxNC40NjA0IEMxOC43OTQzMzMzLDE3LjQwNTQ1OTkgMTYuNDA3NDQ5NiwxOS43OTM3MzMzIDEzLjQ2MDEwNDcsMTkuNzkzNzMzMyBDMTAuNTE0NTUwNCwxOS43OTM3MzMzIDguMTI3NjY2NjcsMTcuNDA1NDU5OSA4LjEyNzY2NjY3LDE0LjQ2MDQgQzguMTI3NjY2NjcsMTEuNTE1MzQwMSAxMC41MTQ1NTA0LDkuMTI3MDY2NjcgMTMuNDYwMTA0Nyw5LjEyNzA2NjY3IEMxNi40MDc0NDk2LDkuMTI3MDY2NjcgMTguNzk0MzMzMywxMS41MTUzNDAxIDE4Ljc5NDMzMzMsMTQuNDYwNCIvPgogICAgPGZpbHRlciBpZD0icGluLWIiIHdpZHRoPSIyMzEuMiUiIGhlaWdodD0iMjMxLjIlIiB4PSItNjUuNiUiIHk9Ii00Ni45JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij4KICAgICAgPGZlT2Zmc2V0IGR5PSIyIiBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIxIi8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd0JsdXJPdXRlcjEiIHN0ZERldmlhdGlvbj0iMiIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0ic2hhZG93Qmx1ck91dGVyMSIgdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMjQgMCIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSJ1cmwoI3Bpbi1hKSIgZD0iTTEzLjA3MzcsMS4wMDUxIEM1LjgwMzIsMS4yMTUxIC0wLjEzOTgsNy40Njg2IDAuMDAyNywxNC43MzkxIEMwLjEwOTIsMjAuMTkwMSAzLjQ1NTcsMjQuODQ2MSA4LjE5NTcsMjYuODYzNiBDMTAuNDUzMiwyNy44MjUxIDExLjk3MTIsMjkuOTc0NiAxMS45NzEyLDMyLjQyODYgTDExLjk3MTIsMzkuNDExNTUxNCBDMTEuOTcxMiw0MC4yMzk1NTE0IDEyLjY0MTcsNDAuOTExNTUxNCAxMy40NzEyLDQwLjkxMTU1MTQgQzE0LjI5OTIsNDAuOTExNTUxNCAxNC45NzEyLDQwLjIzOTU1MTQgMTQuOTcxMiwzOS40MTE1NTE0IEwxNC45NzEyLDMyLjQyNTYgQzE0Ljk3MTIsMzAuMDEyMSAxNi40MTcyLDI3LjgzNDEgMTguNjQ0NywyNi45MDU2IEMyMy41MTY3LDI0Ljg3NzYgMjYuOTQxMiwyMC4wNzYxIDI2Ljk0MTIsMTQuNDcwNiBDMjYuOTQxMiw2Ljg5ODYgMjAuNjkzNywwLjc4NjEgMTMuMDczNywxLjAwNTEgWiIvPgogICAgPHBhdGggZmlsbD0iI0E2MjYyNiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTMuNDcwNiw0Ny44MTIgQzEyLjU1NTYsNDcuODEyIDExLjgxNDYsNDcuMDcxIDExLjgxNDYsNDYuMTU2IEMxMS44MTQ2LDQ1LjI0MSAxMi41NTU2LDQ0LjUgMTMuNDcwNiw0NC41IEMxNC4zODU2LDQ0LjUgMTUuMTI2Niw0NS4yNDEgMTUuMTI2Niw0Ni4xNTYgQzE1LjEyNjYsNDcuMDcxIDE0LjM4NTYsNDcuODEyIDEzLjQ3MDYsNDcuODEyIFoiLz4KICAgIDx1c2UgZmlsbD0iIzAwMCIgZmlsdGVyPSJ1cmwoI3Bpbi1iKSIgeGxpbms6aHJlZj0iI3Bpbi1jIi8+CiAgICA8dXNlIGZpbGw9IiNGRkYiIHhsaW5rOmhyZWY9IiNwaW4tYyIvPgogIDwvZz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  let secondIcon = L.icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNSA0OUMxMS44IDQ5IDEgMzguMiAxIDI1QzEgMTEuOCAxMS44IDEgMjUgMUMzOC4yIDEgNDkgMTEuOCA0OSAyNUM0OSAzOC4yIDM4LjIgNDkgMjUgNDlaTTI1IDUuOEMxNC40NCA1LjggNS44IDE0LjQ0IDUuOCAyNUM1LjggMzUuNTYgMTQuNDQgNDQuMiAyNSA0NC4yQzM1LjU2IDQ0LjIgNDQuMiAzNS41NiA0NC4yIDI1QzQ0LjIgMTQuNDQgMzUuNTYgNS44IDI1IDUuOFoiIGZpbGw9IiNBNjI2MjYiLz4KPHBhdGggZD0iTTI1IDM3QzE4LjQgMzcgMTMgMzEuNiAxMyAyNUMxMyAxOC40IDE4LjQgMTMgMjUgMTNDMzEuNiAxMyAzNyAxOC40IDM3IDI1QzM3IDMxLjYgMzEuNiAzNyAyNSAzN1oiIGZpbGw9IiNBNjI2MjYiLz4KPC9zdmc+Cg==",
    iconSize: [30, 30],
  });

  markerIcon = firstIcon;

  let mapMarker = L.marker([35.715298, 51.404343], { icon: markerIcon }).addTo(
    map,
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  mapIconControllEl.addEventListener("change", (event) => {
    if (iconStatus === "FIRST_ICON") {
      markerIcon = secondIcon;
      mapMarker.setIcon(markerIcon);
      iconStatus = "SECOND_ICON";
    } else {
      markerIcon = firstIcon;
      mapMarker.setIcon(markerIcon);
      iconStatus = "FIRST_ICON";
    }
  });

  map.on("move", () => {
    const center = map.getSize().divideBy(2);
    const targetPoint = map.containerPointToLayerPoint(center);
    const targetLating = map.layerPointToLatLng(targetPoint);

    mapMarker.setLatLng(targetLating);

    mapDetail = {
      x: targetLating.lat,
      y: targetLating.lng,
    };
  });

  window.provinceClickHandler = (province) => {
    provinceID = province;
    console.log(provinceID);
  };

  popularCities().then((res) => {
    const cities = res.data.cities;

    const popular = cities.filter((town) => town.popular);

    popular.forEach((popCity) => {
      cityContainerEl.insertAdjacentHTML(
        "beforeend",
        `
      <option value="${popCity.id}" data-province="${popCity.province_id}">
        ${popCity.name}
      </option>
      `,
      );
    });

    cityContainerEl.addEventListener("change", (e) => {
      city = e.target.value;
      neighborhood = null;

      const selectedOption = e.target.selectedOptions[0];

      provinceID = selectedOption.dataset.province;
      const province = cities.filter((city) => city.province_id == provinceID);

      neighbourContainerEl.innerHTML = "";
      province.map((neighbour) => {
        neighbourContainerEl.insertAdjacentHTML(
          "beforeend",
          `
              <option value="${neighbour.id}">${neighbour.name}</option>
          `,
        );
      });
    });

    neighbourContainerEl.addEventListener("change", (e) => {
      neighborhood = e.target.value;
    });
  });

  uploaderInputEl.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);

    postPics.push(...files);

    uploadedImagesEl.innerHTML = "";

    postPics.map((pic) => {
      const imageUrl = URL.createObjectURL(pic);

      uploadedImagesEl.insertAdjacentHTML(
        "beforeend",
        `
      <img src="${imageUrl}" alt="${pic.name}" />
      `,
      );
    });
  });

  priceInputEl.addEventListener("input", (event) => {
    const value = event.target.value.replace(/\D/g, "");

    event.target.value = value;

    price = value ? Number(value) : null;

    priceResultEl.innerHTML = value ? `${price.toLocaleString()} تومان` : "";
  });

  exchangeEls.forEach((exchangeEl) => {
    exchangeEl.addEventListener("change", (event) => {
      exchange = event.target.value === "true";
      console.log(exchange);
    });
  });

  postTitleEl.addEventListener("input", (event) => {
    postTitle = event.target.value.trim();
  });

  postDescriptionEl.addEventListener("input", (event) => {
    postDescription = event.target.value.trim();
  });

  window.fieldHandler = (slug, data) => {
    categoryFields[slug] = data;
    console.log(categoryFields);
  };

  subCategory.productFields.map((field) => {
    if (field.type === "selectbox") {
      categoryFields[field.slug] = null;

      groupsEl.insertAdjacentHTML(
        "beforeend",
        `
      <div class="group">
        <p class="title">${field.name}</p>
        <label class="select">
          <select onchange="fieldHandler('${field.slug}', this.value)">
            <option value="">انتخاب کنید</option>
            ${field.options
              .map((option) => `<option value="${option}">${option}</option>`)
              .join("")}
          </select>
        </label>
      </div>
      `,
      );
    } else {
      categoryFields[field.slug] = false;
      groupsEl.insertAdjacentHTML(
        "beforeend",
        `
          <div class="group checkbox-group">
            <p class="title">${field.name}</p>
            <div class="checkbox-options">
              <label class="checkbox-item">
                <input
                  type="checkbox"
                  value=""
                  onchange="fieldHandler('${field.slug}', this.checked)"
                />
              </label>
            </div>
          </div>
        `,
      );
    }
  });

  categoryNameEl.innerHTML = subCategory.title;

  const validateCategoryFields = () => {
    for (const field of subCategory.productFields) {
      if (
        field.required &&
        (categoryFields[field.slug] === null ||
          categoryFields[field.slug] === "")
      ) {
        showSwal(
          "خطا در وارد کردن اطلاعات",
          `${field.name} را مشخص کنید`,
          "error",
        );
        return false;
      }
    }

    return true;
  };

  const validatePost = () => {
    if (!city) {
      showSwal("خطا در وارد کردن اطلاعات", "شهر را انتخاب کنید", "error");
      return false;
    }

    if (!neighborhood) {
      showSwal("خطا در وارد کردن اطلاعات", "محله را انتخاب کنید", "error");
      return false;
    }

    if (!postTitle) {
      showSwal("خطا در وارد کردن اطلاعات", "عنوان آگهی را مشخص کنید", "error");
      return false;
    }

    if (!postDescription) {
      showSwal(
        "خطا در وارد کردن اطلاعات",
        "توضیحات آگهی را مشخص کنید",
        "error",
      );
      return false;
    }

    if (price === null || price === undefined) {
      showSwal("خطا در وارد کردن اطلاعات", "قیمت آگهی را مشخص کنید", "error");
      return false;
    }

    if (mapDetail.x === null || mapDetail.y === null) {
      showSwal(
        "خطا در وارد کردن اطلاعات",
        "آدرس را از نقشه انتخاب کنید",
        "error",
      );
      return false;
    }

    if (!validateCategoryFields()) return false;

    return true;
  };

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const isValid = validatePost();
    if (!isValid) return;

    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("description", postDescription);
    formData.append("price", price);
    formData.append("exchange", exchange);
    formData.append("city", city);
    formData.append("neighborhood", neighborhood);
    formData.append("map", JSON.stringify(mapDetail));

    formData.append("categoryFields", JSON.stringify(categoryFields));

    postPics.forEach((pic) => {
      formData.append("pics", pic);
    });

    const res = await fetch(
      `https://divarapi.liara.run/v1/post/${subCategory._id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      },
    );
    console.log(res);
    const data = await res.json();
    console.log(data.data.post);

    if (res.status === 201) {
      showSwal("موفق", "آگهی با موفقیت ساخته شد", "success");
      setTimeout(() => {
        location.href = "/frontend/pages/main.html";
      }, 1500);
    }
    if (res.status === 400) {
      showSwal("ناموفق", "چند فیلد پر نشده است", "error");
    }
    if (res.status === 401) {
      showSwal("ناموفق", "هنوز وارد نشده اید", "error");
    }
    if (res.status === 404) {
      showSwal("ناموفق", "دسته بندی نامعتبر است", "error");
    }
  });
});
