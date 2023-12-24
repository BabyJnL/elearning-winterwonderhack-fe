import LoginComponent from "./components/login.js";
// Load Components
const root = document.getElementById('root');

// Load Login by default
const firstLoad = async () => {
    root.innerHTML = LoginComponent();

    const stdNumberInput = document.getElementById('stdId');
    const passInput = document.getElementById('password');
    const stdNumberMsg = document.getElementById('stdNumberMsg');
    const passMsg = document.getElementById('passMsg');

    stdNumberInput.addEventListener('focusout', () => {
        (stdNumberInput.value == "") ? stdNumberMsg.textContent = "🛈 Student Number field can't empty" : stdNumberMsg.textContent = "";
    });

    passInput.addEventListener('focusout', () => {
        (passInput.value == "") ? passMsg.textContent = "🛈 Password field can't empty" : passMsg.textContent = "";
    });
};

firstLoad();