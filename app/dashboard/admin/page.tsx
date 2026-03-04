import { Suspense } from "react";
import { AdminDashboard } from "../../../views/AdminDashboard";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-32 flex justify-center text-gray-400">Loading Dashboard...</div>}>
            <AdminDashboard />
        </Suspense>
    );
}
