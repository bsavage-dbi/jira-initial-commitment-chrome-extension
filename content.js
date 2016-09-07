var JIRAInitialCommitment = JIRAInitialCommitment || (function() {

  var getParameters = window.location.search;
  var initTimeout;

  function init() {
    $(document).ready(function() {
      // add mark to JIRA items that map the initial commitment
      initTimeout = setTimeout(function() {
        $(".edit-initial-commitment-link, .set-initial-commitment-link").remove();
        $(".ghx-sprint-meta").prepend('<a href="#" class="edit-initial-commitment-link" style="margin-right: 10px;">Edit IC</a>');
        $(".ghx-sprint-meta").prepend('<a href="#" class="set-initial-commitment-link" style="margin-right: 10px;">Set IC</a>');

        $(".edit-initial-commitment-link").on('click', function() {
          var editedCommitment = window.prompt("Please edit the initial commitment:", getInitialCommitment().join(","));

          if (editedCommitment) {
            localStorage.setItem("JIRAInitialCommitment", editedCommitment);
          }

          markItems();
        });

        $(".set-initial-commitment-link").on('click', function() {
          var answer = window.confirm("Are you sure?");

          if (answer) {
            var newInitialCommitment = [];

            $(".js-detailview").each(function(i, e) {
              newInitialCommitment.push($(e).data("issue-key"));
            });

            localStorage.setItem("JIRAInitialCommitment", newInitialCommitment.join());
          }

          markItems();
        });

        markItems();
      }, 1000);
    });
  };

  setInterval(function() {
    if (getParameters != window.location.search) {
      clearTimeout(initTimeout);
      initTimeout = init();
      getParameters = window.location.search;
    }
  }, 1000);

  function markItems() {
    // always start clean
    $(".js-detailview .initial-commitment").remove();

    // decorate
    $(".js-detailview").filter(function(i, e) {
      return getInitialCommitment().indexOf($(e).data("issue-key")) >= 0;
    }).append('<div class="initial-commitment" style="position: absolute;top: 0;right: 0;border-right: 13px solid #00e8d1;border-bottom: 13px solid transparent;box-shadow: inset 10px 10px 5px 0px rgba(0,0,0,0.75);" tooltip="This is part of the initial commitment"></div>');
  }

  function getInitialCommitment() {
    var initialCommitment = localStorage.getItem("JIRAInitialCommitment");
    return initialCommitment ? initialCommitment.split(",") : [];
  }

  return {
    init: init
  };
})();

JIRAInitialCommitment.init();
