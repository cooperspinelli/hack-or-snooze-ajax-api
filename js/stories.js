"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const starOrNot = currentUser ?
    `<i class="bi bi-star favorite-star"></i>` :
    "";


  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${starOrNot}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of favorite stories, generates their HTML, and puts on page. */

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(new Story(story));
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

/** Clears new story form and hides it */

function clearAndHideNewStoryForm() {
  $submitStoryForm.trigger("reset");
  $submitStoryForm.hide();
}

/** Handles button click event for the submit new story form
* Pulls story data from form, creates new story from that data, appends
 * new story to page, and then clears and hides form */

async function handleNewStorySubmit(evt) {
  evt.preventDefault();
  const storyInputs = {
    author: $submitStoryFormAuthor.val(),
    title: $submitStoryFormTitle.val(),
    url: $submitStoryFormUrl.val(),
  };

  const newStory = await storyList.addStory(currentUser, storyInputs);
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  clearAndHideNewStoryForm();
}

$submitStoryForm.on("submit", handleNewStorySubmit);


async function handleStarClick(evt) {
  const storyIndex = $(evt.target).parent().index();
  console.log(storyIndex);
  const story = storyList.stories[storyIndex];
  console.log(story instanceof Story);
  if ($(evt.target).hasClass("bi-star")) {
    console.log("has bi-star");
    currentUser.addFavorite(story);
  } else {
    console.log("has bi-star-fill");
    currentUser.removeFavorite(story);
  }
  $(evt.target).toggleClass("bi-star-fill bi-star");
  return;
}

$storiesContainer.on("click", ".favorite-star", handleStarClick);