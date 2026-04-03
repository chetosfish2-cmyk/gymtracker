// Your routine extracted from your Excel file
const routine = {
    "Day 1 Back-Biceps": [
        "Neutral grip pulldown",
        "Cable pullover",
        "T-bar row",
        "Chest-supported row",
        "EZ bar curl",
        "Incline dumbbell curl",
        "Unilateral cable curl"
    ],
    "Day 2 Glutes-Hamstrings": [
        "Hip thrust",
        "Cable kickback",
        "Leg curl",
        "Dumbbell deadlift",
        "Smith squat (glute stance)",
        "Abductor machine"
    ],
    "Day 3 Shoulders-Chest-Triceps": [
        "Dumbbell shoulder press",
        "Cable lateral raise",
        "Incline dumbbell press",
        "Pec deck",
        "French press",
        "Rope tricep pushdown"
    ],
    "Day 4 Lower Body": [
        "Hack squat",
        "Leg extension",
        "Leg press",
        "Smith Romanian deadlift",
        "Standing calf raise",
        "Press calf raise"
    ],
    "Day 5 Arms-Back": [
        "Close grip supinated pulldown",
        "Olympic bar curl",
        "Preacher curl",
        "Cable overhead tricep extension",
        "Strict lateral raises",
        "Overhead rope tricep extension"
    ]
};

let history = JSON.parse(localStorage.getItem("history")) || [];
let currentDay = null;
let workoutData = {};

function saveHistory() {
    localStorage.setItem("history", JSON.stringify(history));
}

function goBack() {
    loadDaySelector();
}

function loadDaySelector() {
    document.getElementById("headerTitle").textContent = "Select your day";
    document.getElementById("backButton").style.display = "none";

    const content = document.getElementById("content");
    content.innerHTML = "";

    Object.keys(routine).forEach(day => {
        const btn = document.createElement("div");
        btn.className = "day-button";
        btn.textContent = day;
        btn.onclick = () => loadWorkout(day);
        content.appendChild(btn);
    });

    const historyBtn = document.createElement("div");
    historyBtn.className = "day-button";
    historyBtn.textContent = "View History";
    historyBtn.onclick = loadHistory;
    content.appendChild(historyBtn);
}

function loadWorkout(day) {
    currentDay = day;
    workoutData = {};

    document.getElementById("headerTitle").textContent = day;
    document.getElementById("backButton").style.display = "block";

    const content = document.getElementById("content");
    content.innerHTML = "";

    routine[day].forEach(exercise => {
        workoutData[exercise] = [];

        const card = document.createElement("div");
        card.className = "exercise-card";

        card.innerHTML = `
            <h3>${exercise}</h3>
            <input type="number" placeholder="Weight (kg)" id="w-${exercise}">
            <input type="number" placeholder="Reps" id="r-${exercise}">
            <button class="add-set-btn" onclick="addSet('${exercise}')">Add Set</button>
            <div id="sets-${exercise}"></div>
        `;

        content.appendChild(card);
    });

    const finishBtn = document.createElement("button");
    finishBtn.className = "finish-btn";
    finishBtn.textContent = "Finish Workout";
    finishBtn.onclick = finishWorkout;
    content.appendChild(finishBtn);
}

function addSet(exercise) {
    const weight = document.getElementById(`w-${exercise}`).value;
    const reps = document.getElementById(`r-${exercise}`).value;

    if (!weight || !reps) return;

    workoutData[exercise].push({ weight, reps });

    const container = document.getElementById(`sets-${exercise}`);
    const entry = document.createElement("div");
    entry.className = "set-entry";
    entry.textContent = `• ${weight} kg × ${reps}`;
    container.appendChild(entry);

    document.getElementById(`w-${exercise}`).value = "";
    document.getElementById(`r-${exercise}`).value = "";
}

function finishWorkout() {
    const entry = {
        date: new Date().toLocaleString(),
        day: currentDay,
        exercises: workoutData
    };

    history.push(entry);
    saveHistory();
    loadDaySelector();
}

function loadHistory() {
    document.getElementById("headerTitle").textContent = "History";
    document.getElementById("backButton").style.display = "block";

    const content = document.getElementById("content");
    content.innerHTML = "";

    history.forEach(workout => {
        const block = document.createElement("div");
        block.className = "exercise-card";

        let html = `<h3>${workout.date} — ${workout.day}</h3>`;

        Object.keys(workout.exercises).forEach(ex => {
            html += `<strong>${ex}</strong><br>`;
            workout.exercises[ex].forEach(s => {
                html += `<div class="set-entry">• ${s.weight} kg × ${s.reps}</div>`;
            });
            html += `<br>`;
        });

        block.innerHTML = html;
        content.appendChild(block);
    });
}

loadDaySelector();
