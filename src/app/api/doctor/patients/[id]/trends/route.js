import { NextResponse } from "next/server";
import getTestTrend from "@/lib/getTestTrend";

export async function GET(request, { params }) {

    try {

        const { id } = await params;

        const { searchParams } = new URL(request.url);

        const testId = Number(searchParams.get("testId"));
        const field = searchParams.get("field");

        if (!testId || !field) {

            return NextResponse.json(
                {
                    message: "Test and field are required."
                },
                {
                    status: 400
                }
            );

        }

        const data = await getTestTrend(
            id,
            testId,
            field
        );

        return NextResponse.json(data);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message: error.message || "Failed to load test trend."
            },
            {
                status: 500
            }
        );

    }

}