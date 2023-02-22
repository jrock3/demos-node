const statsForm = document.getElementById('stats-form'),
      dreamsList = document.getElementById("dreams"),
      viewBtn = document.getElementById("view-stats"),
      addBtn = document.getElementById('add-stat'),
      editBtn = document.getElementById('edit-stat'),
      delBtn = document.getElementById('delete-stat');

const fetchPath = '/api/v1/stats/';

const handleFetch = (method) => {
  const userInfo = getUserInfo(),
        isIdRequired = method !== 'GET';
  if (isIdRequired && !userInfo.id) throw new Error('Id is required');
  const thisPath = method === 'PUT' || method === 'DELETE' ? fetchPath + userInfo.id : fetchPath;
  fetch(thisPath, fetchOptions(method, userInfo))
  .then(res => res.json())
  .then(stats => {
    console.log(stats, method);
    showStats(stats);
  })
  .catch(err => console.error(err));
};

const fetchOptions = (method, userInfo) => {
  let options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (method === 'PUT' || method === 'POST') options.body = JSON.stringify(userInfo);
  console.log('options', options);
  return options;
};

const getUserInfo = () => {
  const id = statsForm.elements.id.value,
        name = statsForm.elements.name.value,
        points_scored = statsForm.elements.points.value;
  statsForm.reset();
  return { id, name, points_scored };
};

const showStats = (stats) => {
  // wipe old stats
  dreamsList.innerHTML = '';
  // add current stats
  stats.forEach(stat => {
    const newListItem = document.createElement("li");
    newListItem.innerHTML = `<span>${stat.name}</span>, #${stat.id}, scored ${stat.points_scored} points`;
    dreamsList.appendChild(newListItem);
  });
};

// VIEW STATS button
viewBtn.addEventListener("click", (e) => {
  e.preventDefault();  
  handleFetch('GET');
});

// ADD STAT button
addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  handleFetch('POST');
});

// EDIT STAT button
editBtn.addEventListener('click', (e) => {
  e.preventDefault();
  handleFetch('PUT');
});

// DELETE STAT button
delBtn.addEventListener('click', (e) => {
  e.preventDefault();
  handleFetch('DELETE');
});


