"use strict";

const BASE_PATH = '/json-server';
const POSTS_PATH = BASE_PATH + '/posts/';
const POST_PATH = POSTS_PATH + '/466/';
const USERS_PATH = BASE_PATH + '/users/';


function getDataJSON(url) {
  let promise = fetch(url).then(data => data.json());
  return promise;
}


function updateLikesTotal() {
  let promise = getDataJSON(POSTS_PATH)
  .then(posts => posts.reduce((sum, post) => sum + post.likeCount, 0))
  .then(value => $('.likes__count').html(value));
  return promise;
}


function updateLikes() {
  let promiselikesUpdate = getDataJSON(POST_PATH).then(({ likeCount }) => {
    return fetch(POST_PATH, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "likeCount": ++likeCount
      })
    });
});

  promiselikesUpdate.then(post => post.json())
  .then(post => {
    $('.post__likes').html(post.likeCount);
    return updateLikesTotal();
  })
  .catch(reason => {
    console.log('Error: ', reason)
  });
}


function getLikesAndComments() {
  getDataJSON(POST_PATH)
  .then(post => {
    $('.post__likes').html(post.likeCount);
    return post;
  })
  .then(({ comments }) => {
    let newComments = [];

    Promise.all(comments.map(comment => getDataJSON(USERS_PATH + comment.user)))
    .then(users => {
      let newComments = comments.map(comment => {
        let newComment = Object.assign({}, comment, { name: users.filter( user => comment.user == user.id )[0]['name'] });
        delete newComment.user;
        return newComment;
      });

      let template = Handlebars.compile($("#comments-template").html());
      $('.comments').html(template({ comments: newComments }));
    });
  }).catch(reason => {
    console.log('Error: ', reason)
  });
}

$(document).ready(function(){
  getLikesAndComments();
  updateLikesTotal().catch(reason => console.log('Error: ', reason));

  $(".post__btn").click(function(){
    updateLikes();
  });
});
