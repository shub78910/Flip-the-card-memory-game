import React, { useEffect, useState } from 'react'

import img1 from "./images/11.jpg"
import img2 from "./images/12.jpg"
import img3 from "./images/13.jpg"
import img4 from "./images/14.jpg"
import img5 from "./images/15.jpg"

import { shuffleCards } from "./shuffleImages"



let imagesArray = [img1, img2, img3, img4, img5, img1, img2, img3, img4, img5]

//here: 
// correctpairs is for keeping the count, where one correct pair increases 2 points, and then i can check if that is equal to the length of imagesArray.
// next we have pairChecker, which is a array of size 2, before exceeding the size i delete the other elements. This will check if the prev one and the new clicked images ae same or no, and depending on that, take actions.
// next rememberPrevClick: is also an array of size 2, which keeps the track of previous events so that i can then make the necessary changes if the two images aren't the same.
// allEvents is also an array but bigger one, which will hold all the events, so that whenever i want to reset the game, i will loop through that array and make everyone opacity block again.
//wth, i had problems with rerendering. the images ui was not pdating according to array changes, so what i did was created a temporary state and updated it whenever i click reset.
// now using useState i update the ui whenever temp state chnages. lmao, didnt think itd work. Not a good practise, but works.

let gameData = {
    correctPairs: 0,
    pairChecker: [],
    rememberPrevClick: [],
    allEvents: []
}


function GameBoard() {

    let Interval;
    var seconds = 0;
    var tens = 0;
    var appendTens
    var appendSeconds

    setTimeout(() => {
        appendTens = document.getElementById("tens");
        appendSeconds = document.getElementById("seconds");
    }, 100)

    const [status, setStatus] = useState("")
    const [shuffledArray, setShuffledArray] = useState(shuffleCards(imagesArray))
    const [tempState, setTempState] = useState(0);

    useEffect(() => {
    }, [tempState])

    function cardClickHandler(e) {
        if (e.target.style.opacity === "0") return

        e.target.classList.toggle("active")
        gameData.allEvents.push(e)



        if (gameData.pairChecker.length <= 1) {
            gameData.pairChecker.push(shuffledArray[e.target.id])
            gameData.rememberPrevClick.push(e)
        }

        if (gameData.pairChecker.length == 2) {
            if (gameData.pairChecker[0] == gameData.pairChecker[1]) {

                gameData.pairChecker.length = 0;
                gameData.rememberPrevClick.length = 0;
                gameData.correctPairs += 2
            }
            else {

                setTimeout(() => {
                    gameData.rememberPrevClick[0].target.classList.toggle("active")
                    gameData.rememberPrevClick[1].target.classList.toggle("active")

                    gameData.pairChecker.length = 0;
                    gameData.rememberPrevClick.length = 0;
                }, 500)

            }
        }

        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);

        checkGameEnd()

    }

    function checkGameEnd() {
        if (gameData.correctPairs == 10) {
            clearInterval(Interval);
            setStatus(`Your time was ${seconds}:${tens}`)
        }
    }

    function resetGame() {
        clearInterval(Interval);


        gameData.allEvents.map((event) => (
            event.target.classList.remove("active")
        ))
        gameData = {
            correctPairs: 0,
            pairChecker: [],
            rememberPrevClick: [],
            allEvents: []
        }
        
        setStatus("")
        setShuffledArray(shuffleCards(shuffledArray));
        setTempState(tempState + 1)
    }

    // for timer

    function startTimer() {
        tens++;

        if (tens < 9) {
            appendTens.innerHTML = "0" + tens;
        }

        if (tens > 9) {
            appendTens.innerHTML = tens;

        }

        if (tens > 99) {
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }

    }

    return (
        <>
            <div className="timer">
                <h3>Click any card to begin</h3>
                <small>If on phone, please rotate your phone for better exp.</small>
                <p><span id="seconds">00</span>:<span id="tens">00</span></p>
                <p id="text"></p>
            </div>
            <div className="gameBoardWrapper">
                {shuffledArray.map((image, id) => {
                    return (
                        <div key={id} className="imageCardWrapper">
                            <div className={`blocker img${id}`} onClick={cardClickHandler} key={id} id={id} ></div>
                            <img className={`imageCards`} src={image} />
                        </div>
                    )
                })}
            </div>
            <div>
                <div><h2>{status}</h2></div>
                <button className="reset" onClick={resetGame}>Reset</button>
            </div>
        </>
    )
}


export default GameBoard





