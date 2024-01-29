function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomFromArray(array) {
    return array[getRandomInt(0, array.length)];
}
function numberRange (end) {
    var start = 0
    return new Array(end + 1 - start).fill().map((d, i) => i + start);
}

const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
    let timeout;
  
    const runInterval = () => {
      const timeoutFunction = () => {
        intervalFunction();
        runInterval();
      };
  
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  
      timeout = setTimeout(timeoutFunction, delay);
    };
  
    runInterval();
  
    return {
      clear() { clearTimeout(timeout) },
    };
  };

// DISGUSTING SCHIZOPHRENIC STATE MANAGEMENT SYSTEM
// numberRange(4) = [0, 1, 2, 3, 4]
const states = {
    "comic" : 1,
    "egosearching" : 4,
    "egosearching_ura" : 4,
    "game_happy" : 4,
    "game_mad" : 2,
    "game_meh" : 2,
    "game_neutral" : 3,
    "idle_anxiety_blush" : 10,
    "idle_anxiety_mad" : 7,
    "idle_anxiety_normal" : 5,
    "idle_anxiety_normaldark" : 4,
    "idle_happy_blush" : 5,
    "idle_happy_normal" : 8,
    "idle_happy_normalblush" : 6,
    "idle_happy_normaldark" : 8,
    "idle_iraira_blush" : 3,
    "idle_iraira_blushmad" : 3,
    "idle_iraira_dark" : 3,
    "idle_iraira_depressed" : 4,
    "idle_iraira_frustrated" : 4,
    "idle_neutral" : 1,
    "idle_normal_anxious" : 7,
    "idle_normal_blush" : 5,
    "idle_normal_depressed" : 11,
    "idle_normal_love" : 6,
    "idle_normal_smile" : 10,
    "smile" : 2,
    "talk_anxious" : 4,
    "talk_blush" : 4,
    "talk_dark" : 4,
    "talk_neutral" : 4,
    "talk_smile" : 4
}
const mainpath = "resources/sprites/stream_ame_"
const webcam = document.getElementById("ame-sprite")
var current_state = getRandomFromArray(Object.keys(states))
animate(current_state)
var current_image = ""

function changeState(){
    current_state = getRandomFromArray(Object.keys(states))
    animate(current_state)
}
function animate(state){
    // Prevents rolling the same image in a row
    var image_number
    do {
        image_number = getRandomInt(0, states[state] + 1).toString()
        if (image_number.length == 1) var chosen_image = "00" + image_number
        else var chosen_image = "0" + image_number
    } while (chosen_image == current_image);

    var final_path = mainpath + state + "_" + chosen_image + ".png"
    webcam.src = final_path
    current_image = chosen_image
}

const animateInterval = setRandomInterval(() => animate(current_state), 750, 2000);
const stateInterval = setRandomInterval(() => changeState(), 10000, 20000);