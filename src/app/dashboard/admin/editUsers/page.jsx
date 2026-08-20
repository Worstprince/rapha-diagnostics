"use client";


import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { PageHeader, StateMessage, UsersIcon } from "../_ui";


function EditUserEntry() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const legacyId = searchParams.get("id");

    useEffect(() => {

        if (legacyId) {
            router.replace(`/dashboard/admin/editUsers/${legacyId}`);
        }

    }, [legacyId, router]);


    if (legacyId) {

        return (
            <section className="rd-panel p-6">
                <p className="py-10 text-center text-sm text-rd-muted">
                    Opening account…
                </p>
            </section>
        );

    }


    return (

        <section className="rd-panel">

            <StateMessage
                title="No account chosen"
                hint="Open an account from the user list to edit it."
                Icon={UsersIcon}
            />

            <div className="flex justify-center pb-8">
                <Link
                    href="/dashboard/admin/viewUsers"
                    className="rd-btn rd-press rd-focus"
                >
                    Browse all users
                </Link>
            </div>

        </section>

    );

}


export default function EditUserIndexPage() {

    return (

        <div className="mx-auto max-w-6xl space-y-5">

            <PageHeader
                title="Edit User"
                description="Pick an account from the user list to edit it."
            />

            <Suspense
                fallback={
                    <section className="rd-panel p-6">
                        <p className="py-10 text-center text-sm text-rd-muted">
                            Loading…
                        </p>
                    </section>
                }
            >
                <EditUserEntry />
            </Suspense>

        </div>

    );

}
