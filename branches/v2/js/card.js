subs = [
    "i'm most active here",
    "feel free to dm me",
    "sometimes i make things",
    "amemoia gaming"
];

indexsubs = [
    "it do be kind of tough",
    "you can tell by my code that i really like spaghetti"
];

cards = document.getElementsByClassName("card-subtitle");

for (let i = 0; i < cards.length; i++) {
    var subtitleText = subs[i];
    const subtitle = document.getElementsByClassName("card-subtitle")[i];
    if (subtitle.classList.contains('alt')) {
        var subtitleText = indexsubs[i];
    }

    const createWord = (text, index) => {
        const word = document.createElement("span");
        word.innerHTML = `${text} `;
        word.classList.add("card-subtitle-word");
        word.style.transitionDelay = `${index * 40}ms`;
        return word;
    }
    
    const addWord = (text, index) => subtitle.appendChild(createWord(text, index));
    const createSubtitle = text => text.split(" ").map(addWord);
    
    createSubtitle(subtitleText);
}