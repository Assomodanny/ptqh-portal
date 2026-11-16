import { n as __toESM } from "../_runtime.mjs";
import { _ as require_jsx_runtime, l as Slot, v as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as AlertDialogDescription$1, c as AlertDialogTitle$1, i as AlertDialogContent$1, l as AlertDialogTrigger$1, n as AlertDialogAction$1, o as AlertDialogOverlay$1, r as AlertDialogCancel$1, s as AlertDialogPortal$1, t as AlertDialog$1 } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as supabase, o as useAuth, r as signOut } from "./auth-xPULwznI.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as matchActiveSubjectOption, n as ALLOWED_SUBJECTS, t as ACTIVE_SUBJECT_OPTIONS } from "./curriculum-rYiZvMsx.mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as BookOpen, O as BookCheck, S as ClipboardList, T as CalendarClock, _ as LayoutDashboard, g as LogOut, m as Menu, n as Users, s as Sparkles, t as X, x as CreditCard, y as GraduationCap } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/portal-shell-DqU1YDlN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var AlertDialog = AlertDialog$1;
var AlertDialogTrigger = AlertDialogTrigger$1;
var AlertDialogPortal = AlertDialogPortal$1;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = AlertDialogOverlay$1.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = AlertDialogContent$1.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = AlertDialogTitle$1.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = AlertDialogDescription$1.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction$1, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = AlertDialogAction$1.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel$1, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = AlertDialogCancel$1.displayName;
/**
* Portal queries & admin/teacher/student helpers against the school's Supabase schema.
*/
/** Resolve the signed-in user's role via user_roles → roles.name. */
async function fetchUserRole(userId) {
	const { data, error } = await supabase.from("user_roles").select("roles(name)").eq("user_id", userId);
	if (error) throw new Error(error.message);
	const names = (data ?? []).flatMap((row) => Array.isArray(row.roles) ? row.roles : row.roles ? [row.roles] : []).map((r) => (r.name ?? "").toLowerCase());
	for (const candidate of [
		"admin",
		"teacher",
		"student"
	]) if (names.includes(candidate)) return candidate;
	return null;
}
var roleHome = {
	admin: "/admin",
	teacher: "/teacher",
	student: "/student"
};
/** profiles.id is the shared identity id (matches auth.users.id). */
async function fetchProfile(userId) {
	const { data, error } = await supabase.from("profiles").select("id, full_name, email, phone, avatar_url, is_active").eq("id", userId).maybeSingle();
	if (error) throw new Error(error.message);
	return data ?? null;
}
async function fetchAdminCounts() {
	const [students, teachers, subjects] = await Promise.all([
		supabase.from("students").select("id", {
			count: "exact",
			head: true
		}),
		supabase.from("teachers").select("id", {
			count: "exact",
			head: true
		}),
		supabase.from("subjects").select("id", {
			count: "exact",
			head: true
		}).eq("is_active", true)
	]);
	const firstError = students.error ?? teachers.error ?? subjects.error;
	if (firstError) throw new Error(firstError.message);
	return {
		students: students.count ?? 0,
		teachers: teachers.count ?? 0,
		subjects: subjects.count ?? 0
	};
}
async function fetchTeacherByProfile(profileId) {
	const { data, error } = await supabase.from("teachers").select("id, profile_id, employee_id, qualification, specialization, status").eq("profile_id", profileId).maybeSingle();
	if (error) throw new Error(error.message);
	return data ?? null;
}
async function fetchStudentByProfile(profileId) {
	const { data, error } = await supabase.from("students").select("id, profile_id, student_id, class_name, admission_date, date_of_birth, gender, status").eq("profile_id", profileId).maybeSingle();
	if (error) throw new Error(error.message);
	return data ?? null;
}
async function fetchEnrollments(studentRowId) {
	const { data, error } = await supabase.from("enrollments").select("id, enrolled_at, status, subjects(id, name, code, description, is_active)").eq("student_id", studentRowId).in("status", ["active", "completed"]);
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		...row,
		subjects: Array.isArray(row.subjects) ? row.subjects[0] ?? null : row.subjects
	}));
}
async function fetchTeacherSubjects(teacherRowId) {
	const { data, error } = await supabase.from("teacher_subjects").select("teacher_id, subject_id, created_at, subjects(id, name, code, description, is_active)").eq("teacher_id", teacherRowId).order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		...row,
		subjects: Array.isArray(row.subjects) ? row.subjects[0] ?? null : row.subjects
	}));
}
async function fetchAllTeacherSubjects() {
	const { data, error } = await supabase.from("teacher_subjects").select("teacher_id, subject_id, created_at, subjects(id, name, code, description, is_active)").order("created_at", { ascending: true });
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		...row,
		subjects: Array.isArray(row.subjects) ? row.subjects[0] ?? null : row.subjects
	}));
}
async function fetchTeacherCandidates() {
	const teacherRows = await fetchTeachers();
	const candidates = teacherRows.map((row) => ({
		selectionKey: `teacher:${row.id}`,
		teacherRowId: row.id,
		profileId: row.profile_id,
		employeeId: row.employee_id,
		qualification: row.qualification,
		specialization: row.specialization,
		status: row.status,
		fullName: row.profiles?.full_name ?? row.profiles?.email ?? row.employee_id ?? "Teacher",
		email: row.profiles?.email ?? null
	}));
	const seenProfiles = new Set(teacherRows.map((r) => r.profile_id));
	try {
		const { data: roleRows, error: roleError } = await supabase.from("user_roles").select("user_id, roles(name)").order("user_id", { ascending: true });
		if (!roleError && roleRows) {
			const teacherUserIds = roleRows.filter((row) => {
				return (Array.isArray(row.roles) ? row.roles : row.roles ? [row.roles] : []).some((item) => (item.name ?? "").toLowerCase() === "teacher");
			}).map((row) => row.user_id).filter((id) => !seenProfiles.has(id));
			if (teacherUserIds.length > 0) {
				const { data: profileRows, error: profError } = await supabase.from("profiles").select("id, full_name, email, phone, avatar_url, is_active").in("id", teacherUserIds);
				if (!profError && profileRows) for (const profile of profileRows) candidates.push({
					selectionKey: `profile:${profile.id}`,
					teacherRowId: null,
					profileId: profile.id,
					employeeId: null,
					qualification: null,
					specialization: null,
					status: "active",
					fullName: profile.full_name ?? profile.email ?? "Teacher",
					email: profile.email
				});
			}
		}
	} catch {}
	return candidates.sort((a, b) => a.fullName.localeCompare(b.fullName));
}
async function assignSubjectsToTeacher(input) {
	let resolvedTeacherId = input.teacherRowId;
	if (!resolvedTeacherId) {
		const { data: existingTeacher } = await supabase.from("teachers").select("id").eq("profile_id", input.profileId).maybeSingle();
		if (existingTeacher && existingTeacher.id) resolvedTeacherId = existingTeacher.id;
		else {
			const generatedCode = `TCH-${Date.now().toString().slice(-5)}`;
			const { data: insertedTeacher, error: teacherError } = await supabase.from("teachers").insert({
				profile_id: input.profileId,
				employee_id: generatedCode,
				status: "active"
			}).select("id").single();
			if (teacherError || !insertedTeacher) throw new Error(teacherError?.message ?? "Could not create teacher record.");
			resolvedTeacherId = insertedTeacher.id;
		}
	}
	const uniqueSubjectIds = [...new Set(input.subjectIds.filter(Boolean))];
	if (uniqueSubjectIds.length === 0) return {
		teacherRowId: resolvedTeacherId,
		addedCount: 0
	};
	const { data: currentRows, error: currentError } = await supabase.from("teacher_subjects").select("subject_id").eq("teacher_id", resolvedTeacherId);
	if (currentError) throw new Error(currentError.message);
	const alreadyAssigned = new Set((currentRows ?? []).map((r) => r.subject_id));
	const toInsert = uniqueSubjectIds.filter((subjectId) => !alreadyAssigned.has(subjectId)).map((subjectId) => ({
		teacher_id: resolvedTeacherId,
		subject_id: subjectId
	}));
	if (toInsert.length > 0) {
		const { error: assignError } = await supabase.from("teacher_subjects").insert(toInsert);
		if (assignError) throw new Error(assignError.message);
	}
	return {
		teacherRowId: resolvedTeacherId,
		addedCount: toInsert.length
	};
}
async function removeTeacherSubject(teacherRowId, subjectId) {
	const { error } = await supabase.from("teacher_subjects").delete().eq("teacher_id", teacherRowId).eq("subject_id", subjectId);
	if (error) throw new Error(error.message);
}
async function fetchAllEnrollments() {
	const { data, error } = await supabase.from("enrollments").select("id, student_id, subject_id, enrolled_at, status, subjects(id, name, code, description, is_active)").order("enrolled_at", { ascending: false });
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		...row,
		subjects: Array.isArray(row.subjects) ? row.subjects[0] ?? null : row.subjects
	}));
}
async function fetchSubjects() {
	const { data, error } = await supabase.from("subjects").select("id, name, code, description, is_active").order("name", { ascending: true });
	if (error) throw new Error(error.message);
	return data ?? [];
}
/**
* Maps each of the 4 active subjects to its row in `subjects`.
* Matching is flexible against short names ("Nahwu", "Hadith"), codes, or full labels.
*/
async function fetchResolvedActiveSubjects() {
	const existing = await fetchSubjects();
	const findMatch = (option, rows) => rows.find((row) => {
		return (matchActiveSubjectOption(row.name) ?? matchActiveSubjectOption(row.code))?.key === option.key;
	}) ?? null;
	const missing = ACTIVE_SUBJECT_OPTIONS.filter((opt) => !findMatch(opt, existing));
	let allRows = existing;
	if (missing.length > 0) {
		const toInsert = missing.map((opt) => ({
			name: opt.fullLabel,
			code: opt.code,
			description: opt.description,
			is_active: true
		}));
		const { error: insertError } = await supabase.from("subjects").insert(toInsert);
		if (!insertError) allRows = await fetchSubjects();
	}
	return ACTIVE_SUBJECT_OPTIONS.map((option) => ({
		option,
		subjectRow: findMatch(option, allRows)
	}));
}
/**
* Returns all `students` rows plus any signed-up `student`-role profiles that do not yet
* have a `students` record, so admins can enroll newly registered students right away.
*/
async function fetchStudentCandidates() {
	const studentRows = await fetchStudents();
	const candidates = studentRows.map((row) => ({
		selectionKey: `student:${row.id}`,
		studentRowId: row.id,
		profileId: row.profile_id,
		studentCode: row.student_id,
		className: row.class_name,
		status: row.status,
		fullName: row.profiles?.full_name ?? row.profiles?.email ?? row.student_id ?? "Student",
		email: row.profiles?.email ?? null
	}));
	const seenProfiles = new Set(studentRows.map((r) => r.profile_id));
	try {
		const { data: roleRows, error: roleError } = await supabase.from("user_roles").select("user_id, roles(name)").order("user_id", { ascending: true });
		if (!roleError && roleRows) {
			const studentUserIds = roleRows.filter((row) => {
				return (Array.isArray(row.roles) ? row.roles : row.roles ? [row.roles] : []).some((item) => (item.name ?? "").toLowerCase() === "student");
			}).map((row) => row.user_id).filter((id) => !seenProfiles.has(id));
			if (studentUserIds.length > 0) {
				const { data: profileRows, error: profError } = await supabase.from("profiles").select("id, full_name, email, phone, avatar_url, is_active").in("id", studentUserIds);
				if (!profError && profileRows) for (const profile of profileRows) candidates.push({
					selectionKey: `profile:${profile.id}`,
					studentRowId: null,
					profileId: profile.id,
					studentCode: null,
					className: null,
					status: "pending",
					fullName: profile.full_name ?? profile.email ?? "New Student",
					email: profile.email
				});
			}
		}
	} catch {}
	return candidates.sort((a, b) => a.fullName.localeCompare(b.fullName));
}
/**
* Ensures a `students` row exists for the candidate, then inserts any newly ticked
* subjects into `enrollments` without duplicating existing enrollments.
*/
async function enrollStudentInSubjects(input) {
	let resolvedStudentId = input.studentRowId;
	if (!resolvedStudentId) {
		const { data: existingStudent } = await supabase.from("students").select("id").eq("profile_id", input.profileId).maybeSingle();
		if (existingStudent && existingStudent.id) resolvedStudentId = existingStudent.id;
		else {
			const generatedCode = `STU-${Date.now().toString().slice(-5)}`;
			const { data: insertedStudent, error: studentError } = await supabase.from("students").insert({
				profile_id: input.profileId,
				student_id: generatedCode,
				admission_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				status: "active"
			}).select("id").single();
			if (studentError || !insertedStudent) throw new Error(studentError?.message ?? "Could not create student record.");
			resolvedStudentId = insertedStudent.id;
		}
	}
	const uniqueSubjectIds = [...new Set(input.subjectIds.filter(Boolean))];
	if (uniqueSubjectIds.length === 0) return {
		studentRowId: resolvedStudentId,
		addedCount: 0
	};
	const { data: currentRows, error: currentError } = await supabase.from("enrollments").select("id, subject_id, status").eq("student_id", resolvedStudentId);
	if (currentError) throw new Error(currentError.message);
	const existingBySubject = new Map((currentRows ?? []).map((r) => [r.subject_id, r]));
	const toReactivateIds = [];
	const toInsert = [];
	for (const subjectId of uniqueSubjectIds) {
		const existing = existingBySubject.get(subjectId);
		if (!existing) toInsert.push({
			student_id: resolvedStudentId,
			subject_id: subjectId,
			status: "active",
			enrolled_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		else if (existing.status === "inactive") toReactivateIds.push(existing.id);
	}
	if (toReactivateIds.length > 0) {
		const { error: reactivateError } = await supabase.from("enrollments").update({
			status: "active",
			enrolled_at: (/* @__PURE__ */ new Date()).toISOString()
		}).in("id", toReactivateIds);
		if (reactivateError) throw new Error(reactivateError.message);
	}
	if (toInsert.length > 0) {
		const { error: enrollError } = await supabase.from("enrollments").insert(toInsert);
		if (enrollError) throw new Error(enrollError.message);
	}
	return {
		studentRowId: resolvedStudentId,
		addedCount: toInsert.length + toReactivateIds.length
	};
}
async function removeEnrollment(enrollmentId) {
	const { error } = await supabase.from("enrollments").delete().eq("id", enrollmentId);
	if (error) throw new Error(error.message);
}
async function fetchLiveClasses() {
	const { data, error } = await supabase.from("live_classes").select("id, subject, day_of_week, start_time, end_time, platform, join_url, is_active").eq("is_active", true);
	if (error) throw new Error(error.message);
	return data ?? [];
}
var dayNames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];
/** "Every Wednesday" / "Schedule pending" for null values. */
function formatDay(day) {
	if (day === null || day === void 0 || day === "") return "Schedule pending";
	if (typeof day === "number") return dayNames[day] ? `Every ${dayNames[day]}` : "Schedule pending";
	const numeric = Number(day);
	if (!Number.isNaN(numeric) && dayNames[numeric]) return `Every ${dayNames[numeric]}`;
	return `Every ${day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}`;
}
function formatTime(value) {
	const [h, m] = value.split(":");
	const hour = Number(h);
	if (Number.isNaN(hour)) return value;
	const suffix = hour >= 12 ? "PM" : "AM";
	return `${hour % 12 === 0 ? 12 : hour % 12}:${m ?? "00"} ${suffix}`;
}
function formatTimeRange(start, end) {
	if (!start) return "Schedule pending";
	return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
}
function firstOrNull(value) {
	return Array.isArray(value) ? value[0] ?? null : value;
}
async function fetchStudents() {
	const { data, error } = await supabase.from("students").select("id, profile_id, student_id, class_name, admission_date, date_of_birth, gender, status, profiles(id, full_name, email, phone, avatar_url, is_active)");
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		...row,
		profiles: firstOrNull(row.profiles)
	}));
}
async function fetchTeachers() {
	const { data, error } = await supabase.from("teachers").select("id, profile_id, employee_id, qualification, specialization, status, profiles(id, full_name, email, phone, avatar_url, is_active)");
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => ({
		...row,
		profiles: firstOrNull(row.profiles)
	}));
}
/** Admin-only write (enforced by the existing RLS policy on live_classes). */
async function createLiveClass(input) {
	const { error } = await supabase.from("live_classes").insert({
		...input,
		is_active: true
	});
	if (error) throw new Error(error.message);
}
async function updateLiveClass(id, input) {
	const { error } = await supabase.from("live_classes").update(input).eq("id", id);
	if (error) throw new Error(error.message);
}
async function deleteLiveClass(id) {
	const { error } = await supabase.from("live_classes").delete().eq("id", id);
	if (error) throw new Error(error.message);
}
/** "google_meet" → "Google Meet". */
function formatPlatform(platform) {
	if (!platform) return "Platform to be confirmed";
	return platform.split(/[_\s-]+/).filter(Boolean).map((word) => word.toLowerCase() === "whatsapp" ? "WhatsApp" : word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}
var paymentColumns = "id, student_id, subject_id, month, amount_due, amount_paid, payment_date, is_paid, grace_period_active, receipt_reference, created_at";
/** First day of the given month as an ISO date string (YYYY-MM-01). */
function monthStart(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-01`;
}
/** The tag a workaround row carries, e.g. "STU001" → "[STU001]". */
function referenceTag(studentCode) {
	return `[${studentCode}]`;
}
/**
* Current-month payments for one student: rows linked by student_id, plus
* untagged-workaround rows whose receipt_reference starts with [STUDENT_ID].
*/
async function fetchStudentPayments(studentRowId, studentCode, month = monthStart()) {
	const byId = supabase.from("payments").select(paymentColumns).eq("month", month).eq("student_id", studentRowId);
	const byReference = studentCode ? supabase.from("payments").select(paymentColumns).eq("month", month).is("student_id", null).ilike("receipt_reference", `${referenceTag(studentCode)}%`) : null;
	const [linked, tagged] = await Promise.all([byId, byReference ?? Promise.resolve(null)]);
	if (linked.error) throw new Error(linked.error.message);
	if (tagged?.error) throw new Error(tagged.error.message);
	const rows = [...linked.data ?? [], ...tagged?.data ?? []];
	const seen = /* @__PURE__ */ new Set();
	return rows.filter((row) => seen.has(row.id) ? false : (seen.add(row.id), true));
}
/**
* Gating rule: block only when an unpaid row exists for the current month AND
* the 2-day grace period after the 1st has passed AND no row still carries
* grace_period_active. Students with no payment record are never blocked.
*/
function evaluatePaymentStatus(rows, today = /* @__PURE__ */ new Date()) {
	const unpaid = rows.filter((row) => row.is_paid !== true);
	const amountOwed = unpaid.reduce((total, row) => total + Math.max((row.amount_due ?? 0) - (row.amount_paid ?? 0), 0), 0);
	const withinGrace = today.getDate() <= 3 || unpaid.some((row) => row.grace_period_active === true);
	return {
		unpaid,
		amountOwed,
		withinGrace,
		blocked: unpaid.length > 0 && !withinGrace
	};
}
function formatNaira(amount) {
	return `₦${amount.toLocaleString("en-NG")}`;
}
function formatMonth(month) {
	if (!month) return "This month";
	const date = /* @__PURE__ */ new Date(`${month}T00:00:00`);
	if (Number.isNaN(date.getTime())) return month;
	return date.toLocaleDateString("en-NG", {
		month: "long",
		year: "numeric"
	});
}
/** All payments for a month, newest first — admin view. */
async function fetchPayments(month = monthStart()) {
	const { data, error } = await supabase.from("payments").select(paymentColumns).eq("month", month).order("created_at", { ascending: false });
	if (error) throw new Error(error.message);
	return data ?? [];
}
/** Admin-only write (enforced by the existing RLS policy on payments). */
async function setPaymentPaid(row, isPaid) {
	const { error } = await supabase.from("payments").update(isPaid ? {
		is_paid: true,
		amount_paid: row.amount_due ?? row.amount_paid ?? 0,
		payment_date: (/* @__PURE__ */ new Date()).toISOString()
	} : {
		is_paid: false,
		amount_paid: 0,
		payment_date: null
	}).eq("id", row.id);
	if (error) throw new Error(error.message);
}
/** Admin-only write — creates a new payment record for a student and month. */
async function createPayment(input) {
	const { error } = await supabase.from("payments").insert({
		student_id: input.student_id,
		month: input.month,
		amount_due: input.amount_due,
		amount_paid: input.is_paid ? input.amount_due : input.amount_paid,
		is_paid: input.is_paid,
		grace_period_active: input.grace_period_active,
		receipt_reference: input.receipt_reference,
		payment_date: input.is_paid ? (/* @__PURE__ */ new Date()).toISOString() : null
	});
	if (error) throw new Error(error.message);
}
/** Admin-only write — edits amount due, amount paid, grace period, reference, or status. */
async function updatePayment(id, input) {
	const { error } = await supabase.from("payments").update({
		amount_due: input.amount_due,
		amount_paid: input.is_paid && input.amount_paid === 0 ? input.amount_due : input.amount_paid,
		is_paid: input.is_paid,
		grace_period_active: input.grace_period_active,
		receipt_reference: input.receipt_reference,
		payment_date: input.is_paid ? (/* @__PURE__ */ new Date()).toISOString() : null
	}).eq("id", id);
	if (error) throw new Error(error.message);
}
/** Admin-only batch update — sets amount_due across all unpaid rows for a given month. */
async function applyRateToUnpaidMonth(month, amountDue) {
	const { error } = await supabase.from("payments").update({ amount_due: amountDue }).eq("month", month).eq("is_paid", false);
	if (error) throw new Error(error.message);
}
/** "[STU001] MNP-TRF-…" → "STU001" */
function referenceStudentCode(reference) {
	return (reference?.match(/^\s*\[([^\]]+)\]/))?.[1]?.trim() ?? null;
}
async function fetchAssessmentResults(options) {
	const baseColumns = "id, student_id, assessment_id, score, total_marks, percentage, grade, submitted_at, graded_at, created_at, updated_at, assessments(id, title, subject_id, assessment_type, total_marks, subjects(id, name, code))";
	const selectClause = options?.studentRowId ? baseColumns : `${baseColumns}, students(id, student_id, profiles(id, full_name, email))`;
	let query = supabase.from("student_results").select(selectClause).order("graded_at", {
		ascending: false,
		nullsFirst: false
	}).order("created_at", { ascending: false });
	if (options?.studentRowId) query = query.eq("student_id", options.studentRowId);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return (data ?? []).map((row) => {
		const assessment = firstOrNull(row.assessments);
		const subject = assessment ? firstOrNull(assessment.subjects) : null;
		const student = row.students ? firstOrNull(row.students) : null;
		const profile = student ? firstOrNull(student.profiles) : null;
		const totalMarks = row.total_marks ?? assessment?.total_marks ?? null;
		const score = row.score ?? null;
		const computedPercentage = row.percentage ?? (score !== null && totalMarks !== null && totalMarks > 0 ? Math.round(score / totalMarks * 1e3) / 10 : null);
		const subjectName = (matchActiveSubjectOption(subject?.name) ?? matchActiveSubjectOption(subject?.code))?.fullLabel ?? subject?.name ?? subject?.code ?? null;
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
			recordedAt: row.graded_at ?? row.submitted_at ?? row.created_at ?? null
		};
	});
}
var portalCard = "rounded-xl border border-border/90 bg-card/85 p-6 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-amber/50";
var portalPrimaryButton = "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber px-5 text-sm font-semibold tracking-wide text-primary-foreground shadow-sm transition-colors duration-200 hover:bg-amber-soft";
var portalGhostButton = "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10";
function SignOutButton({ className, fullWidth = false }) {
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function handleConfirmSignOut() {
		setBusy(true);
		try {
			await signOut();
			navigate({
				to: "/login",
				replace: true
			});
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: busy,
			className: className ?? `inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-amber/70 hover:text-amber ${fullWidth ? "w-full" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
				className: "size-4",
				"aria-hidden": "true"
			}), busy ? "Signing out…" : "Sign out"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
		className: "border-border bg-card text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
			className: "font-display text-xl text-headline",
			children: "Sign out of your account?"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
			className: "text-sm leading-relaxed text-muted-foreground",
			children: "Are you sure you want to sign out? You will need your school email and password to sign back in."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
			className: "border-border bg-secondary text-foreground hover:bg-accent",
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: () => void handleConfirmSignOut(),
			className: "bg-amber font-semibold text-primary-foreground hover:bg-amber-soft",
			children: "Yes, sign out"
		})] })]
	})] });
}
var ROLE_NAV = {
	admin: {
		label: "Administration",
		items: [
			{
				label: "Overview",
				to: "/admin",
				icon: LayoutDashboard,
				exact: true
			},
			{
				label: "Students",
				to: "/admin/students",
				icon: GraduationCap
			},
			{
				label: "Enrollments",
				to: "/admin/enrollments",
				icon: BookCheck
			},
			{
				label: "Teachers",
				to: "/admin/teachers",
				icon: Users
			},
			{
				label: "Payments",
				to: "/admin/payments",
				icon: CreditCard
			},
			{
				label: "Results",
				to: "/admin/results",
				icon: ClipboardList
			},
			{
				label: "Live classes",
				to: "/live-classes",
				icon: CalendarClock
			},
			{
				label: "Live quizzes",
				to: "/quiz",
				icon: Sparkles
			}
		]
	},
	teacher: {
		label: "Teaching Staff",
		items: [
			{
				label: "Dashboard",
				to: "/teacher",
				icon: LayoutDashboard,
				exact: true
			},
			{
				label: "Live classes",
				to: "/live-classes",
				icon: CalendarClock
			},
			{
				label: "Live quizzes",
				to: "/quiz",
				icon: Sparkles
			}
		]
	},
	student: {
		label: "Student Portal",
		items: [
			{
				label: "Dashboard",
				to: "/student",
				icon: BookOpen,
				exact: true
			},
			{
				label: "Results",
				to: "/results",
				icon: ClipboardList
			},
			{
				label: "Live classes",
				to: "/live-classes",
				icon: CalendarClock
			},
			{
				label: "Join live quiz",
				to: "/quiz/join",
				icon: Sparkles
			}
		]
	}
};
function isNavActive(pathname, item) {
	if (item.exact) return pathname === item.to || pathname === `${item.to}/`;
	return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
function SidebarNav({ role, email, pathname, onNavigate, showCloseButton = false }) {
	const config = ROLE_NAV[role];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-between gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 rounded-lg border border-border/80 bg-background/60 px-3.5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-[0.2em] text-amber",
							children: config.label
						}), email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 truncate text-xs text-muted-foreground",
							title: email,
							children: email
						})]
					}), showCloseButton && onNavigate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onNavigate,
						"aria-label": "Close portal sidebar",
						className: "grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-amber/60 hover:text-amber",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							"aria-hidden": "true"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "Programmes",
					className: "rounded-lg border border-border/80 bg-background/40 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-amber",
						children: "Programmes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2.5 space-y-1",
						children: ALLOWED_SUBJECTS.map((subject) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/live-classes",
							onClick: onNavigate,
							className: "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-card hover:text-amber",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "size-1.5 shrink-0 rounded-full bg-amber/80",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: subject
							})]
						}) }, subject))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": `${config.label} navigation`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground",
						children: "Navigation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: config.items.map((item) => {
							const Icon = item.icon;
							const active = isNavActive(pathname, item);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: onNavigate,
								className: `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition-colors duration-150 ${active ? "border border-amber/40 bg-amber/12 font-medium text-amber" : "border border-transparent text-muted-foreground hover:bg-card hover:text-headline"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4 shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: item.label
								})]
							}) }, item.to);
						})
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border/80 pt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignOutButton, { fullWidth: true })
		})]
	});
}
function PortalShell({ eyebrow, title, subtitle, showSignOut = true, role: explicitRole, children }) {
	const { user } = useAuth();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileSidebarOpen, setMobileSidebarOpen] = (0, import_react.useState)(false);
	const roleQuery = useQuery({
		queryKey: ["user-role", user?.id],
		queryFn: () => fetchUserRole(user.id),
		enabled: Boolean(user?.id) && explicitRole === void 0
	});
	const activeRole = explicitRole !== void 0 ? explicitRole : roleQuery.data ?? null;
	const showSidebar = Boolean(activeRole);
	(0, import_react.useEffect)(() => {
		if (!mobileSidebarOpen) return;
		function onKeyDown(event) {
			if (event.key === "Escape") setMobileSidebarOpen(false);
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [mobileSidebarOpen]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[calc(100vh-8rem)]",
		children: [
			showSidebar && activeRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setMobileSidebarOpen(true),
					"aria-label": "Open portal sidebar",
					"aria-expanded": mobileSidebarOpen,
					"aria-controls": "mobile-portal-sidebar",
					className: "fixed left-3 top-[5.25rem] z-40 inline-flex h-10 items-center gap-2 rounded-lg border border-amber/50 bg-card/95 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-amber shadow-lg backdrop-blur-md transition-colors hover:bg-amber hover:text-primary-foreground md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
						className: "size-4",
						"aria-hidden": "true"
					}), "Menu"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					"aria-hidden": "true",
					onClick: () => setMobileSidebarOpen(false),
					className: `fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-200 md:hidden ${mobileSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					id: "mobile-portal-sidebar",
					"aria-label": "Mobile portal sidebar",
					"aria-hidden": !mobileSidebarOpen,
					className: `fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-sidebar p-4 shadow-2xl transition-transform duration-200 ease-out md:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
						role: activeRole,
						email: user?.email,
						pathname,
						showCloseButton: true,
						onNavigate: () => setMobileSidebarOpen(false)
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hero-gradient border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-14 lg:px-8 ${showSidebar ? "pt-16 md:pt-12" : "pt-12 sm:pt-14"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "inline-flex items-center rounded-full border border-amber/40 bg-amber/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber",
							children: eyebrow
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-5 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl",
							children: title
						}),
						subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85",
							children: subtitle
						}),
						!showSidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-7 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/live-classes",
								className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-amber/50 px-5 text-sm font-medium text-amber transition-colors duration-200 hover:border-amber hover:bg-amber/10",
								children: "Live classes"
							}), showSignOut && user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignOutButton, {})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8",
				children: showSidebar && activeRole ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-8 md:flex-row md:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						"aria-label": "Portal sidebar",
						className: "hidden w-64 shrink-0 rounded-xl border border-border bg-sidebar/95 p-4 md:sticky md:top-24 md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarNav, {
							role: activeRole,
							email: user?.email,
							pathname
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0 flex-1",
						children
					})]
				}) : children
			})
		]
	});
}
function EmptyState({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-border bg-card/50 p-8 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-lg font-semibold text-headline",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { formatNaira as A, removeTeacherSubject as B, fetchStudents as C, fetchUserRole as D, fetchTeacherSubjects as E, portalGhostButton as F, setPaymentPaid as H, portalPrimaryButton as I, referenceStudentCode as L, formatTimeRange as M, monthStart as N, formatDay as O, portalCard as P, referenceTag as R, fetchStudentPayments as S, fetchTeacherCandidates as T, updateLiveClass as U, roleHome as V, updatePayment as W, fetchPayments as _, assignSubjectsToTeacher as a, fetchStudentByProfile as b, deleteLiveClass as c, fetchAdminCounts as d, fetchAllEnrollments as f, fetchLiveClasses as g, fetchEnrollments as h, applyRateToUnpaidMonth as i, formatPlatform as j, formatMonth as k, enrollStudentInSubjects as l, fetchAssessmentResults as m, PortalShell as n, createLiveClass as o, fetchAllTeacherSubjects as p, SignOutButton as r, createPayment as s, EmptyState as t, evaluatePaymentStatus as u, fetchProfile as v, fetchTeacherByProfile as w, fetchStudentCandidates as x, fetchResolvedActiveSubjects as y, removeEnrollment as z };
