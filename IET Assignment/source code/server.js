const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;

const droneFile =
    path.join(__dirname, "drones.json");

const missionFile =
    path.join(__dirname, "missions.json");


app.use(express.json());

app.use(express.static(__dirname));


/* CREATE FILES IF NOT PRESENT */

if (!fs.existsSync(droneFile)) {

    fs.writeFileSync(
        droneFile,
        "[]"
    );

}


if (!fs.existsSync(missionFile)) {

    fs.writeFileSync(
        missionFile,
        "[]"
    );

}


/* GET DRONES */

app.get(
    "/api/drones",
    (req, res) => {

        try {

            const data =
                fs.readFileSync(
                    droneFile,
                    "utf8"
                );


            res.json(
                JSON.parse(data)
            );

        }

        catch (error) {

            res.status(500).json({

                message:
                    "Error reading drones"

            });

        }

    }
);


/* ADD DRONE */

app.post(
    "/api/drones",
    (req, res) => {

        try {

            const data =
                JSON.parse(
                    fs.readFileSync(
                        droneFile,
                        "utf8"
                    )
                );


            data.push(req.body);


            fs.writeFileSync(

                droneFile,

                JSON.stringify(
                    data,
                    null,
                    4
                )

            );


            res.json({

                message:
                    "Drone saved successfully"

            });

        }

        catch (error) {

            res.status(500).json({

                message:
                    "Error saving drone"

            });

        }

    }
);


/* UPDATE DRONE */

app.put(
    "/api/drones/:id",
    (req, res) => {

        try {

            const data =
                JSON.parse(
                    fs.readFileSync(
                        droneFile,
                        "utf8"
                    )
                );


            const index =
                data.findIndex(
                    drone =>
                        drone.id === req.params.id
                );


            if (index === -1) {

                return res.status(404).json({

                    message:
                        "Drone not found"

                });

            }


            data[index] =
                req.body;


            fs.writeFileSync(

                droneFile,

                JSON.stringify(
                    data,
                    null,
                    4
                )

            );


            res.json({

                message:
                    "Drone updated successfully"

            });

        }

        catch (error) {

            res.status(500).json({

                message:
                    "Error updating drone"

            });

        }

    }
);


/* DELETE DRONE */

app.delete(
    "/api/drones/:id",
    (req, res) => {

        try {

            let data =
                JSON.parse(
                    fs.readFileSync(
                        droneFile,
                        "utf8"
                    )
                );


            data =
                data.filter(
                    drone =>
                        drone.id !== req.params.id
                );


            fs.writeFileSync(

                droneFile,

                JSON.stringify(
                    data,
                    null,
                    4
                )

            );


            res.json({

                message:
                    "Drone deleted successfully"

            });

        }

        catch (error) {

            res.status(500).json({

                message:
                    "Error deleting drone"

            });

        }

    }
);


/* GET MISSIONS */

app.get(
    "/api/missions",
    (req, res) => {

        try {

            const data =
                fs.readFileSync(
                    missionFile,
                    "utf8"
                );


            res.json(
                JSON.parse(data)
            );

        }

        catch (error) {

            res.status(500).json({

                message:
                    "Error reading missions"

            });

        }

    }
);


/* ADD MISSION */

app.post(
    "/api/missions",
    (req, res) => {

        try {

            const data =
                JSON.parse(
                    fs.readFileSync(
                        missionFile,
                        "utf8"
                    )
                );


            data.push(req.body);


            fs.writeFileSync(

                missionFile,

                JSON.stringify(
                    data,
                    null,
                    4
                )

            );


            res.json({

                message:
                    "Mission saved successfully"

            });

        }

        catch (error) {

            console.log(error);


            res.status(500).json({

                message:
                    "Error saving mission"

            });

        }

    }
);


/* START SERVER */

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);