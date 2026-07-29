import { getAllUsersNotes } from "../funcs/shared.js";

window.addEventListener("load", () => {
  const notesEl = document.querySelector(".posts");

  getAllUsersNotes().then((note) => {
    const allNotes = note.data.posts;
    allNotes.map((note) => {
      notesEl.insertAdjacentHTML(
        "beforeend",
        `
                <div class="post" data-id="${note._id}">
                    <div>
                        ${
                          note.pics.length
                            ? `<img src="https://divarapi.liara.run/${note.pics[0].path}" />`
                            : `<img src="../../images/main/no product.png" />`
                        }

                        <div>
                            <a class="title" href="#">${note.title}</a>
                            <p>${note.city.name} در ${note.neighborhood.name}</p>
                            <p>${note.note.content}</p>
                        </div>
                    </div>
                </div>
            `,
      );
    });
  });

  notesEl.addEventListener("click", (e) => {
    const post = e.target.closest(".post");

    if (!post) return;

    const productID = post.dataset.id;

    location.href = `/frontend/pages/product.html?post=${productID}`;
  });
});
