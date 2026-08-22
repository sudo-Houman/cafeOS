"use strict";

/* =========================================================
   DOM
========================================================= */

const form = document.getElementById("authForm");
const card = document.getElementById("loginCard");
const title = document.querySelector(".login-heading");
const subtitle = document.querySelector(".login-subtitle");
const submitButton = document.getElementById("submitButton");
const tabs = document.querySelectorAll(".auth-tab");
const registerFields = document.querySelectorAll(".register-field");
const forgotPassword = document.querySelector(".forgot-password");
const footerText = document.getElementById("footerText");
const footerSwitch = document.getElementById("footerSwitch");
const particlesContainer = document.getElementById("coffeeParticles");

/* =========================================================
   AUTH STATE
========================================================= */

let currentMode = "signin";

/* =========================================================
   SET MODE
========================================================= */

function setMode(mode) {
    currentMode = mode;
    const isSignup = mode === "signup";

    card.classList.toggle("register-mode", isSignup);

    tabs.forEach(tab => {
        tab.classList.toggle("active", tab.dataset.mode === mode);
    });

    if (isSignup) {
        title.textContent = "Create Account";
        subtitle.textContent = "Create your cafe management account";
        submitButton.textContent = "Create Account";
        footerText.textContent = "Already have an account?";
        footerSwitch.textContent = "Sign in";
        forgotPassword.style.display = "none";
    } else {
        title.textContent = "Welcome Back";
        subtitle.textContent = "Sign in to your account";
        submitButton.textContent = "Sign In";
        footerText.textContent = "Don't have an account?";
        footerSwitch.textContent = "Create account";
        forgotPassword.style.display = "inline";
    }

    registerFields.forEach(field => {
        field.classList.toggle("show", isSignup);
        const input = field.querySelector("input");
        if (input) {
            input.required = isSignup;
        }
    });

    const password = document.getElementById("password");
    password.autocomplete = isSignup ? "new-password" : "current-password";
}

/* =========================================================
   TABS
========================================================= */

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        form.reset();
        setMode(tab.dataset.mode);
    });
});

/* =========================================================
   FOOTER SWITCH
========================================================= */

footerSwitch.addEventListener("click", () => {
    form.reset();
    setMode(currentMode === "signin" ? "signup" : "signin");
});

/* =========================================================
   PASSWORD TOGGLE
========================================================= */

document.querySelectorAll(".password-toggle").forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        button.textContent = isPassword ? "◌" : "◉";
        button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
    });
});

/* =========================================================
   SHOW MESSAGE INSIDE FORM (حرفه‌ای)
========================================================= */

function showMessage(message, type = "error") {
    // حذف پیام قبلی
    const oldMessage = document.querySelector(".form-message");
    if (oldMessage) oldMessage.remove();

    // ساخت پیام جدید
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-top: 8px;
        font-size: 13px;
        font-weight: 500;
        text-align: center;
        animation: slideDown 0.3s ease;
        background: ${type === "success" ? "#e8f5e9" : "#ffebee"};
        color: ${type === "success" ? "#2e7d32" : "#c62828"};
        border: 1px solid ${type === "success" ? "#a5d6a7" : "#ef9a9a"};
    `;

    // اضافه کردن به فرم
    const button = submitButton;
    button.parentNode.insertBefore(messageDiv, button.nextSibling);

    // حذف خودکار بعد از ۵ ثانیه
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.opacity = "0";
            messageDiv.style.transition = "opacity 0.5s";
            setTimeout(() => messageDiv.remove(), 500);
        }
    }, 5000);
}

/* =========================================================
   FORM SUBMIT
========================================================= */

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const username = data.get("username")?.trim();
    const password = data.get("password");

    // SIGN IN
    if (currentMode === "signin") {
        if (!username || !password) {
            showMessage("❌ Please fill in all fields", "error");
            return;
        }

        submitButton.textContent = "Signing in...";
        submitButton.disabled = true;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("access_token", result.access_token);
                localStorage.setItem("username", username);
                showMessage("✅ Welcome back! Redirecting...", "success");
                submitButton.textContent = "Sign In";
                submitButton.disabled = false;
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1500);
            } else {
                showMessage("❌ " + (result.detail || "Invalid username or password"), "error");
                submitButton.textContent = "Sign In";
                submitButton.disabled = false;
            }
        } catch (error) {
            showMessage("❌ Server connection error. Please try again.", "error");
            submitButton.textContent = "Sign In";
            submitButton.disabled = false;
            console.error(error);
        }
        return;
    }

    // SIGN UP
    const fullname = data.get("fullName")?.trim();

    if (!fullname || !username || !password) {
        showMessage("❌ Please fill in all fields", "error");
        return;
    }

    if (password.length < 8) {
        showMessage("❌ Password must be at least 8 characters", "error");
        return;
    }

    submitButton.textContent = "Creating account...";
    submitButton.disabled = true;

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                password: password,
                fullname: fullname
            })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage("✅ Account created successfully! Please sign in.", "success");
            submitButton.textContent = "Create Account";
            submitButton.disabled = false;
            form.reset();
            setTimeout(() => {
                setMode("signin");
                document.querySelector('[data-mode="signin"]').click();
            }, 1500);
        } else {
            showMessage("❌ " + (result.detail || "Registration failed"), "error");
            submitButton.textContent = "Create Account";
            submitButton.disabled = false;
        }
    } catch (error) {
        showMessage("❌ Server connection error. Please try again.", "error");
        submitButton.textContent = "Create Account";
        submitButton.disabled = false;
        console.error(error);
    }
});

/* =========================================================
   PARTICLES
========================================================= */

const PARTICLE_COUNT = 65;
const BEAN_COUNT = 9;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createParticles() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement("span");
        particle.className = "coffee-particle";
        const size = random(1, 3.2);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${random(0, 100)}%`;
        particle.style.setProperty("--duration", `${random(8, 18)}s`);
        particle.style.setProperty("--delay", `${random(-18, 0)}s`);
        particle.style.setProperty("--x", `${random(-100, 100)}px`);
        particle.style.setProperty("--x2", `${random(-160, 160)}px`);
        fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
}

function createBeans() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < BEAN_COUNT; i++) {
        const bean = document.createElement("span");
        bean.className = "coffee-bean";
        bean.style.left = `${random(0, 100)}%`;
        bean.style.setProperty("--duration", `${random(11, 20)}s`);
        bean.style.setProperty("--delay", `${random(-20, 0)}s`);
        bean.style.setProperty("--x", `${random(-100, 100)}px`);
        bean.style.setProperty("--x2", `${random(-180, 180)}px`);
        fragment.appendChild(bean);
    }
    particlesContainer.appendChild(fragment);
}

createParticles();
createBeans();
setMode("signin");