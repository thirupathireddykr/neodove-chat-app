document.addEventListener("DOMContentLoaded", () => {
  const authDiv = document.getElementById("auth");
  const chatDiv = document.getElementById("chat");

  const showLogin = () => {
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "none";
  };

  const showRegister = () => {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
  };

  window.showLogin = showLogin;
  window.showRegister = showRegister;

  const login = () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          authDiv.style.display = "none";
          chatDiv.style.display = "block";
          initializeWebSocket();
        } else {
          alert("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const register = () => {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const email = document.getElementById("registerEmail").value;

    fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then((response) => {
        if (response.ok) {
          showLogin();
          alert("Registration successful");
        } else {
          alert("Registration failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  window.login = login;
  window.register = register;

  const initializeWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const messages = document.getElementById("messages");
      const message = document.createElement("div");
      message.textContent = event.data;
      messages.appendChild(message);
    };

    window.sendMessage = () => {
      const input = document.getElementById("messageInput");
      ws.send(input.value);
      input.value = "";
    };
  };

  const logout = () => {
    fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          chatDiv.style.display = "none";
          authDiv.style.display = "block";
          showLogin();
        } else {
          alert("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  window.logout = logout;
});
