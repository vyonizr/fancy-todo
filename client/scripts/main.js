const baseURL = "http://localhost:3000"

$(document).ready(() => {
  console.log("ready!")
});

function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  let idToken = googleUser.getAuthResponse().id_token;

  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());

  $.ajax({
    url: `${baseURL}/user/google-sign-in`,
    method: "POST",
    data: {
      idToken
    }
  })
  .done(response => {
    console.log(response);
  })
  .fail(err => {
    console.log(err);
  })
}

function signOut() {
  console.log(gapi, "<==== gapi");
  console.log(auth2, "<== auth2");
  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  localStorage.clear()
}

function loginUser() {
  let $emailInput = $("#email-login-input").val()
  let $passwordInput = $("#password-login-input").val()

  console.log({$emailInput, $passwordInput});

  $.ajax({
    url: `${baseURL}/user/login`,
    method: "POST",
    data: {
      email: $emailInput,
      password: $passwordInput
    }
  })
  .done(response => {
    Swal.fire({
      type: "success",
      title: "Ok you're cool!",
    })

    console.log(response);
  })
  .fail(err => {
    Swal.fire({
      type: 'error',
      title: 'Oops!',
      text: `${err.responseJSON.message}`
    })

    $("#email-login-input").val("")
    $("#password-login-input").val("")
  })
}

function registerUser() {
  const $emailInput = $("#email-register-input").val()
  const $fullNameInput = $("#full-name-register-input").val()
  const $passwordInput = $("#password-register-input").val()

  $.ajax({
    url: `${baseURL}/user/register`,
    method: "POST",
    data: {
      email: $emailInput,
      name: $fullNameInput,
      password: $passwordInput
    }
  })
  .done(response => {
    Swal.fire({
      type: "success",
      title: "Ok you're cool!",
    })

    console.log(response);
  })
  .fail(err => {
    console.log(err);
      Swal.fire({
      type: 'error',
      title: 'Sorry!',
      text: `${err.responseJSON.errors.name.message}`
    })
  })
}