// state of game (id's)
const GameStates = ['start', 'play', 'end']

// default state
let curState = 0
let curImageState
let score = 0
let skipped = 0
let nog = 1
let noq = 1



var lzy = new LazyLoad({
  // Your custom settings go here
});

const allowed_uri = 'https://thispersondoesnotexist.com/'
let imgs_done = []

const state = () => GameStates[curState]

const refresh = st => {
  $(`#${state()}`).removeClass('active')
  curState = st
  $(`#${state()}`).addClass('active')
}

const play = {
  setNewImg : function () {
    $('#playImg').attr('src', '')
    curImageState = Math.floor(Math.random() * 2) % 2
    get_image_uri(curImageState, (url, lowq) => {
      if (url != allowed_uri && imgs_done.includes(url)) {
        return this.setNewImg()
      }
      
      if (url != allowed_uri)
        imgs_done.push(url)
      $('#playImg').css('background-image', 'none')
      $('#playImg').css('background-image', 'url('+lowq+')')
      $('#loaderImg').removeClass('hidden')
    })
  },
  skipImg : function() {
    noq += 1
    $('#noq').html(noq)
    if ( skipped > 6 ) {
      alert("Uh oh, you can't skip too much :O");
      return
    }
    skipped += 1
    this.setNewImg()
  },
  guess: function(gai) {
    if ( nog >= noq+1 ) {
      nog = noq -1
      return
    }
    nog+=1
    $('#nog').html(nog)
    console.log("Was ", curImageState, ", guessed =", gai)
    // correct
    if ( gai == curImageState ) {
      // increase score
      score += 5
      // reduce skip count by 2!3A59-C80B
      skipped = Math.max(skipped-2,0)
      $('#correct').removeClass('hidden')
      $('#score').html(score)
      setTimeout(() => $('#correct').addClass('hidden'), 800)
    } else {
      // randomly subtract either 1 or none at all
      skipped = Math.max(skipped-Math.floor(Math.random()*2)%2,0)
      $('#incorrect').removeClass('hidden')
      setTimeout(() => $('#incorrect').addClass('hidden'), 800)
    }
    let scorePerc = Math.round((score/(noq*5))*10000)/100
    $('#perc').html(scorePerc + '%')
    noq += 1
    $('#noq').html(noq)
    this.setNewImg()
  }
}

const handleEnds = [
  play.setNewImg, () => {}, () => {}
]

const end_func = c => handleEnds[c]()

// default screen
refresh(curState)

GameStates.forEach(x => {$(`#${x}-end`).click(() => {
  const prv = curState
  const nxt = (curState+1) % GameStates.length
  refresh(nxt)
  handleEnds[prv]()
})})