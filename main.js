const url = "https://jsonplaceholder.typicode.com/posts";
var url2 = "https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10";
var page = 1;
var newPage = true;
var dataPost;

const loadingElement = document.querySelector("#loading");
const postsContainer = document.querySelector("#posts-container");

const postPage = document.querySelector("#post");
const postContainer = document.querySelector("#post-container");
const commentsContainer = document.querySelector("#comments-container");

const commentForm = document.querySelector("#comment-form");
const emailInput = document.querySelector("#email");
const bodyInput = document.querySelector("#body");

// Load post
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Get all posts
async function getAllPosts() {
  const response = await fetch(url2);

  const data = await response.json();
  dataPost = data;

  loadingElement.classList.add("hide");

  data.map((post) => {
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const body = document.createElement("p");
    const link = document.createElement("a");

    title.innerText = post.title;
    body.innerText = post.body;
    link.innerText = "Ler";
    link.setAttribute("href", `/post.html?id=${post.id}`);

    div.appendChild(title);
    div.appendChild(body);
    div.appendChild(link);
    postsContainer.appendChild(div);
  });
  
  if (dataPost.length === 20) {
    page++
  }  else {
    newPage = false
  }
}

// Get individual post
async function getPost(id) {
  const [responsePost, responseComments] = await Promise.all([
    fetch(`${url}/${id}`),
    fetch(`${url}/${id}/comments`),
  ]);

  const dataPost = await responsePost.json();

  const dataComments = await responseComments.json();

  loadingElement.classList.add("hide");
  postPage.classList.remove("hide");

  const title = document.createElement("h1");
  const body = document.createElement("p");

  title.innerText = dataPost.title;
  body.innerText = dataPost.body;

  postContainer.appendChild(title);
  postContainer.appendChild(body);

  dataComments.map((comment) => {
    createComment(comment);
  });
}

function createComment(comment) {
  const div = document.createElement("div");
  const email = document.createElement("h3");
  const commentBody = document.createElement("p");

  email.innerText = comment.email;
  commentBody.innerText = comment.body;

  div.appendChild(email);
  div.appendChild(commentBody);
  commentsContainer.appendChild(div);
}

// Insert a comment
async function postComment(comment) {
  const response = await fetch(url, {
    method: "POST",
    body: comment,
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await response.json();

  createComment(data);
}

if (!postId) {
  getAllPosts();
  if (newPage === true) {
    recarregar();
  }
} else {
  getPost(postId);

  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment = {
      email: emailInput.value,
      body: bodyInput.value,
    };

    comment = JSON.stringify(comment);

    postComment(comment);
  });
}

function recarregar() {
  page++
  url2 = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
  getAllPosts()
}