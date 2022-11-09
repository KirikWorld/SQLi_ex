const login = document.getElementById("form-login");
const pswd = document.getElementById("form-password");
const sumbit = document.getElementById("signin-sumbit");

async function signin(login, pswd) {
    return await fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            login: login.value,
            password: pswd.value,
        }),
    }).then((data) => data.text());
}

sumbit.onclick = () =>
    signin(login, pswd)
        .then((data) => localStorage.setItem("token", data))
        .then(setTimeout(() => window.location.replace("/me/"), 1000));
