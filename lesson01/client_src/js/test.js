"use strict";
(function(){
  let jsonTemplate = Handlebars.compile($("#posts-json-template").html());
  let tableTemplateRaw = $("#posts-table-template").html();
  let tableTemplate = Handlebars.compile(tableTemplateRaw);

  Handlebars.registerHelper({
    json: (posts) => {
      return new Handlebars.SafeString(
        `<pre> ${Handlebars.Utils.escapeExpression(JSON.stringify(posts, null, 4))} </pre>`
      );
    },
    table: (posts, options) => {
      return posts.map((post, i) => {
        let customClass = '';
        if (i%2) customClass = 'class="post-stripped"';

        return new Handlebars.SafeString(
          `<div ${customClass}> ${post.description} </div>`
        );
      }).join("");
    }
  });

  let jsonHTML = jsonTemplate({
    posts: Data.getPosts()
  });
  $(".posts-json").html(jsonHTML);

  let tableHTML = tableTemplate({
    posts: Data.getPosts()
  });
  $(".posts-table").html(tableHTML);
})();
