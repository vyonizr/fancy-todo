const baseURL = "http://localhost:3000"

if (localStorage.getItem("token") && localStorage.getItem("authMethod") === "basic") {
  fetchTodos()
  const signOutButton =`
  <a href="#" onclick="signOut();" id="a-sign-out">Sign out</a>`

  $(".g-signin2").hide()
  $("#landing-page").hide()
  $("#authenticated-page").show()
  $("#user").empty()
  $("#user").append(signOutButton)
}

$(document).ready(() => {
  if (!localStorage.getItem("token")) {
    $("#authenticated-page").hide()
    $("#landing-page").show()
  }
});


// TODO - Todo scripts


function pastTime(a) {
  if (Math.abs(moment().diff(this)) < 1000) { // 1000 milliseconds
      return 'just now';
  }
  return this.fromNow(a);
}

function fetchTodos() {
  console.log("masuk fetch");
  $.ajax({
    url: `${baseURL}/todos`,
    method: "GET",
    data: {
      token: localStorage.getItem("token")
    }
  })
  .done(todos => {
    let todoCards = ""
    console.log(todos);

    const aosDelays = [0, 100, 200]
    todos.forEach(todo => {
      todoCards += `
      <div class="col-md-4" data-aos="flip-up" data-aos-delay="${aosDelays[~~(Math.random() * aosDelays.length)]}">
        <div class="card h-auto" style="margin: 1rem">
          <div class="card-body">
            <h5 class="card-title text-center">${todo.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted text-center">${moment(todo.dueDate).format("dddd, D MMMM YYYY")}<br>
              ${moment(todo.dueDate).format("hh:mm A")}
            </h6>
            <p class="card-text">${todo.description}</p>
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-between">
              <div>
                <small class="text-muted">Created ${moment(todo.createdAt).fromNow()}</small>
              </div>
              <div>
                <button type="submit" class="btn btn-outline-danger btn-sm" onclick="confirmTodoDelete('${todo._id}')">Delete</button>
                <button type="submit" class="btn btn-outline-primary btn-sm" onclick="confirmTodoUpdate({id: '${todo._id}', name: '${todo.name}', description: '${todo.description}', dueDate: '${todo.dueDate}'})" data-toggle="modal" data-target="#update-task-modal">Update</button>
                <button type="submit" class="btn btn-success btn-sm" onclick="confirmTodoDone('${todo._id}')">Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    })

    $("#todo-cards").empty();
    $("#todo-cards").append(todoCards);
  })
  .fail(response => {
    console.log(response);
  })
}

function createATodo() {
  console.log("create kah");
  let $todoNameInput = $("#todo-name-input").val()
  let $todoDueDateInput = $("#todo-due-date-input").val()
  let $todoDescriptionInput = $("#todo-description-input").val()
  console.log($todoNameInput, "<= todo name input");
  console.log($todoDueDateInput, "<= todo description input");
  console.log($todoDescriptionInput, "<= todo due input");

  if($todoNameInput === "" || $todoDueDateInput === "" || $todoDescriptionInput === "") {
    Swal.fire({
      type: 'error',
      title: 'Please fill in all field',
      showConfirmButton: false,
    })
  }
  else {
    $("#todo-create-button").attr("data-dismiss", "modal")
    $.ajax({
      url: `${baseURL}/todos/${localStorage.getItem("id")}/create`,
      method: "POST",
      data: {
        name: $todoNameInput,
        dueDate: $todoDueDateInput,
        description: $todoDescriptionInput,
        token: localStorage.getItem("token")
      }
    })
    .done(response => {
      console.log(response);
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'New task has been created!',
        showConfirmButton: false,
        timer: 1500
      })
      fetchTodos()
    })
    .fail(response => {
      console.log(response);
    })
  }
}

function confirmTodoDelete(todoId) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-outline-danger',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false,
  })

  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      $.ajax({
        url: `${baseURL}/todos/${todoId}`,
        method: "DELETE",
        data: {
          token: localStorage.getItem("token")
        }
      })
      .done(response => {
        console.log(response);
        Swal.fire({
          type: 'success',
          showConfirmButton: false,
          timer: 1000
        })
        fetchTodos()
      })
      .fail(response => {
        console.log(response);
      })
    }
  })
}

function confirmTodoUpdate(todo) {
  $("#todo-name-update-input").val(todo.name)
  $("#todo-due-date-update-input").val(moment(todo.dueDate).format("YYYY-MM-DDTHH:mm"))
  $("#todo-description-update-input").val(todo.description)

  $("#todo-update-button").attr("onclick", `updateATodo('${todo.id}')`);
}

function updateATodo(todoId) {
  let $todoNameUpdateInput = $("#todo-name-update-input").val()
  let $todoDueDateUpdateInput = $("#todo-due-date-update-input").val()
  let $todoDescriptionUpdateInput = $("#todo-description-update-input").val()

  if($todoNameUpdateInput === "" || $todoNameUpdateInput === "" || $todoNameUpdateInput === "") {
    Swal.fire({
      type: 'error',
      title: 'Please fill in all field',
      showConfirmButton: false,
    })
  }
  else {v

    $.ajax({
      url: `${baseURL}/todos/${todoId}`,
      method: "PATCH",
      data: {
        name: $todoNameUpdateInput,
        dueDate: $todoDueDateUpdateInput,
        description: $todoDescriptionUpdateInput,
        token: localStorage.getItem("token")
      }
    })
    .done(response => {
      console.log(response);
      Swal.fire({
        type: 'info',
        title: 'Updated!',
        showConfirmButton: false,
        timer: 1000
      })
      fetchTodos()
    })
    .fail(response => {
      console.log(response);
    })
  }
}

function confirmTodoDone(todoId) {
  $.ajax({
    url: `${baseURL}/todos/${todoId}/done`,
    method: "PATCH",
    data: {
      token: localStorage.getItem("token")
    }
  })
  .done(response => {
    console.log(response);
    Swal.fire({
      type: 'success',
      title: 'Yay!',
      showConfirmButton: false,
      timer: 1500
    })
    fetchTodos()
  })
  .fail(response => {
    console.log(response);
  })
}


// TODO - Authentication scripts

function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  let idToken = googleUser.getAuthResponse().id_token;

  // console.log('ID: ' + profile.getId());
  // console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail());

  $.ajax({
    url: `${baseURL}/users/google-sign-in`,
    method: "POST",
    data: {
      idToken
    }
  })
  .done(response => {
    console.log(response);
    localStorage.setItem("token", response.token)
    localStorage.setItem("id", response.id)
    localStorage.setItem("name", response.name)
    localStorage.setItem("authMethod", "google")

    // Swal.fire({
    //   type: "info",
    //   title: `Welcome, ${localStorage.getItem("name")}!`,
    // })

    fetchTodos()
    const signOutButton =`
    <a href="#" onclick="signOut();" id="a-sign-out">Sign out</a>`

    $(".g-signin2").hide()
    $("#landing-page").hide()
    $("#authenticated-page").show()
    $("#user").empty()
    $("#user").append(signOutButton)
  })
  .fail(err => {
    console.log(err);
  })

  if (localStorage.getItem("token")) {
    $("#landing-page").hide()
    $("#authenticated-page").show()
  }
}

function loginUser() {
  let $emailInput = $("#email-login-input").val()
  let $passwordInput = $("#password-login-input").val()

  $.ajax({
    url: `${baseURL}/users/login`,
    method: "POST",
    data: {
      email: $emailInput,
      password: $passwordInput
    }
  })
  .done(response => {
    console.log(response);
    localStorage.setItem("token", response.token)
    localStorage.setItem("id", response.id)
    localStorage.setItem("name", response.name)
    localStorage.setItem("authMethod", "basic")

    Swal.fire({
      type: "success",
      title: `Welcome, ${localStorage.getItem("name")}!`,
    })

    fetchTodos()
    const signOutButton =`
    <a href="#" onclick="signOut();" id="a-sign-out">Sign out</a>`

    $(".g-signin2").hide()
    $("#landing-page").hide()
    $("#authenticated-page").show()
    $("#user").empty()
    $("#user").append(signOutButton)
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

  if (localStorage.getItem("token")) {
    $("#landing-page").hide()
    $("#authenticated-page").show()
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  if (auth2) {
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }


  localStorage.clear()
  $("#todo-cards").empty()
  $("#user").empty()
  $("#authenticated-page").hide()
  $(".g-signin2").show()
  $("#landing-page").show()
}


function registerUser() {
  const $emailInput = $("#email-register-input").val()
  const $fullNameInput = $("#full-name-register-input").val()
  const $passwordInput = $("#password-register-input").val()

  $.ajax({
    url: `${baseURL}/users/register`,
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
      title: "Registration success!",
    })
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

