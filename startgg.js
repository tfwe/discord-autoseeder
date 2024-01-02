const axios = require('axios');
const logger = require('./logger');
const url = 'https://api.start.gg/gql/alpha';
const STARTGG_TOKEN = process.env.STARTGG_TOKEN

async function fetchSetData(id) {
  const query = `
query SetData {
  set(id: ${id}) {
    id
    state
    round
    displayScore
    winnerId
    event {
      id
      name
      tournament {
        id
        name
      }
    }
    slots {
      entrant {
        id
        name
      }
    }
  }
}`
  const result = await queryStartGG(query)
  return result.data.set
}

async function fetchPlayerData(id, page=1, perPage=15) {
  const query = `
query Sets {
  player(id: ${id}) {
    id
    prefix
    gamerTag
    sets(perPage: ${perPage}, page: ${page}) {
      pageInfo {
        page
        total
        totalPages
      }
      nodes {
        id
        displayScore
        event {
          id
          name
          tournament {
            id
            name
          }
        }
      }
    }
  }
}
`
  const result = await queryStartGG(query)
  logger.info(result)
  return result.data.player
}

async function fetchLeagueEvents(slug, page=1, perPage=15, allowOnline=false) {
  const query = `
query LeagueEvents {
  league(slug: "clash-at-carleton-fall-2023-smash-ultimate-singles") {
    id
    name
    events(query: {page: ${page}, perPage: ${perPage}}) {
      pageInfo {
        page
        total
        totalPages
      }
      nodes {
        id
        sets(filters: {isEventOnline: ${allowOnline}, state: 3}) {
          nodes {
            id
          }
        }
      }
    }
  }
}`
  const result = await queryStartGG(query)
  logger.info(result)
  return result.data.league.events
}

async function fetchLeagueStandings(slug, page=1, perPage=10) {
  const query = `
query LeagueStandings {
  league(slug: "${slug}") {
    id
    name
    standings (query: {
      page: ${page},
      perPage: ${perPage}
    }) {
      pageInfo {
        page
        total
        totalPages
      }
      nodes {
        id
        placement
        entrant {
          participants {
            player {
              id
            }
          }
          name
        }
      }
    }
  }
}`;
  const result = await queryStartGG(query)
  return result.data.league.standings
};

async function queryStartGG(query) {
  try {
    const response = await axios.post(url, {
      query
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STARTGG_TOKEN}`
      }
    });

    return response.data
  } catch (error) {
    logger.error(`Error: ${error}`);
  }
}

module.exports = { 
  fetchLeagueStandings, 
  fetchLeagueEvents, 
  fetchSetData, 
  fetchPlayerData 
};
