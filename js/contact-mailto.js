/*
 * Contact form fallback for static hosting (e.g. GitHub Pages).
 * There is no server here to receive a POST request, so instead of
 * submitting anywhere, this opens the visitor's own email client with
 * the message pre-filled.
 *
 * Want real form submissions without asking visitors to use their own
 * mail client? Swap this out for a service like Formspree or EmailJS
 * and point the form's `action` at that instead.
 */
document.addEventListener("DOMContentLoaded", function () {
  var DESTINATION_EMAIL = "realdanishbil@gmail.com";
  var form = document.getElementById("contact_form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (e) {
    // Let the browser's native required-field validation do its job first.
    if (typeof form.checkValidity === "function" && !form.checkValidity()) {
      return;
    }

    e.preventDefault();

    var name = (form.querySelector("#form_name") || {}).value || "";
    var email = (form.querySelector("#form_email") || {}).value || "";
    var subject = (form.querySelector("#form_subject") || {}).value || "New message from portfolio site";
    var message = (form.querySelector("#form_message") || {}).value || "";

    var body = "From: " + name + " (" + email + ")\n\n" + message;

    var mailtoUrl =
      "mailto:" + DESTINATION_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailtoUrl;
  });
});
