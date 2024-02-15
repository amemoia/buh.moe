/* Insert divs for window footers. HORRIBLE HORRIBLE HORRIBLE DO NOT LOOK */
var windows = document.getElementsByClassName("window")
for (let i = 0; i < windows.length; i++) {
    var titlebar = document.getElementsByClassName("window-titlebar")[i]
    let b_close = document.createElement('img')
    b_close.src = "resources/icons/button_close.png"
    titlebar.appendChild(b_close)
    let b_maxi = document.createElement('img')
    b_maxi.src = "resources/icons/button_maximize.png"
    titlebar.appendChild(b_maxi)
    let b_mini = document.createElement('img')
    b_mini.src = "resources/icons/button_minimize.png"
    titlebar.appendChild(b_mini)

    let windowfooter = document.createElement('div')
    windowfooter.classList.add('window-footer')
    
    let squares = document.createElement('div')
    squares.classList.add('squares')
    let div1 = document.createElement('div')
    squares.appendChild(div1)
    squares.innerHTML += "\n" /* EVIL SQUARE SPACING HACK */
    let div2 = document.createElement('div')
    squares.appendChild(div2)
    squares.innerHTML += "\n"
    let div3 = document.createElement('div')
    squares.appendChild(div3)
    
    windows[i].appendChild(windowfooter)
    windows[i].appendChild(squares)
};

var baseSocIconDir = "resources/icons/"
const socialImages = [
    "icon_desktop_jine2.png",
    "icon_desktop_twitter.png",
    "icon_desktop_egosearch.png",
    "icon_desktop_game.png",
    "icon_desktop_asobu.png",
]

var newSheet = document.createElement('style'),
	sheet;
document.body.appendChild(newSheet);
sheet = newSheet.sheet;

var socialList = document.getElementById('social-list')
for (let i = 0; i < socialList.children.length; i++) {
    socialList.children[i].children[0].id = "social"+i;
    let imgDir = baseSocIconDir + socialImages[i]
    let setStyle = "#social" + i + "::before"
                 + " {"
                 + " content: '';"
                 + " display: inline-block;"
                 + " width: 64px;"
                 + " height: 64px;"
                 + " background-image: url(" + imgDir + ");"
                 + " }"
    sheet.insertRule(setStyle, i)
}