const hostname = `${window.location.protocol}//${window.location.hostname}`;

fetch("/factContent").then((res) => {
    res.text().then((data) => {
        const facts = data.split("\n");

        const fact = facts[Math.floor(Math.random() * (facts.length - 1))];

        document.getElementById("factScript").innerText = fact;

        document.getElementById("factScript").classList.add("fact")
    })
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