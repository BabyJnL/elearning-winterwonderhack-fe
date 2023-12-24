const LoginComponent = () => {
    const logincomp = `
    <section id="loginContainer">
    <div class="leftLoginContainer">
        <img src="./src/img/logo.png" />
    </div>

    <div class="rightLoginContainer">
        <span><strong>SmartTechAcademy</strong></span>
        <span>"<i>Smart Learning, Bright Futures</i>"</span>
        <form action="" method="post">
            <div class="input-field">
                <label for="stdId">Student Number</label>
                <input type="text" id="stdId" name="stdId" placeholder="Student Number">
                <p id="stdNumberMsg"></p>
            </div>
            <div class="input-field">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Password">
                <p id="passMsg"></p>
            </div>
            <button type="submit" class="loginBtn">Login</button>
        </form>
    </div>
    </section>
    `
    return logincomp;
}

export default LoginComponent;