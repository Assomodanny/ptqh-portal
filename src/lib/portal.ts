/**
 * Portal queries & admin/teacher/student helpers against the school's Supabase schema.
 */
import {
  ACTIVE_SUBJECT_OPTIONS,
  matchActiveSubjectOption,
  type ActiveSubjectOption,
} from "@/data/curriculum";
import { supabase } from "./supabase";

export type RoleName = "admin" | "teacher" | "student";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean | null;
};

export type TeacherRow = {
  id: string;
  profile_id: string;
  employee_id: string | null;
  qualification: string | null;
  specialization: string | null;
  status: string | null;
};

export type StudentRow = {
  id: string;
  profile_id: string;
  student_id: string | null;
  class_name: string | null;
  admission_date: string | null;
  date_of_birth: string | null;
  gender: string | null;
  status: string | null;
};

export type SubjectRow = {
  id: string;
  name: string | null;
  code: string | null;
  description: string | null;
  is_active: boolean | null;
};

export const ALLOWED_ENROLLMENT_STATUSES = ["active", "inactive", "completed"] as const;
export type EnrollmentStatus = (typeof ALLOWED_ENROLLMENT_STATUSES)[number];

export type EnrollmentWithSubject = {
  id: string;
  enrolled_at: string | null;
  status: EnrollmentStatus | null;
  subjects: SubjectRow | null;
};

export type LiveClass = {
  id: string;
  subject: string | null;
  day_of_week: string | number | null;
  start_time: string | null;
  end_time: string | null;
  platform: string | null;
  join_url: string | null;
  is_active: boolean | null;
};

/** Resolve the signed-in user's role via user_roles → roles.name. */
export async function fetchUserRole(userId: string): Promise<RoleName | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  const names = (data ?? [])
    .flatMap((row: { roles: { name: string | null } | { name: string | null }[] | null }) =>
      Array.isArray(row.roles) ? row.roles : row.roles ? [row.roles] : [],
    )
    .map((r) => (r.name ?? "").toLowerCase());

  for (const candidate of ["admin", "teacher", "student"] as const) {
    if (names.includes(candidate)) return candidate;
  }
  return null;
}

export const roleHome: Record<RoleName, "/admin" | "/teacher" | "/student"> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

/** profiles.id is the shared identity id (matches auth.users.id). */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, avatar_url, is_active")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Profile | null) ?? null;
}

export async function fetchAdminCounts(): Promise<{
  students: number;
  teachers: number;
  subjects: number;
}> {
  const [students, teachers, subjects] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("teachers").select("id", { count: "exact", head: true }),
    supabase.from("subjects").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);
  const firstError = students.error ?? teachers.error ?? subjects.error;
  if (firstError) throw new Error(firstError.message);
  return {
    students: students.count ?? 0,
    teachers: teachers.count ?? 0,
    subjects: subjects.count ?? 0,
  };
}

export async function fetchTeacherByProfile(profileId: string): Promise<TeacherRow | null> {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, profile_id, employee_id, qualification, specialization, status")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as TeacherRow | null) ?? null;
}

export async function fetchStudentByProfile(profileId: string): Promise<StudentRow | null> {
  const { data, error } = await supabase
    .from("students")
    .select("id, profile_id, student_id, class_name, admission_date, date_of_birth, gender, status")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as StudentRow | null) ?? null;
}

export type AdminEnrollmentRow = {
  id: string;
  student_id: string;
  subject_id: string;
  enrolled_at: string | null;
  status: EnrollmentStatus | null;
  subjects: SubjectRow | null;
};

export async function fetchEnrollments(studentRowId: string): Promise<EnrollmentWithSubject[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, enrolled_at, status, subjects(id, name, code, description, is_active)")
    .eq("student_id", studentRowId)
    .in("status", ["active", "completed"]);
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as EnrollmentWithSubject[]).map((row) => ({
    ...row,
    subjects: Array.isArray(row.subjects) ? (row.subjects[0] ?? null) : row.subjects,
  }));
}

export type TeacherSubjectRow = {
  teacher_id: string;
  subject_id: string;
  created_at: string | null;
  subjects: SubjectRow | null;
};

export async function fetchTeacherSubjects(teacherRowId: string): Promise<TeacherSubjectRow[]> {
  const { data, error } = await supabase
    .from("teacher_subjects")
    .select("teacher_id, subject_id, created_at, subjects(id, name, code, description, is_active)")
    .eq("teacher_id", teacherRowId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as TeacherSubjectRow[]).map((row) => ({
    ...row,
    subjects: Array.isArray(row.subjects) ? (row.subjects[0] ?? null) : row.subjects,
  }));
}

export async function fetchAllTeacherSubjects(): Promise<TeacherSubjectRow[]> {
  const { data, error } = await supabase
    .from("teacher_subjects")
    .select("teacher_id, subject_id, created_at, subjects(id, name, code, description, is_active)")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as TeacherSubjectRow[]).map((row) => ({
    ...row,
    subjects: Array.isArray(row.subjects) ? (row.subjects[0] ?? null) : row.subjects,
  }));
}

export type TeacherCandidate = {
  selectionKey: string;
  teacherRowId: string | null;
  profileId: string;
  employeeId: string | null;
  qualification: string | null;
  specialization: string | null;
  status: string | null;
  fullName: string;
  email: string | null;
};

export async function fetchTeacherCandidates(): Promise<TeacherCandidate[]> {
  const teacherRows = await fetchTeachers();
  const candidates: TeacherCandidate[] = teacherRows.map((row) => ({
    selectionKey: `teacher:${row.id}`,
    teacherRowId: row.id,
    profileId: row.profile_id,
    employeeId: row.employee_id,
    qualification: row.qualification,
    specialization: row.specialization,
    status: row.status,
    fullName: row.profiles?.full_name ?? row.profiles?.email ?? row.employee_id ?? "Teacher",
    email: row.profiles?.email ?? null,
  }));

  const seenProfiles = new Set(teacherRows.map((r) => r.profile_id));

  try {
    const { data: roleRows, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id, roles(name)")
      .order("user_id", { ascending: true });

    if (!roleError && roleRows) {
      const teacherUserIds = (
        roleRows as {
          user_id: string;
          roles: { name: string | null } | { name: string | null }[] | null;
        }[]
      )
        .filter((row) => {
          const r = Array.isArray(row.roles) ? row.roles : row.roles ? [row.roles] : [];
          return r.some((item) => (item.name ?? "").toLowerCase() === "teacher");
        })
        .map((row) => row.user_id)
        .filter((id) => !seenProfiles.has(id));

      if (teacherUserIds.length > 0) {
        const { data: profileRows, error: profError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, avatar_url, is_active")
          .in("id", teacherUserIds);

        if (!profError && profileRows) {
          for (const profile of profileRows as Profile[]) {
            candidates.push({
              selectionKey: `profile:${profile.id}`,
              teacherRowId: null,
              profileId: profile.id,
              employeeId: null,
              qualification: null,
              specialization: null,
              status: "active",
              fullName: profile.full_name ?? profile.email ?? "Teacher",
              email: profile.email,
            });
          }
        }
      }
    }
  } catch {
    // Non-fatal fallback when RLS restricts cross-user reads on user_roles.
  }

  return candidates.sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export async function assignSubjectsToTeacher(input: {
  teacherRowId: string | null;
  profileId: string;
  subjectIds: string[];
}): Promise<{ teacherRowId: string; addedCount: number }> {
  let resolvedTeacherId = input.teacherRowId;

  if (!resolvedTeacherId) {
    const { data: existingTeacher } = await supabase
      .from("teachers")
      .select("id")
      .eq("profile_id", input.profileId)
      .maybeSingle();

    if (existingTeacher && (existingTeacher as { id?: string }).id) {
      resolvedTeacherId = (existingTeacher as { id: string }).id;
    } else {
      const generatedCode = `TCH-${Date.now().toString().slice(-5)}`;
      const { data: insertedTeacher, error: teacherError } = await supabase
        .from("teachers")
        .insert({
          profile_id: input.profileId,
          employee_id: generatedCode,
          status: "active",
        })
        .select("id")
        .single();

      if (teacherError || !insertedTeacher) {
        throw new Error(teacherError?.message ?? "Could not create teacher record.");
      }
      resolvedTeacherId = (insertedTeacher as { id: string }).id;
    }
  }

  const uniqueSubjectIds = [...new Set(input.subjectIds.filter(Boolean))];
  if (uniqueSubjectIds.length === 0) {
    return { teacherRowId: resolvedTeacherId, addedCount: 0 };
  }

  const { data: currentRows, error: currentError } = await supabase
    .from("teacher_subjects")
    .select("subject_id")
    .eq("teacher_id", resolvedTeacherId);
  if (currentError) throw new Error(currentError.message);

  const alreadyAssigned = new Set(
    ((currentRows ?? []) as { subject_id: string }[]).map((r) => r.subject_id),
  );
  const toInsert = uniqueSubjectIds
    .filter((subjectId) => !alreadyAssigned.has(subjectId))
    .map((subjectId) => ({
      teacher_id: resolvedTeacherId,
      subject_id: subjectId,
    }));

  if (toInsert.length > 0) {
    const { error: assignError } = await supabase.from("teacher_subjects").insert(toInsert);
    if (assignError) throw new Error(assignError.message);
  }

  return { teacherRowId: resolvedTeacherId, addedCount: toInsert.length };
}

export async function removeTeacherSubject(teacherRowId: string, subjectId: string): Promise<void> {
  const { error } = await supabase
    .from("teacher_subjects")
    .delete()
    .eq("teacher_id", teacherRowId)
    .eq("subject_id", subjectId);
  if (error) throw new Error(error.message);
}

export async function fetchAllEnrollments(): Promise<AdminEnrollmentRow[]> {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      "id, student_id, subject_id, enrolled_at, status, subjects(id, name, code, description, is_active)",
    )
    .order("enrolled_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as AdminEnrollmentRow[]).map((row) => ({
    ...row,
    subjects: Array.isArray(row.subjects) ? (row.subjects[0] ?? null) : row.subjects,
  }));
}

export async function fetchSubjects(): Promise<SubjectRow[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, code, description, is_active")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as SubjectRow[];
}

export type ResolvedActiveSubject = {
  option: ActiveSubjectOption;
  subjectRow: SubjectRow | null;
};

/**
 * Maps each of the 4 active subjects to its row in `subjects`.
 * Matching is flexible against short names ("Nahwu", "Hadith"), codes, or full labels.
 */
export async function fetchResolvedActiveSubjects(): Promise<ResolvedActiveSubject[]> {
  const existing = await fetchSubjects();

  const findMatch = (option: ActiveSubjectOption, rows: SubjectRow[]) =>
    rows.find((row) => {
      const matched = matchActiveSubjectOption(row.name) ?? matchActiveSubjectOption(row.code);
      return matched?.key === option.key;
    }) ?? null;

  const missing = ACTIVE_SUBJECT_OPTIONS.filter((opt) => !findMatch(opt, existing));

  let allRows = existing;
  if (missing.length > 0) {
    // Attempt to ensure missing active subject rows exist in `subjects`.
    const toInsert = missing.map((opt) => ({
      name: opt.fullLabel,
      code: opt.code,
      description: opt.description,
      is_active: true,
    }));
    const { error: insertError } = await supabase.from("subjects").insert(toInsert);
    if (!insertError) {
      allRows = await fetchSubjects();
    }
  }

  return ACTIVE_SUBJECT_OPTIONS.map((option) => ({
    option,
    subjectRow: findMatch(option, allRows),
  }));
}

export type StudentCandidate = {
  /** Key used to identify this student in the enrollment UI (`student:<id>` or `profile:<id>`). */
  selectionKey: string;
  studentRowId: string | null;
  profileId: string;
  studentCode: string | null;
  className: string | null;
  status: string | null;
  fullName: string;
  email: string | null;
};

/**
 * Returns all `students` rows plus any signed-up `student`-role profiles that do not yet
 * have a `students` record, so admins can enroll newly registered students right away.
 */
export async function fetchStudentCandidates(): Promise<StudentCandidate[]> {
  const studentRows = await fetchStudents();
  const candidates: StudentCandidate[] = studentRows.map((row) => ({
    selectionKey: `student:${row.id}`,
    studentRowId: row.id,
    profileId: row.profile_id,
    studentCode: row.student_id,
    className: row.class_name,
    status: row.status,
    fullName: row.profiles?.full_name ?? row.profiles?.email ?? row.student_id ?? "Student",
    email: row.profiles?.email ?? null,
  }));

  const seenProfiles = new Set(studentRows.map((r) => r.profile_id));

  try {
    const { data: roleRows, error: roleError } = await supabase
      .from("user_roles")
      .select("user_id, roles(name)")
      .order("user_id", { ascending: true });

    if (!roleError && roleRows) {
      const studentUserIds = (
        roleRows as {
          user_id: string;
          roles: { name: string | null } | { name: string | null }[] | null;
        }[]
      )
        .filter((row) => {
          const r = Array.isArray(row.roles) ? row.roles : row.roles ? [row.roles] : [];
          return r.some((item) => (item.name ?? "").toLowerCase() === "student");
        })
        .map((row) => row.user_id)
        .filter((id) => !seenProfiles.has(id));

      if (studentUserIds.length > 0) {
        const { data: profileRows, error: profError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, avatar_url, is_active")
          .in("id", studentUserIds);

        if (!profError && profileRows) {
          for (const profile of profileRows as Profile[]) {
            candidates.push({
              selectionKey: `profile:${profile.id}`,
              studentRowId: null,
              profileId: profile.id,
              studentCode: null,
              className: null,
              status: "pending",
              fullName: profile.full_name ?? profile.email ?? "New Student",
              email: profile.email,
            });
          }
        }
      }
    }
  } catch {
    // Non-fatal fallback when RLS restricts cross-user reads on user_roles.
  }

  return candidates.sort((a, b) => a.fullName.localeCompare(b.fullName));
}

/**
 * Ensures a `students` row exists for the candidate, then inserts any newly ticked
 * subjects into `enrollments` without duplicating existing enrollments.
 */
export async function enrollStudentInSubjects(input: {
  studentRowId: string | null;
  profileId: string;
  subjectIds: string[];
}): Promise<{ studentRowId: string; addedCount: number }> {
  let resolvedStudentId = input.studentRowId;

  if (!resolvedStudentId) {
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("profile_id", input.profileId)
      .maybeSingle();

    if (existingStudent && (existingStudent as { id?: string }).id) {
      resolvedStudentId = (existingStudent as { id: string }).id;
    } else {
      const generatedCode = `STU-${Date.now().toString().slice(-5)}`;
      const { data: insertedStudent, error: studentError } = await supabase
        .from("students")
        .insert({
          profile_id: input.profileId,
          student_id: generatedCode,
          admission_date: new Date().toISOString().slice(0, 10),
          status: "active",
        })
        .select("id")
        .single();

      if (studentError || !insertedStudent) {
        throw new Error(studentError?.message ?? "Could not create student record.");
      }
      resolvedStudentId = (insertedStudent as { id: string }).id;
    }
  }

  const uniqueSubjectIds = [...new Set(input.subjectIds.filter(Boolean))];
  if (uniqueSubjectIds.length === 0) {
    return { studentRowId: resolvedStudentId, addedCount: 0 };
  }

  const { data: currentRows, error: currentError } = await supabase
    .from("enrollments")
    .select("id, subject_id, status")
    .eq("student_id", resolvedStudentId);
  if (currentError) throw new Error(currentError.message);

  const existingBySubject = new Map(
    ((currentRows ?? []) as { id: string; subject_id: string; status: string | null }[]).map(
      (r) => [r.subject_id, r],
    ),
  );

  const toReactivateIds: string[] = [];
  const toInsert: {
    student_id: string;
    subject_id: string;
    status: EnrollmentStatus;
    enrolled_at: string;
  }[] = [];

  for (const subjectId of uniqueSubjectIds) {
    const existing = existingBySubject.get(subjectId);
    if (!existing) {
      toInsert.push({
        student_id: resolvedStudentId,
        subject_id: subjectId,
        status: "active",
        enrolled_at: new Date().toISOString(),
      });
    } else if (existing.status === "inactive") {
      toReactivateIds.push(existing.id);
    }
  }

  if (toReactivateIds.length > 0) {
    const { error: reactivateError } = await supabase
      .from("enrollments")
      .update({ status: "active", enrolled_at: new Date().toISOString() })
      .in("id", toReactivateIds);
    if (reactivateError) throw new Error(reactivateError.message);
  }

  if (toInsert.length > 0) {
    const { error: enrollError } = await supabase.from("enrollments").insert(toInsert);
    if (enrollError) throw new Error(enrollError.message);
  }

  return { studentRowId: resolvedStudentId, addedCount: toInsert.length + toReactivateIds.length };
}

export async function removeEnrollment(enrollmentId: string): Promise<void> {
  const { error } = await supabase.from("enrollments").delete().eq("id", enrollmentId);
  if (error) throw new Error(error.message);
}

export async function fetchLiveClasses(): Promise<LiveClass[]> {
  const { data, error } = await supabase
    .from("live_classes")
    .select("id, subject, day_of_week, start_time, end_time, platform, join_url, is_active")
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  return (data ?? []) as LiveClass[];
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Every Wednesday" / "Schedule pending" for null values. */
export function formatDay(day: LiveClass["day_of_week"]): string {
  if (day === null || day === undefined || day === "") return "Schedule pending";
  if (typeof day === "number") return dayNames[day] ? `Every ${dayNames[day]}` : "Schedule pending";
  const numeric = Number(day);
  if (!Number.isNaN(numeric) && dayNames[numeric]) return `Every ${dayNames[numeric]}`;
  const label = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
  return `Every ${label}`;
}

function formatTime(value: string): string {
  const [h, m] = value.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m ?? "00"} ${suffix}`;
}

export function formatTimeRange(start: string | null, end: string | null): string {
  if (!start) return "Schedule pending";
  return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}

export type StudentWithProfile = StudentRow & { profiles: Profile | null };
export type TeacherWithProfile = TeacherRow & { profiles: Profile | null };

function firstOrNull<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function fetchStudents(): Promise<StudentWithProfile[]> {
  const { data, error } = await supabase
    .from("students")
    .select(
      "id, profile_id, student_id, class_name, admission_date, date_of_birth, gender, status, profiles(id, full_name, email, phone, avatar_url, is_active)",
    );
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as StudentWithProfile[]).map((row) => ({
    ...row,
    profiles: firstOrNull(row.profiles),
  }));
}

export async function fetchTeachers(): Promise<TeacherWithProfile[]> {
  const { data, error } = await supabase
    .from("teachers")
    .select(
      "id, profile_id, employee_id, qualification, specialization, status, profiles(id, full_name, email, phone, avatar_url, is_active)",
    );
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as TeacherWithProfile[]).map((row) => ({
    ...row,
    profiles: firstOrNull(row.profiles),
  }));
}

export type LiveClassInput = {
  subject: string | null;
  day_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  platform: string | null;
  join_url: string | null;
};

/** Admin-only write (enforced by the existing RLS policy on live_classes). */
export async function createLiveClass(input: LiveClassInput): Promise<void> {
  const { error } = await supabase.from("live_classes").insert({ ...input, is_active: true });
  if (error) throw new Error(error.message);
}

export async function updateLiveClass(id: string, input: Partial<LiveClassInput>): Promise<void> {
  const { error } = await supabase.from("live_classes").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteLiveClass(id: string): Promise<void> {
  const { error } = await supabase.from("live_classes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** "google_meet" → "Google Meet". */
export function formatPlatform(platform: string | null): string {
  if (!platform) return "Platform to be confirmed";
  return platform
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) =>
      word.toLowerCase() === "whatsapp" ? "WhatsApp" : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/* ---------------------------------------------------------------------------
 * Payments (existing `payments` table — no schema changes)
 * Columns: id, student_id, subject_id, month (date, 1st of month), amount_due,
 * amount_paid, payment_date, is_paid, grace_period_active, receipt_reference.
 * Some rows have student_id = null; those are matched by the tagged reference
 * in receipt_reference, format "[STUDENT_ID] ...".
 * ------------------------------------------------------------------------- */

export type PaymentRow = {
  id: string;
  student_id: string | null;
  subject_id: string | null;
  month: string | null;
  amount_due: number | null;
  amount_paid: number | null;
  payment_date: string | null;
  is_paid: boolean | null;
  grace_period_active: boolean | null;
  receipt_reference: string | null;
  created_at: string | null;
};

const paymentColumns =
  "id, student_id, subject_id, month, amount_due, amount_paid, payment_date, is_paid, grace_period_active, receipt_reference, created_at";

/** First day of the given month as an ISO date string (YYYY-MM-01). */
export function monthStart(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}-01`;
}

/** The tag a workaround row carries, e.g. "STU001" → "[STU001]". */
export function referenceTag(studentCode: string): string {
  return `[${studentCode}]`;
}

/**
 * Current-month payments for one student: rows linked by student_id, plus
 * untagged-workaround rows whose receipt_reference starts with [STUDENT_ID].
 */
export async function fetchStudentPayments(
  studentRowId: string,
  studentCode: string | null,
  month = monthStart(),
): Promise<PaymentRow[]> {
  const byId = supabase
    .from("payments")
    .select(paymentColumns)
    .eq("month", month)
    .eq("student_id", studentRowId);

  const byReference = studentCode
    ? supabase
        .from("payments")
        .select(paymentColumns)
        .eq("month", month)
        .is("student_id", null)
        .ilike("receipt_reference", `${referenceTag(studentCode)}%`)
    : null;

  const [linked, tagged] = await Promise.all([byId, byReference ?? Promise.resolve(null)]);
  if (linked.error) throw new Error(linked.error.message);
  if (tagged?.error) throw new Error(tagged.error.message);

  const rows = [
    ...((linked.data ?? []) as PaymentRow[]),
    ...((tagged?.data ?? []) as PaymentRow[]),
  ];
  const seen = new Set<string>();
  return rows.filter((row) => (seen.has(row.id) ? false : (seen.add(row.id), true)));
}

export type PaymentStatus = {
  /** Unpaid rows for the current month. */
  unpaid: PaymentRow[];
  /** Sum of amount_due − amount_paid across unpaid rows. */
  amountOwed: number;
  /** True while today is on or before the 3rd (1st + 2 grace days). */
  withinGrace: boolean;
  /** True when the dashboard should be blocked. */
  blocked: boolean;
};

/**
 * Gating rule: block only when an unpaid row exists for the current month AND
 * the 2-day grace period after the 1st has passed AND no row still carries
 * grace_period_active. Students with no payment record are never blocked.
 */
export function evaluatePaymentStatus(rows: PaymentRow[], today = new Date()): PaymentStatus {
  const unpaid = rows.filter((row) => row.is_paid !== true);
  const amountOwed = unpaid.reduce(
    (total, row) => total + Math.max((row.amount_due ?? 0) - (row.amount_paid ?? 0), 0),
    0,
  );
  const withinGrace =
    today.getDate() <= 3 || unpaid.some((row) => row.grace_period_active === true);
  return { unpaid, amountOwed, withinGrace, blocked: unpaid.length > 0 && !withinGrace };
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function formatMonth(month: string | null): string {
  if (!month) return "This month";
  const date = new Date(`${month}T00:00:00`);
  if (Number.isNaN(date.getTime())) return month;
  return date.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

export type PaymentWithStudent = PaymentRow & {
  students: (StudentRow & { profiles: Profile | null }) | null;
};

/** All payments for a month, newest first — admin view. */
export async function fetchPayments(month = monthStart()): Promise<PaymentRow[]> {
  const { data, error } = await supabase
    .from("payments")
    .select(paymentColumns)
    .eq("month", month)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as PaymentRow[];
}

/** Admin-only write (enforced by the existing RLS policy on payments). */
export async function setPaymentPaid(row: PaymentRow, isPaid: boolean): Promise<void> {
  const { error } = await supabase
    .from("payments")
    .update(
      isPaid
        ? {
            is_paid: true,
            amount_paid: row.amount_due ?? row.amount_paid ?? 0,
            payment_date: new Date().toISOString(),
          }
        : { is_paid: false, amount_paid: 0, payment_date: null },
    )
    .eq("id", row.id);
  if (error) throw new Error(error.message);
}

export type CreatePaymentInput = {
  student_id: string | null;
  month: string;
  amount_due: number;
  amount_paid: number;
  is_paid: boolean;
  grace_period_active: boolean;
  receipt_reference: string | null;
};

/** Admin-only write — creates a new payment record for a student and month. */
export async function createPayment(input: CreatePaymentInput): Promise<void> {
  const { error } = await supabase.from("payments").insert({
    student_id: input.student_id,
    month: input.month,
    amount_due: input.amount_due,
    amount_paid: input.is_paid ? input.amount_due : input.amount_paid,
    is_paid: input.is_paid,
    grace_period_active: input.grace_period_active,
    receipt_reference: input.receipt_reference,
    payment_date: input.is_paid ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);
}

export type UpdatePaymentInput = {
  amount_due: number;
  amount_paid: number;
  is_paid: boolean;
  grace_period_active: boolean;
  receipt_reference: string | null;
};

/** Admin-only write — edits amount due, amount paid, grace period, reference, or status. */
export async function updatePayment(id: string, input: UpdatePaymentInput): Promise<void> {
  const { error } = await supabase
    .from("payments")
    .update({
      amount_due: input.amount_due,
      amount_paid: input.is_paid && input.amount_paid === 0 ? input.amount_due : input.amount_paid,
      is_paid: input.is_paid,
      grace_period_active: input.grace_period_active,
      receipt_reference: input.receipt_reference,
      payment_date: input.is_paid ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Admin-only batch update — sets amount_due across all unpaid rows for a given month. */
export async function applyRateToUnpaidMonth(month: string, amountDue: number): Promise<void> {
  const { error } = await supabase
    .from("payments")
    .update({ amount_due: amountDue })
    .eq("month", month)
    .eq("is_paid", false);
  if (error) throw new Error(error.message);
}

/** "[STU001] MNP-TRF-…" → "STU001" */
export function referenceStudentCode(reference: string | null): string | null {
  const match = reference?.match(/^\s*\[([^\]]+)\]/);
  return match?.[1]?.trim() ?? null;
}

/* ---------------------------------------------------------------------------
 * Assessment Results (`student_results` joined to `assessments` & `subjects`)
 * ------------------------------------------------------------------------- */

export type AssessmentResultRecord = {
  id: string;
  studentId: string;
  assessmentId: string;
  studentName: string | null;
  studentCode: string | null;
  subjectName: string | null;
  title: string;
  assessmentType: string | null;
  score: number | null;
  totalMarks: number | null;
  percentage: number | null;
  grade: string | null;
  submittedAt: string | null;
  gradedAt: string | null;
  recordedAt: string | null;
};

type RawAssessmentJoin = {
  id: string;
  title: string | null;
  subject_id: string | null;
  assessment_type: string | null;
  total_marks: number | null;
  subjects:
    | { id: string; name: string | null; code: string | null }
    | { id: string; name: string | null; code: string | null }[]
    | null;
};

type RawStudentJoin = {
  id: string;
  student_id: string | null;
  profiles:
    | { id: string; full_name: string | null; email: string | null }
    | { id: string; full_name: string | null; email: string | null }[]
    | null;
};

type RawStudentResultRow = {
  id: string;
  student_id: string;
  assessment_id: string;
  score: number | null;
  total_marks: number | null;
  percentage: number | null;
  grade: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  assessments: RawAssessmentJoin | RawAssessmentJoin[] | null;
  students?: RawStudentJoin | RawStudentJoin[] | null;
};

export async function fetchAssessmentResults(options?: {
  studentRowId?: string | null | undefined;
}): Promise<AssessmentResultRecord[]> {
  const baseColumns =
    "id, student_id, assessment_id, score, total_marks, percentage, grade, submitted_at, graded_at, created_at, updated_at, assessments(id, title, subject_id, assessment_type, total_marks, subjects(id, name, code))";

  const selectClause = options?.studentRowId
    ? baseColumns
    : `${baseColumns}, students(id, student_id, profiles(id, full_name, email))`;

  let query = supabase
    .from("student_results")
    .select(selectClause)
    .order("graded_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (options?.studentRowId) {
    query = query.eq("student_id", options.studentRowId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return ((data ?? []) as unknown as RawStudentResultRow[]).map((row) => {
    const assessment = firstOrNull(row.assessments);
    const subject = assessment ? firstOrNull(assessment.subjects) : null;
    const student = row.students ? firstOrNull(row.students) : null;
    const profile = student ? firstOrNull(student.profiles) : null;

    const totalMarks = row.total_marks ?? assessment?.total_marks ?? null;
    const score = row.score ?? null;
    const computedPercentage =
      row.percentage ??
      (score !== null && totalMarks !== null && totalMarks > 0
        ? Math.round((score / totalMarks) * 1000) / 10
        : null);

    const subjectMatched =
      matchActiveSubjectOption(subject?.name) ?? matchActiveSubjectOption(subject?.code);
    const subjectName = subjectMatched?.fullLabel ?? subject?.name ?? subject?.code ?? null;

    return {
      id: row.id,
      studentId: row.student_id,
      assessmentId: row.assessment_id,
      studentName: profile?.full_name ?? profile?.email ?? student?.student_id ?? null,
      studentCode: student?.student_id ?? null,
      subjectName,
      title: assessment?.title?.trim() || "Assessment",
      assessmentType: assessment?.assessment_type ?? null,
      score,
      totalMarks,
      percentage: computedPercentage,
      grade: row.grade ?? null,
      submittedAt: row.submitted_at ?? null,
      gradedAt: row.graded_at ?? null,
      recordedAt: row.graded_at ?? row.submitted_at ?? row.created_at ?? null,
    };
  });
}
