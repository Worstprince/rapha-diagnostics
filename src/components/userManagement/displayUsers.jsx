"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function displayUsers() {

    const router = useRouter();
    
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const response = await fetch("/api/users/display");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
                User Management
            </h2>

            <table className="w-full border-collapse">

                <thead>

                    <tr className="border-b border-slate-700 text-left text-slate-300">

                        <th className="p-3">ID</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">User creation date</th>
                        <th className="p-3">Status</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map(user => (

                        <tr
                            key={user.id}
                            className="border-b border-slate-800 hover:bg-slate-800"
                        >

                            <td className="p-3">{user.id}</td>
                            <td className="p-3">{user.username}</td>
                            <td className="p-3">{user.role}</td>
                            <td className="p-3">{user.created_at}</td>
                            <td className="p-3">{user.archivestatus ? "Archived" : "Active"}</td>
                            <td className="p-3">

                                <button
                                    type="button"
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    onClick={() => router.push(`/dashboard/admin/editUsers?id=${user.id}`)}
                                >
                                    Edit
                                </button>

                            </td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}