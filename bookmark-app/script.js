const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameElement = document.getElementById("website-name");
const websiteUrlElement = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

//show modal, focus on input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameElement.focus();
}

//Modal event listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
//close form by clicking outside
window.addEventListener("click", (event) =>
  event.target === modal ? modal.classList.remove("show-modal") : false
);

//validate form
function validate(nameValue, urlValue) {
  const expresions =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = RegExp(expresions);
  if (!nameValue) {
    alert("Please submit website name");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web adress");
    return false;
  }
  //Valid
  return true;
}

//build bookmarks dom
function buildBookmarks() {
  //remove all bookmark elements
  bookmarksContainer.textContent = "";
  //build items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    //item
    const item = document.createElement("div");
    item.classList.add("item");
    //close icom
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark("${id}")`);
    //favicon / link container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    //favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    //link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    //append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

//Fetch bookmarks
function fetchBookmarks() {
  //get bookmarks from localStoreage if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    //create bookmarks array in localStorage
    const id = `https://twitch.tv`;
    bookmarks[id] = {
      name: "twitch",
      url: "https://twitch.tv",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

//delete bookmark
function deleteBookmark(id) {
  //loop through the bookmarks array
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  //update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

//Handle data from form
function storeBookmark(event) {
  event.preventDefault();
  const nameValue = websiteNameElement.value;
  let urlValue = websiteUrlElement.value;
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  //set bookmark object, add to array
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  //set bookmarks in localStorage, fetch, reset input fields
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  modal.classList.remove("show-modal");
  bookmarkForm.reset();
  websiteNameElement.focus();
}

//event listener
bookmarkForm.addEventListener("submit", storeBookmark);

//on load, fetch bookmarks
fetchBookmarks();
