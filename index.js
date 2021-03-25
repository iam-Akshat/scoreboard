const defaultGameId = 'zJnlfT2dyqZouxtRS4Ho';
const baseURL = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/';
const scoresHolder = document.querySelector('.scores-holder');
const postUserScoreButton = document.querySelector('.postUserScore');
const refreshBtn = document.querySelector('.refresh-btn');
const userElement = (username, score) => {
  const userEl = document.createElement('div');
  userEl.classList.add('user-score');
  userEl.innerHTML = `
        <div class="username">${username}</div>
        <div class="score">${score}</div>
        `;
  return userEl;
};
const getUserScores = async (gameId = defaultGameId) => {
  const gameScoresURL = `${baseURL}games/${gameId}/scores`;

  const data = await fetch(gameScoresURL);
  const userScores = await data.json();

  return userScores;
};
const postUserScore = async (userName, userScore, gameId = defaultGameId) => {
  const gameScoresURL = `${baseURL}games/${gameId}/scores`;

  const res = await fetch(gameScoresURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: userName,
      score: userScore,
    }),

  });

  await res.json();
  return res;
};
const renderUserScores = async () => {
  const userScores = await getUserScores();
  scoresHolder.innerHTML = '';
  userScores.result.forEach(userScore => {
    scoresHolder.appendChild(userElement(userScore.user, userScore.score));
  });
};
(async () => {
  await renderUserScores();
})();

const submitScoreHandler = async (e) => {
  const form = document.getElementById('scoreForm');
  e.preventDefault();
  if (form.checkValidity()) {
    const username = document.getElementById('username').value;
    const score = document.getElementById('score').value;
    await postUserScore(username, score);
    form.reset();
    await renderUserScores();
  } else {
    form.reportValidity();
  }
};
refreshBtn.addEventListener('click', renderUserScores);
postUserScoreButton.addEventListener('click', submitScoreHandler);