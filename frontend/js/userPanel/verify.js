import { getMe, getToken, showSwal } from "../funcs/shared.js";

window.addEventListener("load", async () => {
  const userPhoneNumberEl = document.querySelector(".sidebar__user-phone");
  const verifyBoxEl = document.querySelector(".verify-box");
  const verifyContainerEl = document.querySelector("#verify-container");
  const nationalCodeEl = document.querySelector(".verify__national-input");
  const verifyBtnEl = document.querySelector(".verify__national-btn");
  const errorEl = document.querySelector(".error");
  const userDetail = await getMe();
  const user = userDetail.data.user;
  let nationalCode = null;

  if (user.verified) {
    verifyContainerEl.classList.add("verify--notActive");
    verifyBoxEl.insertAdjacentHTML(
      "beforeend",
      `
          <div class="verified">
            <p>تایید هویت شده</p>
            
            <span>
            تایید هویت شما از طریق کد ملی انجام شد
            </span>
            
            <img
            width="100"
            height="100"
            src="https://img.icons8.com/ios/100/approval--v1.png"
            alt="approval--v1"
            />
          </div>
          `,
    );
  }

  nationalCodeEl.addEventListener("change", async (event) => {
    nationalCode = event.target.value.trim();
  });

  verifyBtnEl.addEventListener("click", async (event) => {
    event.preventDefault();
    const nationalCodeRegex = RegExp(/^[0-9]{10}$/);
    const isCodeValid = nationalCodeRegex.test(nationalCode);
    console.log(isCodeValid);

    if (isCodeValid) {
      errorEl.classList.remove("error--active");
      const res = await fetch("https://divarapi.liara.run/v1/user/identity", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationalCode: nationalCode,
        }),
      });
      console.log(res);
      if (res.ok) {
        showSwal("موفق", "با موفقیت تایید هویت شدید", "success");
      } else {
        showSwal("ناموفق", "کد ملی با شماره همراه مطابقت ندارد", "error");
      }
    } else {
      errorEl.classList.add("error--active");
    }
  });

  userPhoneNumberEl.innerHTML = user.phone;
});
