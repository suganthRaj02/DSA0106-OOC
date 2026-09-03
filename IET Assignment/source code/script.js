let drones = [];
let missions = [];


async function loadDrones() {

    try {

        const droneResponse =
            await fetch("/api/drones");

        if (!droneResponse.ok) {
            throw new Error("Drone loading failed");
        }

        drones =
            await droneResponse.json();


        try {

            const missionResponse =
                await fetch("/api/missions");

            if (missionResponse.ok) {

                missions =
                    await missionResponse.json();

            } else {

                missions = [];

            }

        } catch (error) {

            missions = [];

        }


        displayDrones();

        displayMissions();

        updateDashboard();

        updateDroneSelect();

        updateReports();

    }

    catch (error) {

        console.log(error);

        alert(
            "Cannot connect to server. Please run npm start."
        );

    }
}


function showSection(section) {

    const sections = [
        "dashboard",
        "drones",
        "missions",
        "reports"
    ];


    sections.forEach(id => {

        document
            .getElementById(id)
            .classList.add("hidden");

    });


    document
        .getElementById(section)
        .classList.remove("hidden");


    if (section === "drones") {

        displayDrones();

    }


    if (section === "missions") {

        updateDroneSelect();

        displayMissions();

    }


    if (section === "reports") {

        updateReports();

    }


    updateDashboard();
}


/* DISPLAY DRONES */

function displayDrones() {

    const table =
        document.getElementById("droneTable");

    table.innerHTML = "";


    drones.forEach(drone => {

        const row =
            table.insertRow();


        row.innerHTML = `

            <td>${drone.id}</td>

            <td>${drone.name}</td>

            <td>${drone.type}</td>

            <td>${drone.battery}%</td>

            <td>${drone.payload} kg</td>

            <td>${drone.range} km</td>

            <td>${drone.priority}</td>

            <td>${drone.status}</td>

        `;

    });
}


/* DISPLAY MISSIONS */

function displayMissions() {

    const table =
        document.getElementById("missionTable");

    table.innerHTML = "";


    if (missions.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="7">

                    No missions allocated yet.

                </td>

            </tr>

        `;

        return;
    }


    missions.forEach(mission => {

        const row =
            table.insertRow();


        row.innerHTML = `

            <td>${mission.missionId}</td>

            <td>${mission.missionType}</td>

            <td>${mission.droneId}</td>

            <td>${mission.droneName}</td>

            <td>${mission.priority}</td>

            <td>${mission.status}</td>

            <td>${mission.date}</td>

        `;

    });
}


/* DRONE SELECT */

function updateDroneSelect() {

    const select =
        document.getElementById("droneSelect");


    select.innerHTML =
        `<option value="">Select Drone</option>`;


    drones.forEach(drone => {

        if (drone.status === "Available") {

            select.innerHTML += `

                <option value="${drone.id}">

                    ${drone.id} - ${drone.name}

                </option>

            `;

        }

    });
}


/* ADD DRONE FORM */

function showAddDrone() {

    document
        .getElementById("addDroneForm")
        .classList.toggle("hidden");

}


/* ADD DRONE */

async function addDrone() {

    const id =
        document
            .getElementById("droneId")
            .value
            .trim();


    const name =
        document
            .getElementById("droneName")
            .value
            .trim();


    const type =
        document
            .getElementById("droneType")
            .value;


    const battery =
        Number(
            document
                .getElementById("droneBattery")
                .value
        );


    const payload =
        Number(
            document
                .getElementById("dronePayload")
                .value
        );


    const range =
        Number(
            document
                .getElementById("droneRange")
                .value
        );


    const priority =
        document
            .getElementById("dronePriority")
            .value;


    if (

        !id ||

        !name ||

        document.getElementById("droneBattery").value === "" ||

        document.getElementById("dronePayload").value === "" ||

        document.getElementById("droneRange").value === ""

    ) {

        alert("Please fill all fields.");

        return;
    }


    if (battery < 0 || battery > 100) {

        alert(
            "Battery must be between 0 and 100."
        );

        return;
    }


    if (payload < 0 || range < 0) {

        alert(
            "Payload and range cannot be negative."
        );

        return;
    }


    if (
        drones.some(
            drone => drone.id === id
        )
    ) {

        alert(
            "Drone ID already exists."
        );

        return;
    }


    const newDrone = {

        id: id,

        name: name,

        type: type,

        battery: battery,

        payload: payload,

        range: range,

        priority: priority,

        status: "Available"

    };


    const response =
        await fetch(
            "/api/drones",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(newDrone)

            }
        );


    if (response.ok) {

        drones.push(newDrone);


        displayDrones();

        updateDashboard();

        updateDroneSelect();

        updateReports();


        alert(
            "Drone saved successfully!"
        );


        document
            .getElementById("droneId")
            .value = "";


        document
            .getElementById("droneName")
            .value = "";


        document
            .getElementById("droneBattery")
            .value = "";


        document
            .getElementById("dronePayload")
            .value = "";


        document
            .getElementById("droneRange")
            .value = "";


        document
            .getElementById("addDroneForm")
            .classList
            .add("hidden");

    }

    else {

        alert(
            "Error saving drone."
        );

    }
}


/* ALLOCATE MISSION */

async function allocateMission() {

    const mission =
        document
            .getElementById("missionType")
            .value;


    const droneId =
        document
            .getElementById("droneSelect")
            .value;


    const message =
        document
            .getElementById("missionMessage");


    if (!droneId) {

        message.innerHTML =
            "❌ Please select a drone.";

        return;
    }


    const drone =
        drones.find(
            d => d.id === droneId
        );


    if (!drone) {

        message.innerHTML =
            "❌ Drone not found.";

        return;
    }


    if (drone.status === "Deployed") {

        message.innerHTML =
            "❌ Drone is already deployed.";

        return;
    }


    if (drone.battery < 20) {

        message.innerHTML =
            "❌ Battery too low for deployment.";

        return;
    }


    const missionData = {

        missionId:
            "M" + Date.now(),

        missionType:
            mission,

        droneId:
            drone.id,

        droneName:
            drone.name,

        priority:
            drone.priority,

        status:
            "Active",

        date:
            new Date().toLocaleString()

    };


    try {

        const missionResponse =
            await fetch(
                "/api/missions",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(missionData)

                }
            );


        if (!missionResponse.ok) {

            message.innerHTML =
                "❌ Error saving mission.";

            return;
        }


        drone.status =
            "Deployed";


        const droneResponse =
            await fetch(
                "/api/drones/" + drone.id,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(drone)

                }
            );


        if (!droneResponse.ok) {

            message.innerHTML =
                "❌ Error updating drone.";

            return;
        }


        missions.push(missionData);


        displayDrones();

        displayMissions();

        updateDashboard();

        updateDroneSelect();

        updateReports();


        message.innerHTML =
            "✅ " +
            mission +
            " mission allocated to " +
            drone.name;

    }

    catch (error) {

        console.log(error);

        message.innerHTML =
            "❌ Server connection error.";

    }
}


/* DASHBOARD */

function updateDashboard() {

    const total =
        drones.length;


    const available =
        drones.filter(
            drone =>
                drone.status === "Available"
        ).length;


    const deployed =
        drones.filter(
            drone =>
                drone.status === "Deployed"
        ).length;


    const lowBattery =
        drones.filter(
            drone =>
                drone.battery < 30
        ).length;


    document
        .getElementById("totalDrones")
        .textContent =
        total;


    document
        .getElementById("availableDrones")
        .textContent =
        available;


    document
        .getElementById("deployedDrones")
        .textContent =
        deployed;


    document
        .getElementById("lowBattery")
        .textContent =
        lowBattery;

}


/* REPORTS */

function updateReports() {

    const total =
        drones.length;


    const available =
        drones.filter(
            drone =>
                drone.status === "Available"
        ).length;


    const deployed =
        drones.filter(
            drone =>
                drone.status === "Deployed"
        ).length;


    const rescue =
        missions.filter(
            mission =>
                mission.missionType === "Rescue"
        ).length;


    const medical =
        missions.filter(
            mission =>
                mission.missionType === "Medical"
        ).length;


    const surveillance =
        missions.filter(
            mission =>
                mission.missionType === "Surveillance"
        ).length;


    const totalMissions =
        missions.length;


    const totalCost =
        (rescue * 500) +
        (medical * 400) +
        (surveillance * 300);


    document
        .getElementById("reportTotal")
        .textContent =
        total;


    document
        .getElementById("reportAvailable")
        .textContent =
        available;


    document
        .getElementById("reportDeployed")
        .textContent =
        deployed;


    document
        .getElementById("totalMissions")
        .textContent =
        totalMissions;


    document
        .getElementById("rescueMissions")
        .textContent =
        rescue;


    document
        .getElementById("medicalMissions")
        .textContent =
        medical;


    document
        .getElementById("surveillanceMissions")
        .textContent =
        surveillance;


    document
        .getElementById("totalCost")
        .textContent =
        "₹" + totalCost;

}


window.onload =
    loadDrones;