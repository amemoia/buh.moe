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
