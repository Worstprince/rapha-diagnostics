"use client";

import { useEffect, useState } from "react";

export default function ActivityLogPage() {

    const [logs, setLogs] = useState([]);

    useEffect(() => {

        fetchLogs();

    }, []);

    async function fetchLogs() {

        try {

            const response = await fetch("/api/activityLog");

            const data = await response.json();

           
            const normalized = Array.isArray(data) ? data : (data?.rows ?? []);
            setLogs(normalized);

        } catch (error) {

            console.error(error);

        }

    }

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-slate-400">Monitor and review all user activities within the system.</p>
      </header>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        {logs.map(log => (

                <div
                    key={log.id}
                    className="mb-3 rounded border p-4"
                >
                    <h2>{log.action}</h2>

                    <p>{log.description}</p>

                    <small>{log.datetime}</small>
                </div>
            ))}
      </div>
    </div>
  );
}
