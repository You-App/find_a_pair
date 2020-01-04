var fieldsGame = document.getElementById('fieldsGame')
var tablo = document.querySelector('#tablo')
var btnSound = document.getElementById('soundOff')
var audio = document.getElementById('audio1');



var set = new Set()
var def = { max: 2, x: 2, startFunc: true, blockGame: false, stopTimer: false }

initGame()

tablo.addEventListener('click', function () {
    if (def.startFunc) {
        document.body.classList.remove('win')
        fieldsGame.style.width = 500 + 'px'
        fieldsGame.style.height = 500 + 'px'
        this.classList.remove('gameStart')
        gameTimer()
    }
})

var interval
function gameTimer() {
    clearInterval(interval)

    if (!btnSound.classList.contains('soundOff') && audio.paused) {
        audio.play();
    } else {
        audio.currentTime = 0
    }


    def = { max: 2, x: 2, level: 1, timer: 120, startFunc: true, blockGame: true, stopTimer: false }
    tablo.children[1].children[0].innerHTML = def.level
    set.clear()
    initGame()

    

    interval = setInterval(() => {
        if (def.timer <= 0 && def.stopTimer != true) {

            clearInterval(interval)
            tablo.classList.add('gameOver')
            set.clear()

            audio.pause()
            audio.currentTime = 0
            btnSound.disabled = true

            var play = playAudio('game-over.mp3')

            def = { max: 2, x: 2, startFunc: false, blockGame: false }

            initGame()
            play.addEventListener("ended", function () {
                tablo.classList.remove('gameOver')
                tablo.classList.add('gameStart')
                def.startFunc = true
                btnSound.disabled = false
            });
        }
        else {
            tablo.children[0].innerHTML = def.timer
            def.timer--
        }
    }, 1000);
}


function initGame() {

    function addArr() {
        var addDuble = new Set()
        while (addDuble.size < def.max) {
            addDuble.add(Math.floor(getRandomArbitrary(1, 47)))  //писать на один больше
        }
        var res = [].concat([...addDuble], [...addDuble])
        addDuble.clear()
        return res
    }

    // console.log(addArr())
    function shufle(arr) {
        var newArr = []
        var length = arr.length
        for (var i = 0; i < length; i++) {
            var rand = getRandomArbitrary(0, arr.length)
            var sp = arr.splice(rand, 1)
            newArr.push(sp)
        }
        return newArr
    }

    var num = shufle(addArr())

    createBox()
    function createBox() {
        fieldsGame.innerHTML = ''
        for (let i = 0; i < addArr().length; i++) {
            var box = createElements(fieldsGame, 'box')
            box.setAttribute('data-num', num[i])
            var backCard = createElements(box, 'backCard commonStyles')
            var frontCard = createElements(box, 'frontCard commonStyles')
            frontCard.style.background = `#fff url(./pik/${num[i]}.png) no-repeat center/contain`
            if (def.blockGame) box.addEventListener('mousedown', game)
        }
    }
}


function game() {
    var box = document.querySelectorAll('.box')
    this.classList.add('rotateCard')
    playAudio('click.mp3')

    set.add(this)
    if (set.size > 1 && [...set][0].dataset.num == [...set][1].dataset.num) {
        for (const elem of set) {
            elem.disabled = true
            
            def.timer += 15
            
        }
        playAudio('dzin1.mp3')
        set.clear()
        def.x--
    }

    else if (set.size > 1 && [...set][0].dataset.num != [...set][1].dataset.num) {
        setTimeout(() => {
            for (const elem of set) {
                elem.classList.remove('rotateCard')
            }
            set.clear()
            stopFunc(box, true)
        }, 800)
        stopFunc(box, false)
    }

    


    if (def.x <= 0) {
        def.stopTimer = true
        setTimeout(() => {
            document.body.style.background = `url(bg/${Math.floor(getRandomArbitrary(0, 5))}.jpg) no-repeat center/cover`

            if (def.max < 46) {

                def.level++
                tablo.children[1].children[0].innerHTML = def.level
                def.stopTimer = false
                def.timer = 120
                def.max = def.max + 2
                def.x = def.max
                if (def.max > 6) {
                    fieldsGame.style.width = fieldsGame.offsetWidth + 100 + 'px'
                    fieldsGame.style.height = fieldsGame.offsetHeight + 100 + 'px'
                }
                initGame()

            }
            else {
                clearInterval(interval)
                fieldsGame.innerHTML = ''
                document.body.classList.add('win')
                alert('ИГРА ОКОНЧЕНА ПОЗДРАВЛЯЕМ!!!!!!')
                var win = 'ИГРА ОКОНЧЕНА ПОЗДРАВЛЯЕМ!!!!!!'
                console.log('%c%s', 'color: green; font: 1.2rem/1 Tahoma;', win)
            }

        }, 800)
    }

}


var bg = [0,1,2,3,4,5]

function createElements(main, className) {
    var div = document.createElement('button')
    div.className = className
    main.appendChild(div)
    return div
}

function stopFunc(Nlist, bool) {
    for (const elem of Nlist) {
        if (bool) {
            elem.addEventListener('mousedown', game)
        }
        else {
            elem.removeEventListener('mousedown', game)
        }
    }
}

function playAudio(sound) {
    var myAudio = new Audio;
    myAudio.src = `./sound/${sound}`;
    myAudio.play();
    return myAudio
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


btnSound.addEventListener('click', function () {
    this.classList.toggle('soundOff')
    if (this.classList.contains('soundOff')) {
        audio.pause()
    }

    if (!this.classList.contains('soundOff') && !tablo.classList.contains('gameStart')) {
        audio.play();
    }
})
