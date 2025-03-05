let sun = document.querySelector("#sun");
let moon = document.querySelector("#moon");
let body = document.querySelector("body");
let cart = document.querySelector("#cart");
let closeShopping = document.querySelector(".closeShopping");
let homeBg = document.querySelector(".home_bg");
let leftArrow = document.querySelector(".leftArrow");
let rightArrow = document.querySelector(".rightArrow");
let imageIcons = document.querySelectorAll(".image-icon");
let list = document.querySelector(".product-right-bottom");
let li = document.querySelectorAll(".list");
let circle = document.querySelectorAll(".fa-circle");
let allList = document.querySelector(".all-list");
let listCard = document.querySelector(".listCard");
let total = document.querySelector(".total");
let quanity = document.querySelector(".quantity");
let bookType = document.querySelectorAll(".book-type");
let collections = document.querySelector(".collections");
const navMenu = document.getElementById("nav_menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");
let userModal = document.getElementById("userModal");

// ============= menu bar ==============

navToggle.addEventListener("click", () => {
  navMenu.classList.add("show-menu");
});

navClose.addEventListener("click", () => {
  navMenu.classList.remove("show-menu");
});

userModal.addEventListener("click", () => {
  window.location.href = "registriatsiya.html"
})

// ============= dark mode  ==============

const toggleTheme = () => {
  body.classList.toggle("darkLight");
  sun.classList.toggle("hide");
  moon.classList.toggle("hide");
};

sun.addEventListener("click", toggleTheme);
moon.addEventListener("click", toggleTheme);

cart.addEventListener("click", () => {
  body.classList.toggle("active");
});
closeShopping.addEventListener("click", () => {
  body.classList.remove("active");
});
window.onscroll = () => {
  body.classList.remove("active");
};

// ================================== header slider ==================================

let imgs = homeBg.querySelectorAll("img");
imgs.forEach((item, index) => {
  item.style.left = `${index * 100}%`;
});
let counter = 0;
rightArrow.addEventListener("click", () => {
  if (counter == imgs.length - 1) {
    counter = 0;
    slideImage();
  } else {
    counter++;
    slideImage();
  }
});
leftArrow.addEventListener("click", () => {
  if (counter == 0) {
    counter = imgs.length - 1;
    slideImage();
  } else {
    counter--;
    slideImage();
  }
});
const slideImage = () => {
  imgs.forEach((slide) => {
    slide.style.transform = `translateX(-${counter * 100}%)`;
  });
};

// ============= product cards get ==============

async function getData() {
  try {
    let response = await fetch(`https://fakerapi.it/api/v2/books?_quantity=24`);
    let data = await response.json();
    data = data.data;
    console.log(data);

    let bookImages = await Promise.all(
      data.map(async (_, index) => {
        let imgResponse = await fetch("https://picsum.photos/200/300");
        return imgResponse.url;
      })
    );

    displayCategories(data);
    displayBooks(data, bookImages);
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    alert(`Xatolik yuz berdi: ${error}`);
  }
}

function displayCategories(books) {
  let categories = new Set(books.map(book => book.genre.toLowerCase()));
  let categoryList = document.querySelector(".collections");

  categoryList.innerHTML = `
    <li class="list active" data-filter="all">
      <span class="active-list on"><i class="fa-regular fa-circle"></i></span>
      All Collections
    </li>
  `;

  categories.forEach(category => {
    categoryList.innerHTML += `
      <li class="list" data-filter="${category}">
        <span class="active-list on"><i class="fa-regular fa-circle"></i></span>
        ${category.charAt(0).toUpperCase() + category.slice(1)}
      </li>
    `;
  });

  addCategoryFilter();
}

function displayBooks(products, bookImages) {
  
  if (!list) {
    console.error("'.book-list' elementi topilmadi! Iltimos, HTML-ni tekshiring.");
    return;
  }

  list.innerHTML = "";

  products.forEach((value, index) => {
    list.innerHTML += `
        <div class="book-card" data-type="${value.genre.toLowerCase()}"> 
        <div class="book-image">
          <img src="${bookImages[index]}" alt="" class="book-imagish" />
        </div>
        <div class="book-details">
          <div class="book-type">${value.genre}</div>
          <div class="book-title">${value.title}</div>
          <div class="book-author">${value.author}</div>
          <div class="book-price">
            <span class="book-price-symbol">$</span>${Math.ceil(Math.random() * 100 + 20)}
          </div>
          <div class="buttons">
            <button class="addToCart" onclick="addToCard(${index})">Add to cart</button>
            <i class="ri-heart-line" id="heart"></i>
            <i class='bx bx-dots-vertical-rounded options' onclick="option(${index})"></i>
            <div class="inOption">
              <i class='bx bx-pencil' onclick="renameItem(${index})"></i>
              <i class="fa-solid fa-trash" onclick="removeItem(this)"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function addCategoryFilter() {
  let categoryItems = document.querySelectorAll(".list");

  categoryItems.forEach(item => {
    item.addEventListener("click", function () {
      let filter = this.getAttribute("data-filter");

      categoryItems.forEach(i => i.classList.remove("active"));
      this.classList.add("active");

      let books = document.querySelectorAll(".book-card");

      if (books.length === 0) {
        console.error("Kitob kartalari topilmadi! Iltimos, API dan kelayotgan ma'lumotlarni tekshiring.");
        return;
      }

      books.forEach(book => {
        if (filter === "all" || book.getAttribute("data-type") === filter) {
          book.style.display = "block";
        } else {
          book.style.display = "none";
        }
      });
    });
  });
}

document.getElementById("mySearch").addEventListener("input", function () {
  let searchValue = this.value.toLowerCase();
  let books = document.querySelectorAll(".book-card");

  books.forEach((book) => {
    let title = book.querySelector(".book-title").innerText.toLowerCase();
    if (title.includes(searchValue)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
});

getData();
