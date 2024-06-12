import {NextResponse} from "next/server";
import {getNotifications} from "@/lib/api/notifications/queries";

export async function GET() {
  try {
    const notifications = await getNotifications()

    return NextResponse.json(notifications, {status: 200});
  } catch (err) {
    return NextResponse.json({error: err}, {status: 500});
  }
}