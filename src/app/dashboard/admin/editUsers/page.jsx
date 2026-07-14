"use client";

import { useEffect, useState } from "react";

export default function EditUser() {

    const [users, setUsers] = useState([]);

    const [selectedUser, setSelectedUser] = useState("");

    const [user, setUser] = useState({
        username: "",
        password: "",
        email: "",
        role: ""
    });

    useEffect(() => {

        fetchUsers();

    }, []);

    async function fetchUsers() {

        const response = await fetch("/api/users");

        const data = await response.json();

        setUsers(data);

    }

    async function loadUser(id) {

        setSelectedUser(id);

        if (!id) {

            setUser({
                username: "",
                password: "",
                email: "",
                role: ""
            });

            return;

        }

        const response = await fetch(`/api/users/${id}`);

        const data = await response.json();

        setUser({
            username: data.username,
            password: "",
            email: data.email,
            role: data.role
        });

    }

    function handleChange(e) {

        const { name, value } = e.target;

        setUser(prev => ({
            ...prev,
            [name]: value
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        const response = await fetch(`/api/users/${selectedUser}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)

        });

        const result = await response.json();

        alert(result.message);

    }

    return (

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
                Edit User
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>

                    <label className="mb-2 block text-sm text-slate-300">
                        Select User
                    </label>

                    <select
                        value={selectedUser}
                        onChange={(e) => loadUser(e.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                    >

                        <option value="">
                            Select User
                        </option>

                        {users.map(user => (

                            <option
                                key={user.id}
                                value={user.id}
                            >
                                {user.username}
                            </option>

                        ))}

                    </select>

                </div>

                <div>

                    <label>Username</label>

                    <input
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        disabled={!selectedUser}
                    />

                </div>

                <div>

                    <label>Email</label>

                    <input
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        disabled={!selectedUser}
                    />

                </div>

                <div>

                    <label>Role</label>

                    <select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        disabled={!selectedUser}
                    >

                        <option>Administrator</option>
                        <option>Receptionist</option>
                        <option>Medical Technologist</option>
                        <option>Pathologist</option>
                        <option>Cashier</option>

                    </select>

                </div>

                <div>

                    <label>New Password</label>

                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                        disabled={!selectedUser}
                    />

                </div>

                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={!selectedUser}
                        className="rounded-lg bg-cyan-600 px-6 py-3 text-white disabled:bg-slate-700"
                    >
                        Save Changes
                    </button>

                </div>

            </form>

        </div>

    );

}