import { calcualetRelativeTime, getAllUsersPosts } from "../funcs/shared.js";

window.addEventListener("load", () => {
  const notesEl = document.querySelector(".posts");
  const emptyEl = document.querySelector(".empty");

  getAllUsersPosts().then((post) => {
    const posts = post.data.posts;
    console.log(posts);
    if (posts.length > 0) {
      posts.map((post) => {
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
});
