const hostname = `${window.location.protocol}//${window.location.hostname}`;

fetch(`${hostname}:3000/search/text?q=${q}`).then((res) => {
    if (res.status != 200) {
        alert("There was an error with your search. Please try again later.")
    }
    if (res.status == 200) {
        res.json().then((data) => {
            const results = data;

            for (const item of results) {
                const card = document.createElement("div");
                card.classList.add("card");

                const h3 = document.createElement("h3");
                const a = document.createElement("a");
                const p = document.createElement("p");

                h3.innerText = item.title;
                a.href = item.link.href;
                p.innerText = item.description;

                a.appendChild(h3)

                card.appendChild(a)
                card.appendChild(p)

                document.getElementsByClassName("results")[0].appendChild(card)
            }
        })
    }
})

const searchBox = document.getElementById("searchBox");

searchBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        fetch(`${hostname}:3000/search/text/preflight?q=${searchBox.value}`)
        .then((res) => {
            if (res.status !== 200) {
                alert("There was an error with your search. Please try again later.");
            }
            if (res.status == 200) {
                window.location.href = `${hostname}:${window.location.port}/search.html?q=${searchBox.value}`;
            }
        })
    }
})  