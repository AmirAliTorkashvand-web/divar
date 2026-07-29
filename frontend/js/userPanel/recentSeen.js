import {
  calcualetRelativeTime,
  getCityCookie,
  getPosts,
} from "../funcs/shared.js";

window.addEventListener("load", async () => {
  const notesEl = document.querySelector(".posts");
  const emptyEl = document.querySelector(".empty");
  const recentSeenID = JSON.parse(localStorage.getItem("recentSeen")) || [];
  const cityIds = getCityCookie()
    ?.map((city) => city.id)
    .join("|");
  const posts = await getPosts(cityIds);
  const postDetail = posts.data.posts;
  const recentSeenPosts = recentSeenID
    .map((id) => postDetail.find((post) => post._id === id))
    .filter(Boolean);
  if (recentSeenPosts.length > 0) {
    recentSeenPosts.map((post) => {
      notesEl.insertAdjacentHTML(
        "beforeend",
        `
            <a class="post">
                <div class="post-info">
                    ${
                      post.pics.length
                        ? `<img src="https://divarapi.liara.run/${post.pics[0].path}" />`
                        : `<img src="../../images/main/no product.png" />`
                    }

                    <div>
                        <p class="title">${post.title}</p>
                        <p class="price">${post.price ? `${post.price.toLocaleString()} تومان` : "رایگان"}</p>
                        <p class="location">${calcualetRelativeTime(post.createdAt)}</p>
                    </div>
                </div>

                <div class="post-status">
                    <div>
                        <p>وضعیت آگهی:</p>
                        <p class="publish">${post.status === "pending" ? "در انتظار تایید" : "منتشر شده"}</p>
                    </div>
                </div>
            </a>
        `,
      );
    });
  } else {
    emptyEl.classList.add("empty--active");
  }
});
