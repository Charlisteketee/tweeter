/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(() => {  // document ready - waits until the whole page is loaded before running functions

const $section = $('#tweet-container');

const renderTweets = function(tweets) {
  // empty the container
  $section.empty();
  // loops through tweets
  for (const tweet of tweets) {
    const $tweetArticle = createTweetElement(tweet);   // calls createTweetElement for each tweet
    $section.prepend($tweetArticle);   // takes return value and prepends it to the tweets container
  }
};

const createTweetElement = function(tweet) {
  let $tweet = $(`
    <article class="tweet">
      <header>
        <div class="user-info">
          <img src="${tweet.user.avatars}" alt="User Avatar">
          <h3>${tweet.user.name}</h3>
          <p class="handle">${tweet.user.handle}</p>
        </div>
      </header>
      <div class="content">
        <p></p> <!-- placeholder for safe tweet content -->
      </div>
      <footer>
        <p class="timestamp">${timeago.format(tweet.created_at)}</p>
        <i class="fas fa-heart"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-flag"></i>
      </footer>
    </article>  
  `);

  // prevent XSS - target the empty <p> content element and apply the .text method (ensures user-generated content is treated as plain text)
  $tweet.find('.content p').text(tweet.content.text);
  
  return $tweet;
}

  // make an Ajax GET request to receive the array of tweets as JSON
  const loadTweets = () => {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      // success callback function - calls up renderTweets and passes it the response from the Ajax request
      success: (tweets) => {
        console.log(tweets);
        renderTweets(tweets);
      }
    });
  };

  // call function - loads tweets when you open the page
  loadTweets();

  // grab the form
  const $form = $('#tweet-form');
  const $errorMessage = $('#error-message')
  const $errorText = $('#error-text');


  // handler function:
  // listener for the submit event
  $form.on('submit', (event) => {
    // prevent the default form submission behavior
    event.preventDefault();

    // validation checks:
    const tweetContent = $('#tweet-text').val();

    // If there's nothing in the form
    if (!tweetContent) {
      $errorText.text('Tweet content is empty!');
      $errorMessage.slideDown();
      return;
    }

    // if there's more than the maximum character count
    if (tweetContent.length > 140) {
      $errorText.text('Tweet content exceeds the maximum character count of 140!');
      $errorMessage.slideDown();
      return;
    }

    // if there aren't any errors, hide the error messages
    $errorMessage.slideUp();


    // grab the data from the form and serialize
    const formData = $form.serialize(); //serialize() method turns a set of form data into a query string
 
    // send the POST request of the serialized data to the server
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: formData,
      success: () => {
        // clear the input field
        $('#tweet-text').val('');

        // make a GET request to retrieve all texts without having to refresh
        loadTweets();
      }
    })
    
  })


});