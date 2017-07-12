const Nightmare = require('nightmare');
const nightmareOne = Nightmare({ show: false });
const nightmareTwo = Nightmare({ show: false });
const fs = require('fs');


nightmareOne
  // .goto('http://streak.espn.com/en/')
  .goto('http://streak.espn.com/en/?date=20170709')
  .wait(1000)
  .evaluate(() => {

    const removeDotsAndCarrots = (string) => {
      const newArray = string.split('').map((char) => {
        if(char === ' ' || char === '«') {
          return
        }
        return char
      })
      return newArray.join('')
    }

    let questions = document.getElementsByClassName('gamequestion');
    let startTime = document.getElementsByClassName('startTime')
    let sport = document.getElementsByClassName('sport-description')
    let opponentOne = document.getElementsByClassName('opponents')
    let opponentTwo = document.getElementsByClassName('last')
    let userVoting = document.getElementsByClassName('wpw')
    let matchUpStatus = document.getElementsByClassName('matchupStatus')

    let opponentOneCleaned = Object.keys(opponentOne).map(key => {
      return removeDotsAndCarrots(opponentOne[key].innerText)
    })

    let array = []

    for (let i = 0; i < questions.length; i++) {
      array.push({
        question: questions[i].innerText,
        starttime: startTime[i].innerText,
        sport: sport[17].innerText,
        status: matchUpStatus[i].innerText,
        opponents: {
          optionOne: opponentOneCleaned[ i + (i + 1) ],
          optionTwo: opponentOneCleaned[ i + (i + 2) ]
        },
        userVote: {
          oppOne: userVoting[ (i * 4) + 2 ].innerText,
          oppTwo: userVoting[ (i * 4) + 4 ].innerText
        }
      })
    }
    return array
  })
  .end()
  .then((result) => {
    console.log(result, 'result');
    const streakData = JSON.stringify({ result: result})
    fs.writeFile('./data/streakData.json', streakData, 'utf8');
  })
  .catch((error) => {
     console.error('Nightmare One Failed:', error);
  });


  nightmareTwo
    // .goto('http://www.vegasinsider.com/mlb/matchups/')
    .goto('http://www.vegasinsider.com/mlb/matchups/matchups.cfm/date/07-09-17')
    .wait(1000)
    .evaluate(() => {

      const removeDotsAndCarrots = (string) => {
        const newArray = string.split('').map((char) => {
          if(char === ' ' || char === '«') {
            return
          }
          return char
        })
        return newArray.join('')
      }

      let games = document.getElementsByClassName('viheadernorm');
      let tableDataRaw = document.getElementsByClassName('vicellbg2');
      let tableDataClean = Object.keys(tableDataRaw).reduce((acc, val) => {

        if(!tableDataRaw[val].innerText.includes('Push') &&
           !tableDataRaw[val].innerText.includes('Cover') &&
           !tableDataRaw[val].innerText.includes('Under') &&
           !tableDataRaw[val].innerText.includes('Over')) {
             console.log(tableDataRaw[val])
             const result = removeDotsAndCarrots(tableDataRaw[val].innerText)
             acc.push(result)
        }
        return acc
      }, [])


      let array = []

      for (let i = 0; i < games.length; i++) {
        array.push({
          game: games[i].innerText,
          sport: 'MLB',
          teamOne: tableDataClean[ i + (i * 21) ],
          teamTwo: tableDataClean[ i + 11 + (i * 21) ],
          pitcherOne: tableDataClean[ i + 1 + (i * 21) ],
          pitcherTwo: tableDataClean[ i + 12 + (i * 21) ],
          wlTeamOne: tableDataClean[ i + 2 + (i * 21) ],
          wlTeamTwo: tableDataClean[ i + 13 + (i * 21) ],
          strTeamOne: tableDataClean[ i + 3 + (i * 21) ],
          strTeamTwo: tableDataClean[ i + 14 + (i * 21) ],
          openMLTeamOne: tableDataClean[ i + 4 + (i * 21) ],
          openMLTeamTwo: tableDataClean[ i + 15 + (i * 21) ],
          curMLTeamOne: tableDataClean[ i + 6 + (i * 21) ],
          curMLTeamTwo: tableDataClean[ i + 17 + (i * 21) ]
        })
      }
      return array
    })
    .end()
    .then((result) => {

      const vegasData = JSON.stringify({ result: result })
      fs.writeFile('./data/vegasData.json', vegasData, 'utf8');

    })
    .catch((error) => {
      console.error('Nightmare Two Failed:', error);
    });
