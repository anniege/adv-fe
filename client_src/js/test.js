"use strict";
(function(){
  let jsonTemplate = Handlebars.compile($("#posts-json-template").html());
  let tableTemplateRaw = $("#posts-table-template").html();
  let tableTemplate = Handlebars.compile(tableTemplateRaw);

  Handlebars.registerHelper({
    json: (posts) => {
      return new Handlebars.SafeString(
        "<pre>" + JSON.stringify(posts, null, 4)  + "</pre>"
      );
    },
    table: (posts, options) => {
      console.log(posts);

      return posts.map((post, i) => {
        let openTag = "<div>";
        if (i%2 === 0) openTag = "<div class=\"post-stripped\">";

        return new Handlebars.SafeString(
          openTag + post.description + "</div>"
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
