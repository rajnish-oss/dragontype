const words = 'algorithm innovation drives collaboration across frameworks enhancing scalability and performance strategic optimization of infrastructure and analytics enables seamless integration automation and development methodologies increase productivity while architecture and deployment ensure efficient synergy in the system with continuous development we achieve robust deployment pipelines that align with industry standards fostering continuous improvement in all facets of project management research and testing fuel advancement in technology leveraging data for better decision making machine learning adapts processes to meet evolving demands global connectivity increases opportunities for innovation expanding potential across industries diverse teams contribute to creative problem solving fostering an inclusive environment that accelerates progress technological evolution redefines approaches to traditional challenges in business operations data driven insights support smarter decisions across all levels artificial intelligence transforms customer service by enabling personalized interactions with minimal human input streamlined processes create efficiencies by eliminating redundancies empowering teams to focus on high value tasks while automation handles repetitive work cloud computing facilitates real time collaboration across geographically distributed teams enhancing productivity in remote environments big data analytics provides valuable insights into market trends and consumer behavior allowing companies to tailor their strategies accordingly continuous improvement is rooted in the agile mindset where feedback loops are integrated into every stage of development adaptability and flexibility are key drivers of success in a fast paced business landscape as new technologies emerge businesses must remain nimble and open to adopting tools that enhance operational efficiency digital transformation requires collaboration between departments to implement integrated solutions aligning technology with business goals ultimately shaping a more connected and efficient world leaders in innovation are those who push the boundaries of what is possible leveraging resources and talent to create breakthrough solutions that have the potential to disrupt entire industrial'.split(' ');
let textArea = document.querySelector(".game");
let focus = document.querySelector(".focus");
const resetBtn = document.querySelector(".reset");
const cursor = document.querySelector(".cursor");
let wordDiv = document.querySelector(".words");
let timer = document.querySelector(".timer");
let count = 0;
window.timer = 0;
const gameTime = 30*1000;
let WPM = document.querySelector(".wpm");

const addClass = (el, name) => {
    el.classList.add(name);
}
const removeClass = (el, name) => {
    el.classList.remove(name);
}

function randomText() {
    let random = Math.floor(Math.random() * words.length);
    return words[random ];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

//starting new game
let newGame = () => {
    wordDiv.innerHTML = '';
    for (let i = 1; i <= 200; i++) {
        wordDiv.innerHTML += formatWord(randomText());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    timer.innerHTML = (gameTime / 1000) + '';
    window.timer = null;
}

function getWpm(){
  const currentTime = (new Date()).getTime();
  const minPassed = (currentTime - window.gameStart)/60000;
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typeWords = words.slice(0, lastTypedWordIndex);
  const correctWords = typeWords.filter(word =>{
    const letters = [...word.children];
    const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
    const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
    return incorrectLetters.length === 0 && correctLetters.length === letters.length;
 });
 return Math.round(correctWords.length / minPassed);

}

function accuracy(){
  const words = [...document.querySelectorAll('.word')];
  const lastTypedWord = document.querySelector('.word.current');
  const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
  const typedWords = words.slice(0, lastTypedWordIndex);

  let totalLetters = 0;
  let correctLetters = 0;
  
  typedWords.forEach(words => {
    let letters = [...words.children];
    totalLetters += letters.length;
    correctLetters += letters.filter(letter => letter.classList.contains('correct')).length;
})
  if(totalLetters === 0) return 0;
  return Math.round((correctLetters / totalLetters) * 100);
}

//game over
function gameOver() {
  clearInterval(window.timer);
  addClass(document.querySelector('.game'), 'over');
  textArea.innerHTMl = '';
  cursor.style.display = "none";
  const afterFocusDiv = document.querySelector(".afterFocus");
  afterFocusDiv.style.display = "flex"; 
  getWpm();
  WPM.innerHTML = getWpm();
  accuracy();
  document.querySelector(".acc").innerHTML = accuracy() + "%";
}

//remove blur
focus.addEventListener("click", () => {
    focus.style.display = "none";
    cursor.style.display = "block";
    
})

console.log(cursor.style.display)
newGame()

let currentWord = document.querySelector('.word.current');
let currentLetter = document.querySelector('.letter.current');
window.timer = 0;

//pressing key
window.addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    if (document.querySelector('.game.over')) {
      return;
    }



    console.log({key,expected});

//timer
    if (!window.timer && isLetter) {
      window.timer = setInterval(() => {
        if (!window.gameStart) {
          window.gameStart = (new Date()).getTime();
        }
        const currentTime = (new Date()).getTime();
        const msPassed = currentTime - window.gameStart;
        const sPassed = Math.round(msPassed / 1000);
        const sLeft = Math.round((gameTime / 1000) - sPassed);
        timer.innerHTML = sLeft + '';
        WPM.innerHTML = getWpm();
        if (sLeft <= 0) {
          gameOver();
          return;
        }
        
      }, 1000);
    }

    

    if (isLetter) {
      if (currentLetter) {
        addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
        removeClass(currentLetter, 'current');
        if (currentLetter.nextSibling) {
          addClass(currentLetter.nextSibling, 'current');
        }
      } else {
        const incorrectLetter = document.createElement('span');
        incorrectLetter.innerHTML = key;
        incorrectLetter.className = 'letter incorrect extra';
        currentWord.appendChild(incorrectLetter);
      }
    }

    // using spacebar
    if (isSpace) {
      if (expected !== ' ') {
        const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
        lettersToInvalidate.forEach(letter => {
          addClass(letter, 'incorrect');
        });
      }
      removeClass(currentWord, 'current');
      addClass(currentWord.nextSibling, 'current');
      if (currentLetter) {
        removeClass(currentLetter, 'current');
      }
      addClass(currentWord.nextSibling.firstChild, 'current');
    }

    
    const extraLetter = document.querySelector('.letter.extra');
    if (isBackspace) {
      if (currentLetter && isFirstLetter) {
        // make prev word current, last letter current
        removeClass(currentWord, 'current');
        addClass(currentWord.previousSibling, 'current');
        removeClass(currentLetter, 'current');
        addClass(currentWord.previousSibling.lastChild, 'current');
        removeClass(currentWord.previousSibling.lastChild, 'incorrect');
        removeClass(currentWord.previousSibling.lastChild, 'correct');
      }
      if (currentLetter && !isFirstLetter) {
        // move back one letter, invalidate letter
        removeClass(currentLetter, 'current');
        addClass(currentLetter.previousSibling, 'current');
        removeClass(currentLetter.previousSibling, 'incorrect');
        removeClass(currentLetter.previousSibling, 'correct');
      }
      if (!currentLetter && !extraLetter) {
        addClass(currentWord.lastChild, 'current');
         removeClass(currentWord.lastChild, 'incorrect');
         removeClass(currentWord.lastChild, 'correct');
      }
      if(extraLetter){
        addClass(currentWord.lastChild, 'current');
        const delExtra =document.querySelector('.letter.incorrect.current');
        delExtra.remove();
      }
    }


    // move lines / words
    if(currentWord.getBoundingClientRect().top > 300){
        let margin = parseInt(wordDiv.style.top) || 0;
        wordDiv.style.top = (margin - 44) + "px";
    }


    // move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
  });

console.log(resetBtn);
  resetBtn.addEventListener('click', () => {
    // gameOver();
    // document.querySelector(".afterFocus").style.display = "none";
    // newGame();
    location.reload();
  });
