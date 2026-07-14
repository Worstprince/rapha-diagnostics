"use client";

import { useState } from "react";

export default function AddUsers() {

    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        role: ""
    });

    function handleChange(e) {

        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (user.email && !emailRegex.test(user.email)) {
        alert("Invalid email address");
        return;
        }


        const response = await fetch("/api/users/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message);
            return;
        }

        alert("User added successfully!");

        setUser({
            username: "",
            password: "",
            email: "",
            role: ""
        });

    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
                Add User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Username
                    </label>

                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Email
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Role
                    </label>

                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Medical Technologist">Medical Technologist</option>
                        <option value="Pathologist">Physician</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Created At
                    </label>

                    <input
                        type="text"
                        value={new Date().toLocaleString()}
                        readOnly
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-slate-400"
                    />
                </div>

                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500"
                    >
                        Add User
                    </button>

                </div>

            </form>

        </div>
    );

}