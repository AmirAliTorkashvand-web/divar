import {
  getToken,
  removeCookie,
  showSwal,
  showSwalQuestion,
} from "../funcs/shared.js";

window.addEventListener("load", () => {
  const token = getToken();
  const logoutEl = document.querySelector(".sidebar__logout");

  if (!token) {
    showSwal("خطا", "هنوز وارد نشدید", "error");

    setTimeout(() => {
      location.replace("/frontend/pages/main.html");
    }, 1500);
  }

  logoutEl.addEventListener("click", () => {
    showSwalQuestion("مطمئنی؟", "آیا از خروج مطمئنی؟", "warning", () => {
      removeCookie("user");
      location.href = "frontend/pages/main.html";
    });
  });
});
