/*
 * Live GitHub Portfolio
 * Pulls public, non-forked repositories for GITHUB_USERNAME from the
 * GitHub REST API and renders them into the Portfolio section, so the
 * list stays up to date automatically whenever new repos are pushed.
 */
(function ($) {
  "use strict";

  var GITHUB_USERNAME = "danishbilal98";

  function slugify(text) {
    return "category_" + String(text || "other").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function buildFilters(languages) {
    var html = '<li class="active"><a class="filter btn btn-sm btn-link" data-group="category_all">All</a></li>';
    languages.forEach(function (lang) {
      html += '<li><a class="filter btn btn-sm btn-link" data-group="' + slugify(lang) + '">' + escapeHtml(lang) + "</a></li>";
    });
    $("#portfolio-filters").html(html);
  }

  function buildCards(repos) {
    var html = repos
      .map(function (repo) {
        var lang = repo.language || "Other";
        var group = slugify(lang);
        var thumb = "https://opengraph.githubassets.com/1/" + repo.full_name;
        var stars = repo.stargazers_count || 0;

        return (
          '<figure class="item standard" data-groups=\'["category_all","' + group + '"]\'>' +
          '<div class="portfolio-item-img">' +
          '<img src="' + thumb + '" alt="' + escapeHtml(repo.name) + '" title="" />' +
          '<a href="' + repo.html_url + '" target="_blank" rel="noopener noreferrer" title="View ' + escapeHtml(repo.name) + ' on GitHub"></a>' +
          "</div>" +
          '<i class="fab fa-github"></i>' +
          '<h4 class="name">' + escapeHtml(repo.name) + "</h4>" +
          '<span class="category">' + escapeHtml(lang) + (stars ? " &#8226; &#9733; " + stars : "") + "</span>" +
          "</figure>"
        );
      })
      .join("");

    $("#portfolio-grid").html(html);
  }

  function initShuffle() {
    var $grid = $("#portfolio-grid");
    if ($grid.data("shuffle")) {
      $grid.shuffle("destroy");
    }
    $grid.shuffle({ speed: 450, itemSelector: "figure" });
  }

  function showError() {
    $("#portfolio-grid").html(
      "<p>Could not load projects from GitHub right now. " +
      '<a href="https://github.com/' + GITHUB_USERNAME + '" target="_blank" rel="noopener noreferrer">View the GitHub profile directly</a>.</p>'
    );
  }

  function loadPortfolio() {
    fetch("https://api.github.com/users/" + GITHUB_USERNAME + "/repos?per_page=100&sort=updated&direction=desc")
      .then(function (res) {
        if (!res.ok) {
          throw new Error("GitHub API error " + res.status);
        }
        return res.json();
      })
      .then(function (repos) {
        if (!Array.isArray(repos)) {
          throw new Error("Unexpected GitHub API response");
        }

        var filtered = repos.filter(function (r) {
          return !r.fork;
        });

        if (!filtered.length) {
          $("#portfolio-grid").html("<p>No public repositories found.</p>");
          return;
        }

        var languages = [];
        filtered.forEach(function (r) {
          var lang = r.language || "Other";
          if (languages.indexOf(lang) === -1) {
            languages.push(lang);
          }
        });

        buildFilters(languages);
        buildCards(filtered);

        var $ffCount = $("#ff-github-projects");
        if ($ffCount.length) {
          $ffCount.text(filtered.length);
        }

        $("#portfolio-grid").imagesLoaded(function () {
          initShuffle();
        });
      })
      .catch(function (err) {
        // eslint-disable-next-line no-console
        console.error("GitHub portfolio load failed:", err);
        showError();
      });
  }

  $(document).ready(function () {
    loadPortfolio();
  });
})(jQuery);
