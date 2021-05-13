// DOM Element
const menuToggle = document.querySelector(".toggle-nav");
const navbar = document.querySelector(".navbar");
const listNav = document.querySelectorAll(".list-nav");
const searchButton = document.querySelector(".search-btn");
const searchInput = document.querySelector("#search");
const dropdownBtn = document.querySelector("#dropdown");
const dropdownList = document.querySelector(".dropdown-menu");
const header = document.querySelector(".header-wrapper");
const logo = document.querySelector(".logo");
const closeAside = document.querySelector(".close-icon");
const mainContainer = document.querySelector(".main-wrapper .main");
const articleWrapper = document.querySelector(".article-wrapper");
const asideWrapper = document.querySelector(".aside-wrapper");
const cardWrapper = document.querySelector(".card-wrapper");
const contentTitle = document.querySelector(".content-title");
const dropdownItems = document.querySelectorAll(".dropdown-item");

// Dynamic Title
function setTitle(title) {
    document.title = `Komik Kode | ${title}`;
};

// Navbar Function
menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("show");
})

searchButton.addEventListener("click", () => {
    searchInput.classList.add("show");
    if (header.clientWidth <= 576) {
        logo.classList.add("hide");
        menuToggle.style.width = `15%`
    }
    searchButton.style.borderRadius = `0 8px 8px 0`;
})

dropdownBtn.addEventListener("click", () => {
    dropdownList.classList.toggle("show");
})


// Aside Function
closeAside.addEventListener("click", (e) => {
    mainContainer.classList.add("close");
    articleWrapper.style.width = `100%`;
    asideWrapper.style.width = `100%`;
    asideWrapper.style.boxShadow = `1px 1px 4px 0px rgba(133, 133, 133, 1)`;
    asideWrapper.style.padding = `1em`;
    asideWrapper.style.boxSizing = `border-box`;
    asideWrapper.style.borderRadius = `8px`;
    closeAside.style.display = `none`;
})

// Fetch API

// Get Manga Initial State
function getManga(page) {
    return fetch(`https://mangamint.kaedenoki.net/api/manga/page/${page}`)
        .then((res) => res.json())
        .then((res) => {
            const mangas = res.manga_list;
            let cards = '';
            mangas.map((item) => cards += setCard(item));
            cardWrapper.innerHTML = cards;
        }).catch((err) => console.log(err));
}

// Get Manga From Category
function getMangaByCategory(category, page = 1) {
    if (category === "popular") {
        return fetch(`https://mangamint.kaedenoki.net/api/manga/${category}/${page}`)
            .then((res) => res.json())
            .then((res) => res.manga_list)
            .catch(err => { console.log(err) });
    }
    if (category === "recommended") {
        return fetch(`https://mangamint.kaedenoki.net/api/${category}`)
            .then((res) => res.json())
            .then((res) => res.manga_list)
            .catch((err) => console.log(err));
    }
}

// Get Manga From Category
listNav.forEach((item) => {
    item.addEventListener("click", async (e) => {
        const category = e.target.innerText;
        if (category !== "List" &&
            category !== undefined &&
            category !== "Genre") {
            const mangas = await getMangaByCategory(category.toLowerCase(), page = 1)
            updateUI(mangas);
            contentTitle.innerHTML = `<h3>${category}</h3>`;
            setTitle(category);
            navbar.classList.remove("show");
        }
        if (category === "Genre") {
            setCard(category)
            setTitle(category)
            contentTitle.innerHTML = `<h3>${category}</h3>`;
            navbar.classList.remove("show");
        }
    })
})

// Get Manga on Search

function getMangaSearch(keyword) {
    return fetch(`https://mangamint.kaedenoki.net/api/search/${keyword}`)
        .then((res) => res.json())
        .then((res) => res.manga_list)
        .catch((err) => console.log(err));
}

searchButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const keyword = searchInput.value;
    const mangas = await getMangaSearch(keyword);
    if (keyword === "") {
        return
    }
    contentTitle.innerHTML = `<h3>Search: ${keyword}</h3>
    <h3>Result: ${mangas.length}</h3>`;
    setTitle(keyword)
    updateUI(mangas);
})

// Get Manga From List {Manga, Manhwa, Manhua}
function getListManga(list) {
    return fetch(`https://mangamint.kaedenoki.net/api/${list}/1`)
        .then((res) => res.json())
        .then((res) => res.manga_list)
        .catch((err) => console.log(err));
}

dropdownItems.forEach(item => {
    item.addEventListener("click", async (e) => {
        const list = e.target.innerText;
        if (list !== "Manga") {
            const mangas = await getListManga(list.toLowerCase());
            setTitle((`List - ${list}`));
            updateUI(mangas)
            dropdownList.classList.remove("show");
            navbar.classList.remove("show")
            contentTitle.innerHTML = `<h3>${list}</h3>`;
        } else {
            await getManga(1);
            setTitle((`List - ${list}`));
            dropdownList.classList.remove("show");
            navbar.classList.remove("show")
            contentTitle.innerHTML = `<h3>${list}</h3>`;
        }
    })
})

// Back to Initial State
logo.addEventListener("click", async () => {
    await getManga(1);
    contentTitle.innerHTML = `<h3>Daily Updates</h3>`
})

// Update UI After Click Category
async function updateUI(mangas) {
    let cards = '';
    await mangas.map((item) => cards += setCard(item));
    cardWrapper.innerHTML = cards;
}

function setCard(item) {
    const { thumb, title, chapter, type } = item;
    if (item === "Genre") {
        cardWrapper.innerHTML = `<h1>Cooming Soon</h1>`
    }
    return (
        `
            <div class="card">
                <div class="thumb-card">
                    <img src=${thumb}
                        alt=${title}>
                </div>
                <div class="title-card">${title}</div>
                <div class="chapter-card">${chapter ? chapter : ""}</div>
                <div class="type-card">${type ? type : ""}</div>
            </div>`
    )
}

// Initial State Main Menu
getManga(page = 1);
