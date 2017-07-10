const Nightmare = require('nightmare');
const nightmareOne = Nightmare({ show: true });
const nightmareTwo = Nightmare({ show: true });
const fs = require('fs');

const scrapeEspn = () => {
  let array = []

  let questions = document.getElementsByClassName('gamequestion');
  let startTime = document.getElementsByClassName('startTime')
  let sport = document.getElementsByClassName('sport-description')
  let opponentOne = document.getElementsByClassName('opponents')
  let opponentTwo = document.getElementsByClassName('last')
  let userVoting = document.getElementsByClassName('wpw')
  let matchUpStatus = document.getElementsByClassName('matchupStatus')

  for (let i = 0; i < questions.length; i++) {
    array.push({
      question: questions[i].innerText,
      starttime: startTime[i].innerText,
      sport: sport[i].innerText,
      status: matchUpStatus[i].innerText,
      opponents: {
        optionOne: opponentOne[ i + (i + 1) ].innerText,
        optionTwo: opponentOne[ i + (i + 2) ].innerText
      },
      userVote: {
        oppOne: userVoting[ (i * 4) + 2 ].innerText,
        oppTwo: userVoting[ (i * 4) + 4 ].innerText
      }
    })
  }
  return array
}

nightmareOne
  .goto('http://streak.espn.com/en/')
  .wait(1000)
  .evaluate(() => {

    //NOTE function is not recognized???
    // scrapeEspn()

    let array = []

    let questions = document.getElementsByClassName('gamequestion');
    let startTime = document.getElementsByClassName('startTime')
    let sport = document.getElementsByClassName('sport-description')
    let opponentOne = document.getElementsByClassName('opponents')
    let opponentTwo = document.getElementsByClassName('last')
    let userVoting = document.getElementsByClassName('wpw')
    let matchUpStatus = document.getElementsByClassName('matchupStatus')

    for (let i = 0; i < questions.length; i++) {
      array.push({
        question: questions[i].innerText,
        starttime: startTime[i].innerText,
        sport: sport[i].innerText,
        status: matchUpStatus[i].innerText,
        opponents: {
          optionOne: opponentOne[ i + (i + 1) ].innerText,
          optionTwo: opponentOne[ i + (i + 2) ].innerText
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
    const streakData = JSON.stringify({ result: result})
    fs.writeFile('./streakData.json', streakData, 'utf8');
    // console.log(result, 'result');
  })
  .catch((error) => {
     console.error('Search failed:', error);
  });

  nightmareTwo
    // .goto('http://www.vegasinsider.com/mlb/matchups/')
    .goto('http://www.vegasinsider.com/mlb/matchups/matchups.cfm/date/07-09-17')
    .wait(1000)
    .evaluate(() => {

      let games = document.getElementsByClassName('viheadernorm');
      let tableDataRaw = document.getElementsByClassName('vicellbg2');
      let tableDataClean = Object.keys(tableDataRaw).reduce((acc, val) => {

        if(!tableDataRaw[val].innerText.includes('Push') &&
           !tableDataRaw[val].innerText.includes('Cover') &&
           !tableDataRaw[val].innerText.includes('Under') &&
           !tableDataRaw[val].innerText.includes('Over')) {

             acc.push(tableDataRaw[val])
        }
        return acc
      }, [])

      let array = []

      for (let i = 0; i < games.length; i++) {
        array.push({
          game: games[i].innerText,
          sport: 'MLB',
          teamOne: tableDataClean[ i + (i * 21) ].innerText,
          teamTwo: tableDataClean[ i + 11 + (i * 21) ].innerText,
          pitcherOne: tableDataClean[ i + 1 + (i * 21) ].innerText,
          pitcherTwo: tableDataClean[ i + 12 + (i * 21) ].innerText,
          wlTeamOne: tableDataClean[ i + 2 + (i * 21) ].innerText,
          wlTeamTwo: tableDataClean[ i + 13 + (i * 21) ].innerText,
          strTeamOne: tableDataClean[ i + 3 + (i * 21) ].innerText,
          strTeamTwo: tableDataClean[ i + 14 + (i * 21) ].innerText,
          openMLTeamOne: tableDataClean[ i + 4 + (i * 21) ].innerText,
          openMLTeamTwo: tableDataClean[ i + 15 + (i * 21) ].innerText,
          curMLTeamOne: tableDataClean[ i + 6 + (i * 21) ].innerText,
          curMLTeamTwo: tableDataClean[ i + 17 + (i * 21) ].innerText
        })
      }
      return array
    })
    .end()
    .then((result) => {
      const vegasData = JSON.stringify({ result: result})
      fs.writeFile('./vegasData.json', vegasData, 'utf8');

      // console.log(result, 'result');
    })
    .catch((error) => {
      console.error('Search failed:', error);
    });
