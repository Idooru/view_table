// Function to save user information to localStorage
const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

const setUsers = (users) =>
  localStorage.setItem("users", JSON.stringify(users));

const saveUserInfo = () => {
  const name = $("#name").val();
  const email = $("#email").val();

  if (name && email) {
    // Check if the user already exists in localStorage
    let users = getUsers();

    // Check if the user with the same email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      alert("User with this email already exists!");
    } else {
      const id =
        users.length === 0 ? 0 : Math.max(...users.map((user) => user.id)) + 1;

      users = [...users, { id, name, email }];

      // Save the updated array back to localStorage
      setUsers(users);

      // Update the user table
      updateTable();
      // location.reload();
    }
  } else {
    alert("Please enter both name and email.");
  }
};

const modifyName = (event) => {
  const target = $(event.target);
  const currentText = target.text();
  const currentId = target.siblings(".id_item").text();
  target.html(
    `<input class="mod_area" type="text" value='${currentText}' maxlength="6" />`,
  );
  target
    .find("input")
    .focus()
    .keypress((event) => {
      if (event.which === 13) {
        const target = $(event.target);
        const newText = target.val();

        if (!newText) return alert("input least one word");

        target.parent().html(newText);

        const users = getUsers();
        const nowIndex = currentId - 1;
        const currentUser = users[nowIndex];
        currentUser.name = newText;
        users.splice(nowIndex, 1, currentUser);

        setUsers(users);
      }
    });
};

const modifyEmail = (event) => {
  const target = $(event.target);
  const currentText = target.text();
  const currentId = target.siblings(".id_item").text();
  target.html(
    `<input class="mod_area" type="text" value='${currentText}' maxlength="30" />`,
  );
  target
    .find("input")
    .focus()
    .keypress((event) => {
      if (event.which === 13) {
        const target = $(event.target);
        const newText = target.val();

        const regEmail =
          /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{3,}$/;

        if (!regEmail.test(newText)) return alert("invalid email form");

        const users = getUsers();
        const existEmail = users.find((user) => user.email === newText);
        if (existEmail) return alert("User with this email already exists!");

        target.parent().html(newText);

        const nowIndex = currentId - 1;
        const currentUser = users[nowIndex];
        currentUser.email = newText;
        users.splice(nowIndex, 1, currentUser);

        setUsers(users);
      }
    });
};

const deleteUser = (event) => {
  const target = $(event.target);
  const currentId = parseInt(target.parent().siblings(".id_item").text());
  console.log(currentId);

  let users = getUsers();
  users = users.filter((user) => user.id !== currentId);

  setUsers(users);
  updateTable();
};

const sendEmail = (event) => {};

// Function to update the user table
const updateTable = () => {
  // Clear the existing table rows
  $("#userTable tbody").empty();

  // Get the users from localStorage
  const users = getUsers();

  // Check if there are users to display
  if (users.length > 0) {
    // Hide the "No users available" message
    $("#noUserMessage").hide();

    // Show the table
    $("#userTable").show();

    // Populate the table with user data
    users.forEach((user, idx) => {
      $("#userTable tbody").append(
        `<tr>
          <td class="id_item">${user.id}</td>
          <td class='name_item'>${user.name}</td>
          <td class='email_item'>${user.email}</td>
          <td class='date_item'>${Date.now()}</td>    
          <td class='time_item'>${Date.now()}</td>     
          <td class='method_item'>${"method"}</td>
          <td class="delete_button"><i class="fa-solid fa-trash"></i></td>
          <td class="send_button"><i class="fa-solid fa-envelope"></i></td>
         </tr>`,
      );
      $(".name_item").click(modifyName);
      $(".email_item").click(modifyEmail);
      $(".delete_button").click(deleteUser);
      $(".send_button").click(sendEmail);
    });
  } else {
    // Show the "No users available" message
    $("#noUserMessage").show();

    // Hide the table
    $("#userTable").hide();
  }
};

$("button").click(saveUserInfo);
// Initial table update
updateTable();
