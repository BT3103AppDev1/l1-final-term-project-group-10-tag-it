<template>
    <div class="progressBarContainer">
        <div class="chartContainer">
            <canvas id="displayData"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js/auto";
import {
    arrayUnion,
    deleteAllPersistentCacheIndexes,
} from "firebase/firestore";
import firebaseApp, { auth } from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import {
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { forAliasRE } from "@vue/compiler-core";

const db = getFirestore(firebaseApp);

export default {
    data() {
        return {
            user_id: "",
            user_calendars: [],
            calID_name: {},
            calID_total: {},
            calID_completed: {},
            calID_color: {},
        };
    },

    async mounted() {
        auth.onAuthStateChanged((user) => {
            this.user_id = user.uid;

            this.generateChart();
        });
    },
    methods: {
        async getUserInfo() {
            const objToMap = (obj) => new Map(Object.entries(obj));

            let user_data = await getDoc(doc(db, "User", this.user_id));
            let miscCal_id = user_data.data().misc_calendar;
            let personal_calendars = objToMap(
                user_data.data().personal_calendars
            );
            let shared_calendars = objToMap(user_data.data().shared_calendars);

            //initialising the dictionary
            this.user_calendars.push(miscCal_id);
            this.calID_total[miscCal_id] = 0;
            this.calID_completed[miscCal_id] = 0;
            this.calID_name[miscCal_id] = "Miscellaneous";
            this.calID_color[miscCal_id] = "";

            if (personal_calendars.size > 0) {
                personal_calendars.forEach((value, key) => {
                    this.user_calendars.push(key);
                    this.calID_total[key] = 0;
                    this.calID_completed[key] = 0;
                    this.calID_name[key] = "";
                    this.calID_color[key] = "";
                });
            }

            if (shared_calendars.size > 0) {
                shared_calendars.forEach((value, key) => {
                    this.user_calendars.push(key);
                    this.calID_total[key] = 0;
                    this.calID_completed[key] = 0;
                    this.calID_name[key] = "";
                    this.calID_color[key] = "";
                });
            }

            //iterate through the calendars and tags, populating the dictionary
            await Promise.all(
                this.user_calendars.map(async (calId) => {
                    let cur_cal_doc = await getDoc(doc(db, "Calendar", calId));
                    let calData = cur_cal_doc.data();
                    let cal_tags = calData.tags;
                    let cal_name = calData.calendar_name;
                    let cal_color = calData.color;

                    if (cal_name === "") {
                        cal_name = "Miscellaneous";
                    }

                    this.calID_color[calId] = cal_color;
                    this.calID_name[calId] = cal_name;

                    this.calID_total[calId] += cal_tags.length;

                    if (cal_tags.length > 0) {
                        await Promise.all(
                            cal_tags.map(async (tagId) => {
                                let cur_tag_doc = await getDoc(
                                    doc(db, "Tags", tagId)
                                );
                                let tagData = cur_tag_doc.data();
                                let tagCompleted = tagData.completed;

                                if (tagCompleted) {
                                    this.calID_completed[calId] += 1;
                                }
                            })
                        );
                    }
                })
            );
        },

        async generateChart() {
            await this.getUserInfo();

            const progressData = this.user_calendars.map((cal_id) => ({
                cal_name: this.calID_name[cal_id],
                percent: parseFloat(
                    (
                        (this.calID_completed[cal_id] /
                            this.calID_total[cal_id]) *
                        100
                    ).toFixed(1)
                ),
                color: this.calID_color[cal_id],
            }));
            console.log(progressData);

            new Chart(document.getElementById("displayData"), {
                type: "bar",
                data: {
                    labels: progressData.map((row) => row.cal_name),
                    datasets: [
                        {
                            label: "progress",
                            data: progressData.map((row) => row.percent),
                            backgroundColor: progressData.map(
                                (row) => row.color
                            ),
                            borderSkipped: false,
                            borderRadius: 10,
                            barPercentage: 0.2,
                            categoryPercentage: 0.8,
                        },
                    ],
                },

                options: {
                    indexAxis: "y",
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            display: false,
                            grid: {
                                display: false,
                                drawBorder: false,
                                drawOnChartArea: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                        y: {
                            beginAtZero: true,
                            display: false,
                            grid: {
                                display: false,
                                drawBorder: false,
                                borderWidth: 0,
                                drawOnChartArea: false,
                            },
                            ticks: {
                                display: false,
                            },
                        },
                    },
                },
                plugins: [
                    {
                        id: "progressBar",
                        beforeDatasetsDraw(chart, args, pluginOptions) {
                            const {
                                ctx,
                                data,
                                chartArea: {
                                    top,
                                    bottom,
                                    left,
                                    right,
                                    width,
                                    height,
                                },
                                scales: { x, y },
                            } = chart;

                            ctx.save();
                            const barHeight =
                                (height / y.ticks.length) *
                                data.datasets[0].barPercentage *
                                data.datasets[0].categoryPercentage;

                            data.datasets[0].data.forEach(
                                (datapoint, index) => {
                                    //label text
                                    const fontSizeLabel = 20;
                                    ctx.font = `${fontSizeLabel}px`;
                                    ctx.fillStyle = "rgba(0,0,0,1)";
                                    ctx.textAlign = "left";
                                    ctx.textBaseline = "middle";
                                    ctx.fillText(
                                        data.labels[index],
                                        left,
                                        y.getPixelForValue(index) -
                                            fontSizeLabel -
                                            15
                                    );

                                    //value text
                                    const fontSizeDatapoint = 20;
                                    ctx.font = `bolder ${fontSizeDatapoint}px`;
                                    ctx.fillStyle = "rgba(0,0,0,1)";
                                    ctx.textAlign = "right";
                                    (ctx.textBaseline = "middle"),
                                        ctx.fillText(
                                            datapoint,
                                            right,
                                            y.getPixelForValue(index) -
                                                fontSizeDatapoint -
                                                15
                                        );

                                    ctx.beginPath();
                                    ctx.fillStyle = "#e3e3e3";
                                    ctx.fillRect(
                                        left,
                                        y.getPixelForValue(index) -
                                            barHeight / 2,
                                        width,
                                        barHeight
                                    );
                                    ctx.lineJoin = "round";
                                    ctx.lineWidth = 10;
                                    ctx.shadowColor = "none";
                                    ctx.shadowBlur = 0;
                                    ctx.shadowOffsetX = 0;
                                    ctx.shadowOffsetY = 0;
                                    ctx.fill();
                                }
                            );
                        },
                    },
                ],
            });
        },
    },
};
</script>

<style scoped>
.progressBarContainer {
    /* background-color: #f5f5f5; */
    padding: 10px;
    width: 100%;
    height: 500px;
    margin: auto;
    border-radius: 20px;
    filter: drop-shadow(2px 2px #cacaca);
}

.chartContainer {
    width: 100%;
    height: 460px;
    top: 20px;
    left: 20px;
    align-items: center;
    vertical-align: middle;
    justify-content: center;
}

canvas {
    align-items: center;
    vertical-align: middle;
    justify-content: center;
}
</style>
