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



document.addEventListener('DOMContentLoaded', load, false);
