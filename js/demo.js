var choseLevel = document.getElementsByClassName('choseLevel')[0],
    startWrapper = document.getElementsByClassName('startWrapper')[0],
    mineBox = document.getElementsByClassName('mineBox')[0],
    startBtn = document.getElementsByClassName('startBtn')[0],
    retry = document.getElementsByClassName('retry')[0],
    giveUp = document.getElementsByClassName('giveUp')[0],
    over = document.getElementsByClassName('over')[0],
    fraudScore = document.getElementsByClassName('fraudScore')[0],
    success = document.getElementsByClassName('success')[0],
    goOn = document.getElementsByClassName('goOn')[0],
    frag = document.createDocumentFragment();

var game = {
    gameLevel: 'junior', //游戏级别
    gameState: false, //游戏是否成功
    startFlag: false, //游戏是否开始
    minesNum: 5, //雷的数量
    leftMinesNum: 25, //剩余的雷数
    leftSignNum: 25, //剩余可标记的雷数
    boxNum: 100, //格子总数
    leftBox: 100,
    rows: 10, //行数
    mineIndexArr: [],
    init: function () {
        var mineFlagNum = this.minesNum;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.rows; j++) {
                var newBox = document.createElement('div');
                newBox.id = i + '-' + j;
                frag.appendChild(newBox);
            }
        }
        mineBox.appendChild(frag);
        while (mineFlagNum > 0) {
            var index = Math.floor(Math.random() * this.boxNum);
            if (!mineBox.children[index].classList.contains('isMine')) {
                mineBox.children[index].classList.add('isMine');
                this.mineIndexArr.push(index);
                mineFlagNum--;
            }
        }
    }
}


bindEvent();
function bindEvent() {
    retry.onclick = startBtn.onclick = function () {
        mineBox.innerHTML = '';
        mineBox.style.display = 'none';
        over.style.display = 'none';
        startWrapper.style.display = 'none';
        choseLevel.style.display = 'block';
        game.startFlag = true;
        fraudScore.innerText = '';
    };
    choseLevel.onclick = function (e) {
        _this = this;
        var level = getTarget(e).className;
        if (level == 'choseLevel') {
            return;
        }
        game.gameLevel = level;
        if (level === 'medium') {
            game.minesNum = game.leftMinesNum = game.leftSignNum = 50;
            game.boxNum = game.leftBox = 225;
            game.rows = 15;
        } else if (level === 'senior') {
            game.minesNum = game.leftMinesNum = game.leftSignNum = 99;
            game.boxNum = game.leftBox = 400;
            game.rows = 20;
        } else {
            game.minesNum = game.leftMinesNum = game.leftSignNum = 25;
            game.boxNum = game.leftBox = 100;
            game.rows = 10;
        }
        mineBox.className = 'mineBox ' + level + 'Box';
        _this.style.display = 'none';
        mineBox.style.display = 'block';
        setTimeout(function () {
            fraudScore.innerText = '你猜还有几颗雷: ' + game.leftSignNum;
            game.init();
        }, 2000)
    };

    mineBox.oncontextmenu = function () {
        return false;
    };

    mineBox.onmousedown = function (e) {
        var target = getTarget(e);
        if (e.which == 1) {
            setTimeout(function() {
                leftClick(target);
            }, 600)
        } else if (e.which == 3) {
            rightClick(target);
        }
    };

    goOn.onclick = function () {
        success.style.display = 'none';
        retry.onclick();
    };

    giveUp.onclick = function () {
        mineBox.innerHTML = '';
        mineBox.style.display = 'none';
        over.style.display = 'none';
        startWrapper.style.display = 'block';
        choseLevel.style.display = 'none';
        game.startFlag = true;
        fraudScore.innerText = '';
    };
}

function getTarget(event) {
    var event = event || widow.event,
        target = event.target || event.srcElement;
    return target;
}

function leftClick(target) {
    if (!target.classList.contains('rightClickMine') && game.startFlag) {
        var x = +target.id.split('-')[0],
            y = +target.id.split('-')[1],
            aroundNum = 0;
        if (target.classList.contains('leftClicked')) {
            return;
        } else {
            target.classList.add('leftClicked');
        }

        if (target.classList.contains('isMine')) {
            Array.prototype.slice.call(document.getElementsByClassName('isMine')).forEach(function (ele, index) {
                ele.classList.add('clickMine')
            });
            // target.classList.add('clickMine');
            game.startFlag = false;
            setTimeout(function () {
                over.style.display = 'block';
            }, 500)
        } else {
            // target.style.background = '#fff';
            game.leftBox--;
            if (game.leftBox == game.minesNum) {
                gemeSuccess();
            }
            target.classList.add('clicked');
            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j);
                    if (nearBox && nearBox.classList.contains('isMine')) {
                        aroundNum++;
                    }
                }
            }
            if (aroundNum > 0) {
                target.innerText = aroundNum;
            } else {
                for (var i = x - 1; i <= x + 1; i++) {
                    for (var j = y - 1; j <= y + 1; j++) {
                        var nearBox = document.getElementById(i + '-' + j);
                        if (nearBox && !nearBox.classList.contains('clicked')) {
                            leftClick(nearBox);
                        }
                    }
                }
            }
        }
    }
}

function rightClick(target) {
    if (!target.classList.contains('clicked') && game.startFlag) {
        if (target.classList.contains('rightClickMine')) {
            target.classList.remove('rightClickMine');
            game.leftSignNum++;
            if (target.classList.contains('isMine')) {
                game.leftMinesNum++;
            }
        } else {
            target.classList.add('rightClickMine');
            game.leftSignNum--;
            if (target.classList.contains('isMine')) {
                game.leftMinesNum--;
            }
        }
        if (game.leftMinesNum == 0) {
            gemeSuccess();
        }
        fraudScore.innerText = '你猜还有几颗雷: ' + game.leftSignNum;
    }
}

function gemeSuccess() {
    game.gameState = true;
    game.startFlag = false;
    success.style.display = 'block';
}

