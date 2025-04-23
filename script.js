function generateCompressedSchedule() {
    const tasksInput = document.getElementById("tasksInput").value;
    const totalTime = parseFloat(document.getElementById("totalTimeInput").value);
    const scheduleOutput = document.getElementById("scheduleOutput");

    if (!tasksInput || isNaN(totalTime) || totalTime <= 0) {
        scheduleOutput.textContent = "Please provide valid tasks and total time.";
        return;
    }

    const tasks = tasksInput.split(",").map(task => task.trim().toLowerCase());
    let remainingTime = totalTime;
    let schedule = [];
    let fixedTasks = [];

    // Calculate time allocation for meals and meetings
    tasks.forEach(task => {
        if (["breakfast", "lunch", "dinner"].includes(task)) {
            const mealTime = totalTime / 6; // Start with 1/4th of total time
            fixedTasks.push({ task, time: mealTime });
            remainingTime -= mealTime;
        } else if (task === "meeting") {
            const meetingTime = totalTime / 3; // Start with 1/2 of total time
            fixedTasks.push({ task, time: meetingTime });
            remainingTime -= meetingTime;
        }
    });

    // Check if we need to compress times due to lack of remaining time
    if (remainingTime < 0) {
        const compressionFactor = totalTime / fixedTasks.reduce((sum, t) => sum + t.time, 0);
        fixedTasks = fixedTasks.map(fixedTask => ({
            task: fixedTask.task,
            time: fixedTask.time * compressionFactor
        }));
        remainingTime = 0; // No time left after compression
    }

    // Add fixed task schedules
    fixedTasks.forEach(fixed => {
        schedule.push(`${fixed.task.charAt(0).toUpperCase() + fixed.task.slice(1)}: ${fixed.time.toFixed(2)} hours`);
    });

    // Assign remaining time to other tasks proportionally
    const otherTasks = tasks.filter(task => !["breakfast", "lunch", "dinner", "meeting"].includes(task));
    if (otherTasks.length > 0 && remainingTime > 0) {
        const timePerTask = remainingTime / otherTasks.length;
        otherTasks.forEach(task => {
            schedule.push(`${task.charAt(0).toUpperCase() + task.slice(1)}: ${timePerTask.toFixed(2)} hours`);
        });
    }

    if (schedule.length === 0) {
        scheduleOutput.textContent = "No tasks can be scheduled with the given time.";
    } else {
        scheduleOutput.innerHTML = `
            <strong>Planned Schedule:</strong><br>
            ${schedule.join("<br>")}
        `;
    }
}
