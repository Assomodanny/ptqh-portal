import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { EmptyState, PortalShell } from "@/components/portal-shell";
import { fetchStudents } from "@/lib/portal";
import { usePortalRole } from "@/lib/use-portal-role";

export const Route = createFileRoute("/admin/students")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Students — Admin — Path to Qur'anic Understanding" },
      { name: "description", content: "Enrolled students, class names and status." },
      { property: "og:title", content: "Students — Admin" },
      { property: "og:description", content: "Enrolled students, class names and status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminStudentsPage,
});

function AdminStudentsPage() {
  const { role } = usePortalRole("admin");
  const studentsQuery = useQuery({
    queryKey: ["admin-students"],
    queryFn: fetchStudents,
    enabled: role === "admin",
  });

  const rows = studentsQuery.data ?? [];

  return (
    <PortalShell eyebrow="Administration" title="Students" subtitle="All student records on file.">
      <Link
        to="/admin"
        className="text-sm text-muted-foreground underline underline-offset-4 hover:text-amber"
      >
        ← Back to admin dashboard
      </Link>

      <div className="mt-8">
        {studentsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading students…</p>
        ) : studentsQuery.error ? (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {(studentsQuery.error as Error).message}
          </p>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No students yet"
            body="Student records will appear here once the administration adds them."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card/70">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Student ID</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 last:border-0">
                    <td className="px-4 py-3 text-headline">
                      {student.profiles?.full_name ?? "—"}
                      {student.profiles?.email && (
                        <span className="block text-xs text-muted-foreground">
                          {student.profiles.email}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{student.student_id ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{student.class_name ?? "—"}</td>
                    <td className="px-4 py-3 text-amber">{student.status ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalShell>
  );
}
