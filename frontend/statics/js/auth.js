"use strict";


/* =========================================================
   DOM
========================================================= */

const form =
    document.getElementById("authForm");

const card =
    document.getElementById("loginCard");

const title =
    document.querySelector(".login-heading");

const subtitle =
    document.querySelector(".login-subtitle");

const submitButton =
    document.getElementById("submitButton");

const tabs =
    document.querySelectorAll(".auth-tab");

const registerFields =
    document.querySelectorAll(".register-field");

const forgotPassword =
    document.querySelector(".forgot-password");

const footerText =
    document.getElementById("footerText");

const footerSwitch =
    document.getElementById("footerSwitch");

const particlesContainer =
    document.getElementById(
        "coffeeParticles"
    );


/* =========================================================
   AUTH STATE
========================================================= */

let currentMode = "signin";


/* =========================================================
   SET MODE
========================================================= */

function setMode(mode) {

    currentMode = mode;

    const isSignup =
        mode === "signup";


    /* -----------------------------------------
       CARD MODE
    ----------------------------------------- */

    card.classList.toggle(
        "register-mode",
        isSignup
    );


    /* -----------------------------------------
       TABS
    ----------------------------------------- */

    tabs.forEach(tab => {

        tab.classList.toggle(
            "active",
            tab.dataset.mode === mode
        );

    });


    /* -----------------------------------------
       TEXT
    ----------------------------------------- */

    if (isSignup) {

        title.textContent =
            "Create Account";

        subtitle.textContent =
            "Create your cafe management account";

        submitButton.textContent =
            "Create Account";

        footerText.textContent =
            "Already have an account?";

        footerSwitch.textContent =
            "Sign in";

        forgotPassword.style.display =
            "none";

    } else {

        title.textContent =
            "Welcome Back";

        subtitle.textContent =
            "Sign in to your account";

        submitButton.textContent =
            "Sign In";

        footerText.textContent =
            "Don't have an account?";

        footerSwitch.textContent =
            "Create account";

        forgotPassword.style.display =
            "inline";
    }


    /* -----------------------------------------
       REGISTER FIELDS
    ----------------------------------------- */

    registerFields.forEach(field => {

        field.classList.toggle(
            "show",
            isSignup
        );


        const input =
            field.querySelector("input");


        if (input) {

            input.required =
                isSignup;
        }

    });


    /* -----------------------------------------
       PASSWORD AUTOCOMPLETE
    ----------------------------------------- */

    const password =
        document.getElementById(
            "password"
        );

    password.autocomplete =
        isSignup
            ? "new-password"
            : "current-password";
}


/* =========================================================
   TABS
========================================================= */

tabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            form.reset();

            setMode(
                tab.dataset.mode
            );

        }
    );

});


/* =========================================================
   FOOTER SWITCH
========================================================= */

footerSwitch.addEventListener(
    "click",
    () => {

        form.reset();

        setMode(
            currentMode === "signin"
                ? "signup"
                : "signin"
        );

    }
);


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        button.dataset.target
                    );


                const isPassword =
                    input.type === "password";


                input.type =
                    isPassword
                        ? "text"
                        : "password";


                button.textContent =
                    isPassword
                        ? "◌"
                        : "◉";


                button.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    });


/* =========================================================
   FORM SUBMIT
========================================================= */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const data =
            new FormData(form);


        const username =
            data.get("username")?.trim();

        const password =
            data.get("password");


        /* -----------------------------------------
           SIGN IN
        ----------------------------------------- */

        if (
            currentMode === "signin"
        ) {

            if (
                !username ||
                !password
            ) {

                return;
            }


            console.log(
                "SIGN IN",
                {
                    username,
                    password
                }
            );

            return;
        }


        /* -----------------------------------------
           SIGN UP
        ----------------------------------------- */

        const fullName =
            data.get("fullName")?.trim();

        const email =
            data.get("email")?.trim();


        if (
            !fullName ||
            !username ||
            !email ||
            !password
        ) {

            return;
        }


        if (
            password.length < 8
        ) {

            alert(
                "Password must contain at least 8 characters."
            );

            return;
        }


        console.log(
            "SIGN UP",
            {
                fullName,
                username,
                email,
                password
            }
        );

    }
);


/* =========================================================
   PARTICLES
========================================================= */

const PARTICLE_COUNT = 65;
const BEAN_COUNT = 9;


function random(min, max) {

    return (
        Math.random() *
        (max - min) +
        min
    );
}


/* =========================================================
   CREATE PARTICLES
========================================================= */

function createParticles() {

    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "coffee-particle";


        const size =
            random(1, 3.2);


        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;


        particle.style.left =
            `${random(0, 100)}%`;


        particle.style.setProperty(
            "--duration",
            `${random(8, 18)}s`
        );


        particle.style.setProperty(
            "--delay",
            `${random(-18, 0)}s`
        );


        particle.style.setProperty(
            "--x",
            `${random(-100, 100)}px`
        );


        particle.style.setProperty(
            "--x2",
            `${random(-160, 160)}px`
        );


        fragment.appendChild(
            particle
        );

    }


    particlesContainer.appendChild(
        fragment
    );
}


/* =========================================================
   CREATE BEANS
========================================================= */

function createBeans() {

    const fragment =
        document.createDocumentFragment();


    for (
        let i = 0;
        i < BEAN_COUNT;
        i++
    ) {

        const bean =
            document.createElement(
                "span"
            );


        bean.className =
            "coffee-bean";


        bean.style.left =
            `${random(0, 100)}%`;


        bean.style.setProperty(
            "--duration",
            `${random(11, 20)}s`
        );


        bean.style.setProperty(
            "--delay",
            `${random(-20, 0)}s`
        );


        bean.style.setProperty(
            "--x",
            `${random(-100, 100)}px`
        );


        bean.style.setProperty(
            "--x2",
            `${random(-180, 180)}px`
        );


        fragment.appendChild(
            bean
        );

    }


    particlesContainer.appendChild(
        fragment
    );
}


/* =========================================================
   INIT
========================================================= */

createParticles();

createBeans();

setMode("signin");
