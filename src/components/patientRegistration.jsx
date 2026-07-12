"use client";

import { useState } from "react";

export default function NewPatientPage() {
  const [patient, setPatient] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    birthDate: "",
    sex: "",
    civilStatus: "",
    mobileNumber: "",
    email: "",
    address: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        patient.email &&
        !emailRegex.test(patient.email)
    ) {
        alert("Invalid email address");
        return;
    }

    await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patient),
    });
  }

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-2">
        New Patient Registration
      </h1>

      <p className="text-gray-500 mb-8">
        Register a patient into the laboratory system.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Personal Information */}

        <div className="border rounded-lg p-6">

          <h2 className="text-xl font-semibold mb-5">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label>First Name</label>

              <input
                type="text"
                name="firstName"
                value={patient.firstName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Middle Name</label>

              <input
                type="text"
                name="middleName"
                value={patient.middleName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Last Name</label>

              <input
                type="text"
                name="lastName"
                value={patient.lastName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Suffix</label>

              <input
                type="text"
                name="suffix"
                value={patient.suffix}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Date of Birth</label>

              <input
                type="date"
                name="birthDate"
                value={patient.birthDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Sex</label>

              <select
                name="sex"
                value={patient.sex}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label>Civil Status</label>

              <select
                name="civilStatus"
                value={patient.civilStatus}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>

          </div>

        </div>

        {/* Contact Information */}

        <div className="border rounded-lg p-6">

          <h2 className="text-xl font-semibold mb-5">
            Contact Information
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <label>Mobile Number</label>

              <input
                type="text"
                name="mobileNumber"
                value={patient.mobileNumber}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={patient.email}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="col-span-2">
              <label>Complete Address</label>

              <textarea
                name="address"
                value={patient.address}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded p-2"
              />
            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4">

          <button
            type="button"
            className="border rounded px-6 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-6 py-2"
          >
            Register Patient
          </button>

        </div>

      </form>

    </div>
  );
}