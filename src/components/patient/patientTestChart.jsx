"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function PatientTestChart({ data = [], title }) {

    return (

        <div className="rd-panel p-6">

            <h2 className="text-lg font-semibold text-rd-title">
                {title}
            </h2>

            <div className="mt-6 h-80">

                {data.length === 0 ? (

                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-rd-muted">
                            No historical data available.
                        </p>
                    </div>

                ) : (

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={data}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="date"
                            />

                            <YAxis />

                            <Tooltip />

                            <Line
                                type="monotone"
                                dataKey="value"
                                strokeWidth={2}
                                dot
                            />

                        </LineChart>

                    </ResponsiveContainer>

                )}

            </div>

        </div>

    );

}