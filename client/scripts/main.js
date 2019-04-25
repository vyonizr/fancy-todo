const baseURL = "http://localhost:3000"

const newTaskButton = `
<div style="margin-top: 2rem;">
  <a href="#" data-toggle="modal" data-target="#create-new-task-modal">
  <i class="material-icons md-60" style="color: white ; font-size: 3rem; text-decoration: none;">add_circle_outline</i>
  </a>
  <h3 class="text-light" style="font-family: 'Source Sans Pro'; sans-serif;">Add new task</h3>
</div>
`

const signOutButton =`
<a href="#" onclick="signOut();" id="a-sign-out"><button type="button" class="btn btn-outline-dark">Sign out</button></a>`


if (localStorage.getItem("token") && localStorage.getItem("authMethod") === "basic") {
  fetchTodos()
  fetchAllUsers()

  $("#user").empty()
  $(".g-signin2").hide()
  $("#landing-page").hide()
  $("#authenticated-page").show()
  $("#user").append(signOutButton)
}


$("#open-register-card").on("click", () => {
  $(".card").toggleClass( 'is-flipped' )
  $(".login-form-wrapper").fadeOut(100)
  $(".register-form-wrapper").fadeIn(150)
});

$("#open-login-card").on("click", () => {
  $(".card").toggleClass('is-flipped')
  $(".register-form-wrapper").fadeOut(100)
  $(".login-form-wrapper").fadeIn(250)
});

$("#sidebar").hide()
$("#top-navbar").hide()

$(document).ready(() => {
  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });


  if (!localStorage.getItem("token")) {
    $("#sidebar").hide()
    $("#top-navbar").hide()
    $("#sidebarCollapse").hide()
    $("#authenticated-page").hide()
    $("#brand-a-nav").show()
    $("#landing-page").show()
  }
  else {
    $("#brand-a-nav").hide()
  }

  $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });
});


// TODO - fetchTodos()
function fetchTodos() {
  $.ajax({
    url: `${baseURL}/todos`,
    method: "GET",
    headers: {
      Authentication: localStorage.getItem("token")
    }
  })
  .done(todos => {
    console.log(todos);
    let todoCards = ""

    const aosDelays = [0, 100, 200]

    if (todos.length > 0) {
      todos.forEach(todo => {
        let createdAtSmall = `
          <small class="text-muted" id="created-at-small">Created ${moment(todo.createdAt).fromNow()}</small>
        `
        if (todo.createdAt !== todo.updatedAt) {
          createdAtSmall = `
          <small class="text-muted" id="created-at-small" title="Modified: ${moment(todo.updatedAt).format("dddd, D MMMM YYYY")} (${moment(todo.updatedAt).format("hh:mm A")})">Created ${moment(todo.createdAt).fromNow()}*</small>
          `
        }

        let dueDate = `
        <h6 class="card-subtitle mb-2 text-muted text-center" style="font-family: 'Source Sans Pro'; sans-serif;">${moment(todo.dueDate).format("dddd, D MMMM YYYY")}<br>
          ${moment(todo.dueDate).format("hh:mm A")}
        </h6>`

        todoCards += `
        <div class="col-md-4" data-aos="flip-up" data-aos-delay="${aosDelays[~~(Math.random() * aosDelays.length)]}">
          <div class="card h-auto" style="margin: 1rem; width: 19rem;">
            <div class="card-body">
              <h5 class="card-title text-center" style="font-family: 'Nunito Sans'; sans-serif; font-size: 1.8rem;">${decodeURIComponent(todo.name)}</h5>
              ${dueDate}
              <p class="card-text" style="font-family: 'Source Sans Pro'; sans-serif;">${decodeURIComponent(todo.description)}</p>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between">
                <div>
                  ${createdAtSmall}
                </div>
                <div>
                  <a href="#" id="delete-todo-icon" onclick="confirmTodoDelete({ id: '${todo._id}', owner: '${todo.UserId}' })"><i class="material-icons" style="color: #d9534f;" title="Delete">delete_forever</i></a>
                  <a href="#" id="update-todo-icon" onclick="confirmTodoUpdate({ id: '${todo._id}', name: '${encodeURI(todo.name)}', description: '${encodeURI(todo.description)}', dueDate: '${todo.dueDate}', owner: '${todo.UserId}' })" data-toggle="modal" data-target="#update-task-modal"><i class="material-icons" style="color: #0275d8;" title="Edit">edit</i></a>
                  <a href="#" id="mark-as-done-todo-icon" onclick="confirmTodoDone({ id: '${todo._id}', owner: '${todo.UserId}' })"><i class="material-icons" style="color: #5cb85c;" title="Mark as done">done</i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        `
      })
    }
    $("#todo-cards").empty();
    $("#add-new-task-button").empty();
    $("#another-user-page").hide()
    $("#personal-done-todo-page").hide()
    $("#personal-page").show()
    $("#personal-outstanding-todo-page").show()
    $("#todo-cards").append(todoCards);
    $("#add-new-task-button").append(newTaskButton)
  })
  .fail(response => {
    console.log(response);
  })
}

function fetchDoneTodos() {
  $.ajax({
    url: `${baseURL}/todos/done`,
    method: "GET",
    headers: {
      Authentication: localStorage.getItem("token")
    }
  })
  .done(todos => {
    let doneTodoCards = ""

    let doneTodoHeader = `
    <h3 class="text-light" data-aos="fade-up" data-aos-anchor-placement="top-bottom" style="margin-top: 2rem;">Your completed tasks</h3>`

    const aosDelays = [0, 100, 200]

    todos.forEach(todo => {
      let createdAtSmall = `
        <small class="text-muted" id="created-at-small">Created ${moment(todo.createdAt).fromNow()}</small>
      `
      if (todo.createdAt !== todo.updatedAt) {
        createdAtSmall = `
        <small class="text-muted" id="created-at-small" title="Modified: ${moment(todo.updatedAt).format("dddd, D MMMM YYYY")} (${moment(todo.updatedAt).format("hh:mm A")})">Created ${moment(todo.createdAt).fromNow()}*</small>
        `
      }

      let dueDate = `
      <h6 class="card-subtitle mb-2 text-muted text-center">${moment(todo.dueDate).format("dddd, D MMMM YYYY")}<br>
        ${moment(todo.dueDate).format("hh:mm A")}
      </h6>`

      doneTodoCards += `
      <div class="col-md-4" data-aos="flip-up" data-aos-delay="${aosDelays[~~(Math.random() * aosDelays.length)]}">
        <div class="card h-auto" style="margin: 1rem; width: 19rem;">
          <div class="card-body">
            <h5 class="card-title text-center">${decodeURIComponent(todo.name)}</h5>
            ${dueDate}
            <p class="card-text">${decodeURIComponent(todo.description)}</p>
          </div>
          <div class="card-footer">
            <div class="d-flex justify-content-between">
              <div>
                ${createdAtSmall}
              </div>
              <div>
                <a href="#" id="delete-todo-icon" onclick="confirmTodoDelete({ id: '${todo._id}', owner: '${todo.UserId}' })"><i class="material-icons" style="color: #d9534f;" title="Delete">delete_forever</i></a>
                <a href="#" id="mark-as-done-todo-icon" onclick="confirmTodoOutstanding({ id: '${todo._id}', owner: '${todo.UserId}' })"><i class="material-icons" style="color: #0275d8;" title="Mark as outstanding">undo</i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    })

    $("#done-todo-cards").empty();
    $("#done-todo-header").empty();
    $("#another-user-page").hide()
    $("#personal-outstanding-todo-page").hide()
    $("#personal-page").show()
    $("#personal-done-todo-page").show()
    $("#done-todo-header").prepend(doneTodoHeader)
    $("#done-todo-cards").append(doneTodoCards);
  })
  .fail(response => {
    console.log(response);
  })
}

function createATodo() {
  let $todoNameInput = $("#todo-name-input").val()
  let $todoDueDateInput = $("#todo-due-date-input").val()
  let $todoDescriptionInput = $("#todo-description-input").val()

  if($todoNameInput === "" || $todoDueDateInput === "" || $todoDescriptionInput === "") {
    Swal.fire({
      type: 'error',
      title: 'Please fill in all field',
      showConfirmButton: false,
    })
  }
    $("#todo-create-button").attr("data-dismiss", "modal")
    $.ajax({
      url: `${baseURL}/todos/${localStorage.getItem("id")}/create`,
      method: "POST",
      headers: {
        Authentication: localStorage.getItem("token")
      },
      data: {
        name: $todoNameInput,
        dueDate: $todoDueDateInput,
        description: $todoDescriptionInput,
      }
    })
    .done(response => {
      Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'New task has been created!',
        showConfirmButton: false,
        timer: 1500
      })
      fetchTodos()

      $("#todo-name-input").val("")
      $("#todo-due-date-input").val("")
      $("#todo-description-input").val("")
    })
    .fail(response => {
      console.log(response);
    })
}

function confirmTodoDelete(todo) {
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
        url: `${baseURL}/todos/${todo.id}`,
        method: "DELETE",
        headers: {
          Authentication: localStorage.getItem("token"),
          Authorization: todo.owner
        }
      })
      .done(response => {
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
  console.log(todo);
  $("#todo-name-update-input").val(decodeURIComponent(todo.name))
  $("#todo-due-date-update-input").val(moment(todo.dueDate).format("YYYY-MM-DDTHH:mm"))
  $("#todo-description-update-input").val(decodeURIComponent(todo.description))

  $("#todo-update-button").attr("onclick", `updateATodo({ id: '${todo.id}', owner: '${todo.owner}' })`);
}

function updateATodo(todo) {
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
  else {
    $.ajax({
      url: `${baseURL}/todos/${todo.id}`,
      method: "PATCH",
      headers: {
        Authentication: localStorage.getItem("token"),
        Authorization: todo.owner
      },
      data: {
        name: $todoNameUpdateInput,
        dueDate: $todoDueDateUpdateInput,
        description: $todoDescriptionUpdateInput
      }
    })
    .done(response => {
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

function confirmTodoDone(todo) {
  $.ajax({
    url: `${baseURL}/todos/${todo.id}/done`,
    method: "PATCH",
    headers: {
      Authentication: localStorage.getItem("token"),
      Authorization: todo.owner
    }
  })
  .done(response => {
    Swal.fire({
      type: 'success',
      title: 'Marked as done!',
      showConfirmButton: false,
      timer: 1500
    })
    fetchTodos()
  })
  .fail(response => {
    console.log(response);
  })
}

function confirmTodoOutstanding(todo) {
  $.ajax({
    url: `${baseURL}/todos/${todo.id}/outstanding`,
    method: "PATCH",
    headers: {
      Authentication: localStorage.getItem("token"),
      Authorization: todo.owner
    }
  })
  .done(response => {
    Swal.fire({
      type: 'success',
      title: 'Marked as outstanding',
      showConfirmButton: false,
      timer: 1500
    })
    fetchDoneTodos()
  })
  .fail(response => {
    console.log(response);
  })
}

// TODO - onSignIn(googleUser)
function onSignIn(googleUser) {
  let profile = googleUser.getBasicProfile();
  let idToken = googleUser.getAuthResponse().id_token;

  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());

  $.ajax({
    url: `${baseURL}/users/google-sign-in`,
    method: "POST",
    data: {
      idToken
    }
  })
  .done(response => {
    localStorage.setItem("token", response.token)
    localStorage.setItem("id", response.id)
    localStorage.setItem("name", response.name)
    localStorage.setItem("authMethod", "google")

    Swal.fire({
      type: "success",
      title: `Welcome, ${localStorage.getItem("name")}!`,
      showConfirmButton: false,
      timer: 1500
    })

    fetchTodos()
    fetchAllUsers()

    $("#email-login-input").val("")
    $("#password-login-input").val("")

    $("#add-new-task-button").empty()

    $(".g-signin2").hide()
    $("#brand-a-nav").hide()
    $("#landing-page").hide()

    $("#sidebar").show()
    $("#top-navbar").show()
    $("#personal-page").show()
    $("#sidebarCollapse").show()
    $("#authenticated-page").show()
    $("#personal-outstanding-todo-page").show()

    $("#user").empty()

    $("#add-new-task-button").append(newTaskButton)
    $("#user").append(signOutButton)
  })
  .fail(err => {
    console.log(err);
  })

  if (localStorage.getItem("token")) {
    $("#landing-page").hide()
    $("#add-new-task-button").empty()
    $("#add-new-task-button").append(newTaskButton)
    $("#authenticated-page").show()
  }
}

function loginUser(event) {
  event.preventDefault()
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
    localStorage.setItem("token", response.token)
    localStorage.setItem("id", response.id)
    localStorage.setItem("name", response.name)
    localStorage.setItem("authMethod", "basic")

    Swal.fire({
      type: "success",
      title: `Welcome, ${localStorage.getItem("name")}!`,
      showConfirmButton: false,
      timer: 1500
    })

    fetchTodos()
    fetchAllUsers()

    $("#email-login-input").val("")
    $("#password-login-input").val("")

    $("#add-new-task-button").empty()

    $(".g-signin2").hide()
    $("#brand-a-nav").hide()
    $("#landing-page").hide()

    $("#sidebar").show()
    $("#top-navbar").show()
    $("#personal-page").show()
    $("#sidebarCollapse").show()
    $("#authenticated-page").show()
    $("#personal-outstanding-todo-page").show()

    $("#user").empty()

    $("#user").append(signOutButton)
    $("#add-new-task-button").append(newTaskButton)
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
    $("#add-new-task-button").append(newTaskButton)
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
  $("#another-todo-owner").empty()
  $("#add-new-task-button").empty()
  $("#another-user-todo-cards").empty()

  $("#sidebar").hide()
  $("#top-navbar").hide()
  $("#sidebarCollapse").hide()
  $("#another-user-page").hide()
  $("#authenticated-page").hide()
  $("#personal-outstanding-todo-page").hide()

  $(".g-signin2").show()
  $("#brand-a-nav").show()
  $("#landing-page").fadeIn(500)
}


function registerUser(event) {
  event.preventDefault()
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

    $("#email-register-input").val("")
    $("#full-name-register-input").val("")
    $("#password-register-input").val("")

    $(".card").toggleClass('is-flipped')
    $(".register-form-wrapper").fadeOut(100)
    $(".login-form-wrapper").fadeIn(250)
  })
  .fail(err => {
    Swal.fire({
      type: 'error',
      title: 'Sorry!',
      text: `${err.responseJSON.message}`
    })
  })
}

function fetchAllUsers() {
  $.ajax({
    url: `${baseURL}/users`,
    method: "GET",
    headers: {
      Authentication: localStorage.getItem("token")
    }
  })
  .done(users => {
    let userList = ""
    users.forEach(user => {
      userList += `
      <li><a href="#" onclick="fetchSomeonesTodo('${user._id}')">${user.name}</a></li>`
    })

    $("#users-list").empty()
    $("#users-list").append(userList)
  })
  .fail(response => {
    console.log(response);
  })
}

function fetchSomeonesTodo(userId) {
  $.ajax({
    url: `${baseURL}/todos/${userId}`,
    method: "GET",
    headers: {
      Authentication: localStorage.getItem("token")
    }
  })
  .done(foundUser => {
    const somoeonesTodos = foundUser.todos
    let someonesTodoCards = ""
    const aosDelays = [0, 100, 200]
    if (somoeonesTodos.length === 0) {
      Swal.fire({
        type: 'info',
        title: "No Todo",
        text: `${foundUser.name} doesn't have any outstanding todos`,
        showConfirmButton: false
      })
    }
    else {
      somoeonesTodos.forEach(todo => {
        let createdAtSmall = `
          <small class="text-muted" id="created-at-small">Created ${moment(todo.createdAt).fromNow()}</small>
        `
        if (todo.createdAt !== todo.updatedAt) {
          createdAtSmall = `
          <small class="text-muted" id="created-at-small" title="Modified: ${moment(todo.updatedAt).format("dddd, D MMMM YYYY")} (${moment(todo.updatedAt).format("hh:mm A")})">Created ${moment(todo.createdAt).fromNow()}*</small>
          `
        }

        let dueDate = `
        <h6 class="card-subtitle mb-2 text-muted text-center">${moment(todo.dueDate).format("dddd, D MMMM YYYY")}<br>
          ${moment(todo.dueDate).format("hh:mm A")}
        </h6>`

        someonesTodoCards += `
        <div class="col-md-4" data-aos="flip-up" data-aos-delay="${aosDelays[~~(Math.random() * aosDelays.length)]}">
          <div class="card h-auto" style="margin: 1rem; width: 19rem;">
            <div class="card-body">
              <h5 class="card-title text-center">${decodeURIComponent(todo.name)}</h5>
              ${dueDate}
              <p class="card-text">${decodeURIComponent(todo.description)}</p>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between">
                <div>
                  ${createdAtSmall}
                </div>
              </div>
            </div>
          </div>
        </div>
        `
      })
    }

    $("#personal-page").hide()
    $("#another-user-page").show()
    $("#another-todo-owner").empty()
    $("#another-user-todo-cards").empty()
    $("#another-todo-owner").append(`${foundUser.name}'s Todos`)
    $("#another-user-todo-cards").append(someonesTodoCards)

  })
  .fail(response => {
    console.log(response);
  })
}