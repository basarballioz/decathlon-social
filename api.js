"use strict";

const feed_div = document.querySelector("#feed");
const contactList_ul = document.querySelector("#contact-list > ul");
const popularTags = document.querySelector("#tags");
const tagsPage = document.querySelector("#tagsPage");
const socials = document.querySelector("#profiles");
const getFullProfile = document.querySelector("#fullProfile");

// APP ID
const appId = "6105ab02b5d16d17954c0f6a";

// GET USER PROFILE
async function getUserData(id) {
  try {
    const endPoint = `https://dummyapi.io/data/api/user/${id}`;

    const xhr = new XMLHttpRequest();

    xhr.open("GET", endPoint);
    xhr.setRequestHeader("app-id", appId);
    xhr.onload = function () {
      if (xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);

        // Profil Bilgilerini Renderla
        // Div Alanını Sil Ve Tekrar Doldur
        feed_div.innerHTML = "";

        feed_div.innerHTML = `<div class="profileSection">
          <table class="socialTable">
            <tr>
              <th>Profile Details Of: <i>${
                data.firstName + " " + data.lastName
              }</i></th>
            </tr>
            <tr>
              <td class="fullProfileSection"><img class="fullProfileImg" src="${
                data.picture
              }">
                <ul>
                  <li><strong>First Name:</strong> ${data.firstName}</li>
                  <li><strong>Last Name:</strong> ${data.lastName}</li>
                  <li><strong>Email:</strong> ${data.email}</li>
                  <li><strong>Gender:</strong> ${data.gender}</li>
                  <li><strong>Birthdate:</strong> ${normalizeISODateT(
                    data.dateOfBirth
                  )}</li>
                  <li><strong>Phone:</strong> ${data.phone}</li>
                  <li><strong>Location:</strong> ${
                    data.location.country +
                    ", " +
                    data.location.city +
                    "-" +
                    data.location.state +
                    " | " +
                    data.location.street
                  }</li>
                  <li><strong>Time Zone:</strong> ${data.location.timezone}</li>
                  <li><strong>Register Date:</strong> ${normalizeISODateT(
                    data.registerDate
                  )}</li>
                </ul>
              </td>
            </tr>
          </table>
        </div>
        <div class="returnToHome">
          <a href="index.html">Return To Feed</a>
        </div>`;

        console.log(data);
      }
    };

    xhr.send();
  } catch (e) {
    console.log(e);
  }
}

// USER ID CEKME
function setUserId(id) {
  return function () {
    getUserData(id);
  };
}

// ISODate Formatını Tarihe Cevirme Func (Detaylı)
function normalizeISODateD(isoDate) {
  const newDate = isoDate.split("T");
  const time = newDate[1].split(":");

  return time[0] + ":" + time[1] + " " + newDate[0];
}

// ISODate Formatını Tarihe Cevirme Func (Sadece Tarih)
function normalizeISODateT(isoDate) {
  const newDate = isoDate.split("T");

  return newDate[0];
}

// GET POST API
function getPosts() {
  const endPoint = "https://dummyapi.io/data/api/post?limit=30";

  const xhr = new XMLHttpRequest();

  xhr.open("GET", endPoint);
  xhr.setRequestHeader("app-id", appId);

  xhr.onload = function () {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);

      const posts = data.data;

      const postsHTML = posts.map((post, index) => {
        if (!post) {
          return "";
        }
        return `
          <div class="post-container"> 
            <div class="news_feed_title">
              <img src=${post.owner.picture} alt="User Picture" />
              <div class="news_feed_title_content">
                <p class="postOwner">${post.owner.firstName} ${
          post.owner.lastName
        } </p>
                <span>${normalizeISODateD(
                  post.publishDate
                )} <i class="fas fa-globe-americas"></i></span>
              </div>
            </div>
            <div class="news_feed_description">
              <p class="news_feed_subtitle">
                ${post.text} 
              </p>
              
              ${
                post.image ? `<img src=${post.image} alt="Post Image" />` : ""
              }  
            </div>

            ${
              post.tags.length === 0
                ? ""
                : `<div class="postTags">
                  <span>Tags:${post.tags}</span> 
                </div>`
            }
            
            <div class="interactionArea">
              <div class="emojis">
                <img src="img/emoji_like.png" alt="Like Emoji" />
                <span>${post.likes}</span>
              </div>
              <div>
                <a class="show-profile"> Show This Profile </a>
              </div>
            </div>
      
            <div class="postDivider">
              <hr />
            </div>
            <div class="interactionButtons">
              <div class="interactionButtons-icons">
                <i class="far fa-thumbs-up"></i>
                <span>Like</span>
              </div>
              <div class="interactionButtons-icons">
                <i class="far fa-comment-alt"></i>
                <span>Comment</span>
              </div>
              <div class="interactionButtons-icons">
                <i class="fas fa-share"></i>
                <span>Share</span>
              </div>
            </div>
          </div>
        `;
      });

      for (let i = 0; i < postsHTML.length; i++) {
        feed_div.innerHTML += postsHTML[i];
      }

      // HER BIR KULLANICININ ALTINA AYRI OZEL ID CEKME LISTENER
      for (let i = 0; i < posts.length; i++) {
        document
          .querySelectorAll(".show-profile")
          [i].addEventListener("click", setUserId(posts[i].owner.id));
      }
    }
  };

  xhr.send();
}

// GET CONTACT API
function getContacts() {
  const endPoint = "https://dummyapi.io/data/api/user?limit=9";

  const xhr = new XMLHttpRequest();

  xhr.open("GET", endPoint);
  xhr.setRequestHeader("app-id", appId);

  xhr.onload = function () {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      const contacts = data.data;

      const contactsHTML = contacts.map((contact, index) => {
        if (!contact) {
          return null;
        }
        return `<li>
          <a href="#">
            <img src="${contact.picture}" alt="User Picture" />
            <span>${contact.firstName + " " + contact.lastName}</span>
          </a>
        </li>`;
      });

      for (let i = 0; i < contactsHTML.length; i++) {
        contactList_ul.innerHTML += contactsHTML[i];
      }
    }
  };

  xhr.send();
}
// GET USER LIST
function getUserList() {
  const endPoint = "https://dummyapi.io/data/api/user?limit=50";

  const xhr = new XMLHttpRequest();

  xhr.open("GET", endPoint);
  xhr.setRequestHeader("app-id", appId);

  xhr.onload = function () {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      const profile = data.data;

      const userList = profile.map((pro, index) => {
        if (!pro) {
          return null;
        }
        return `
        <td><img class="socialProfile" src="${pro.picture}">
        <ul>
          <li><strong>First Name:</strong> ${pro.title} ${pro.firstName}</li>
          <li><strong>Last Name:</strong> ${pro.lastName}</li>
          <li><strong>Email:</strong> ${pro.email}</li>
        </ul>
       </td>
       <hr id="hrForMobile">`;
      });

      for (let i = 0; i < userList.length; i++) {
        socials.innerHTML += userList[i];
      }
    }
  };

  xhr.send();
}

// GET TAG API
function getTags() {
  const endPoint = "https://dummyapi.io/data/api/tag?limit=10";

  const xhr = new XMLHttpRequest();

  xhr.open("GET", endPoint);
  xhr.setRequestHeader("app-id", appId);

  xhr.onload = function () {
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);
      const tags = data.data;

      const tagsHTML = tags.map((tag, index) => {
        if (!tag) {
          return null;
        }
        return `
        <a href="#">
        <span>#${tag}</span>
        </a>`;
      });

      const showTags = tags.map((hashTag, index) => {
        if (!hashTag) {
          return null;
        }
        return `
        <tr>
            <td>#${hashTag}</td>
        </tr>`;
      });

      for (let i = 0; i < tagsHTML.length; i++) {
        popularTags.innerHTML += tagsHTML[i];
      }

      for (let i = 0; i < showTags.length; i++) {
        tagsPage.innerHTML += showTags[i];
      }
    }
  };

  xhr.send();
}

// API FONKSIYON CALL
getPosts();
getContacts();
getTags();
getUserList();
