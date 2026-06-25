import { getCityCookie, getPosts } from "./funcs/shared.js";

window.addEventListener("load", async () => {
  const cityIds = getCityCookie()?.map((city) => city.id);

  getPosts(cityIds).then((data) => {
    console.log(data);
  });
});
