"use strict";

const createTwitterTimeline = (timeline) => {
  const twitterTimelineList = document.querySelector('.twitter-timeline');

  for (let i = 0; i < timeline.length; i++){
    const item = timeline[i];

    var li = document.createElement('li');
    li.innerHTML = item;
    twitterTimelineList.appendChild(li);
  }
};

const load = () => {
  console.log('dom loaded');

  const twitterTimelineButton = document.querySelector('.btn-twitter-timeline');

  twitterTimelineButton.addEventListener('click', (event) =>
    fetch('http://google.com')
      .then((result) => console.log(result))
      .then(() => { createTwitterTimeline(['cool tweed 1', 'nice tweed 2']); });
  );
};

document.addEventListener('DOMContentLoaded', load, false);
