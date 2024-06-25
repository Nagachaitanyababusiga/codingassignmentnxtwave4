/*const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

//get players api
app.get('/players/', async (request, response) => {
  const getplayerquery = `
  SELECT * FROM cricket_team;
  `
  let playerArray = await db.all(getplayerquery)
  response.send(playerArray)
})

//post players api
app.post('/players/', async (request, response) => {
  const playercont = request.body
  const {playerName, jerseyNumber, role} = playercont
  const playerpostquery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        '${playerName}',
        ${jerseyNumber},
        '${role}'
      );`
  await db.run(playerpostquery)
  response.send('Player Added to Team')
})

//get player with id api
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getquery = `
  SELECT * FROM cricket_team WHERE player_id = ${playerId};
  `
  const dbobj = await db.get(getquery)
  response.send(JSON.stringify(dbobj))
})

//update player info
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playercont = request.body
  const {playerName, jerseyNumber, role} = playercont
  const updatequery = `
  UPDATE cricket_team SET 
  player_name='${playerName}',
  jersey_number='${jerseyNumber}',
  role='${role}'
  `
  await db.run(updatequery)
  response.send('Player Details Updated')
})

//delete a player from team
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const delquery = `
  DELETE FROM cricket_team WHERE player_id = ${playerId};
  `
  await db.run(delquery)
  response.send('Player Removed')
})

module.exports = app
*/

const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasePath = path.join(__dirname, 'cricketTeam.db')

const app = express()

app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team;`
  const playersArray = await database.all(getPlayersQuery)
  response.send(
    playersArray.map(eachPlayer => convertDbObjectToResponseObject(eachPlayer)),
  )
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    SELECT 
      * 
    FROM 
      cricket_team 
    WHERE 
      player_id = ${playerId};`
  const player = await database.get(getPlayerQuery)
  response.send(convertDbObjectToResponseObject(player))
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`
  const player = await database.run(postPlayerQuery)
  response.send('Player Added to Team')
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const {playerId} = request.params
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`

  await database.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
  DELETE FROM
    cricket_team
  WHERE
    player_id = ${playerId};`
  await database.run(deletePlayerQuery)
  response.send('Player Removed')
})
module.exports = app
