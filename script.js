const passwordInput = document.getElementById('passwordInput');
const strengthBar = document.getElementById('strengthBar');
const statusText = document.getElementById('statusText');
const feedbackText = document.getElementById('feedbackText');
const suggestionText = document.getElementById('suggestionText');

// Mock Database of old passwords to satisfy the "prevent reuse" feature
const databaseOfOldPasswords = ["Password123!", "Admin@2026", "LetMeIn!", "qwerty1234"];

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    
    if (password === "") {
        resetUI();
        return;
    }

    // Feature: Database check for reuse
    if (databaseOfOldPasswords.includes(password)) {
        displayError("❌ Cannot reuse an old database password!");
        return;
    }

    let score = 0;
    let tips = [];

    // 1. Length Check
    if (password.length >= 12) {
        score += 2;
    } else if (password.length >= 8) {
        score += 1;
        tips.push("• Tip: Make it 12+ characters for maximum security.");
    } else {
        tips.push("• Critical: Password must be at least 8 characters long.");
    }

    // 2. Complexity Checks
    if (/[A-Z]/.test(password)) score++;
    else tips.push("• Add an uppercase letter (A-Z).");

    if (/[a-z]/.test(password)) score++;
    else tips.push("• Add a lowercase letter (a-z).");

    if (/\d/.test(password)) score++;
    else tips.push("• Add a number (0-9).");

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    else tips.push("• Add a special character (e.g., !, @, #).");

    updateUI(score, tips);
});

function updateUI(score, tips) {
    let width = (score / 6) * 100;
    let color = "#ef4444"; // Red
    let label = "Weak";

    if (score >= 5) {
        color = "#22c55e"; // Green
        label = "Strong";
    } else if (score >= 3) {
        color = "#eab308"; // Yellow
        label = "Moderate";
    }

    strengthBar.style.width = width + "%";
    strengthBar.style.backgroundColor = color;
    statusText.innerText = `Strength: ${label}`;
    statusText.style.color = color;
    feedbackText.innerHTML = tips.join('<br>');

    // Feature: Suggest a stronger alternative if it's not strong yet
    if (label !== "Strong") {
        suggestionText.style.display = "block";
        suggestionText.innerHTML = `<strong>Suggested Alternative:</strong> <span style="font-family:monospace;">${generateStrongPassword()}</span>`;
    } else {
        suggestionText.style.display = "none";
    }
}

function generateStrongPassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 14; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function displayError(message) {
    strengthBar.style.width = "100%";
    strengthBar.style.backgroundColor = "#64748b";
    statusText.innerText = message;
    statusText.style.color = "#64748b";
    feedbackText.innerHTML = "Please pick a unique password.";
    suggestionText.style.display = "block";
    suggestionText.innerHTML = `<strong>Try this instead:</strong> <span style="font-family:monospace;">${generateStrongPassword()}</span>`;
}

function resetUI() {
    strengthBar.style.width = "0%";
    statusText.innerText = "Enter a password to start";
    statusText.style.color = "#1e3a8a";
    feedbackText.innerHTML = "";
    suggestionText.style.display = "none";
}
