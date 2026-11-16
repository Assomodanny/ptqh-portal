//#region node_modules/.nitro/vite/services/ssr/assets/curriculum-rYiZvMsx.js
/**
* The four core subjects of the programme.
*/
var curriculum = [
	{
		id: "nahwu",
		arabicTitle: "النحو",
		englishTitle: "Nahwu",
		description: "Arabic grammar and sentence structure — the rules of ʿirāb and the syntax that carries meaning in the Qur'anic text."
	},
	{
		id: "sarf",
		arabicTitle: "الصرف",
		englishTitle: "Sarf",
		description: "Arabic morphology and word formation — verb patterns and derivations that reveal the precision of Qur'anic vocabulary."
	},
	{
		id: "hadith",
		arabicTitle: "الحديث",
		englishTitle: "Hadith",
		description: "Prophetic traditions — their texts, transmission, and the etiquette of studying and narrating them."
	},
	{
		id: "as-sarim-al-battar",
		arabicTitle: "الصارم البتار",
		englishTitle: "As-Sarim Al-Battar",
		description: "A dedicated module treating the classical text as a distinct course within the programme."
	}
];
var ACTIVE_SUBJECT_OPTIONS = [
	{
		key: "nahwu",
		shortName: "Nahwu",
		fullLabel: "Nahwu (Arabic Grammar)",
		code: "NAHWU",
		description: "Arabic grammar and sentence structure — the rules of ʿirāb and the syntax that carries meaning in the Qur'anic text."
	},
	{
		key: "sarf",
		shortName: "Sarf",
		fullLabel: "Sarf (Arabic Morphology)",
		code: "SARF",
		description: "Arabic morphology and word formation — verb patterns and derivations that reveal the precision of Qur'anic vocabulary."
	},
	{
		key: "hadith",
		shortName: "Hadith",
		fullLabel: "Hadith Studies (Mustalah & Arba'in)",
		code: "HADITH",
		description: "Prophetic traditions — their texts, transmission, and the etiquette of studying and narrating them."
	},
	{
		key: "as-sarim-al-battar",
		shortName: "As-Sarim Al-Battar",
		fullLabel: "As-Sarim Al-Battar (Ruqyah & Protection)",
		code: "SARIM",
		description: "A dedicated module treating the classical text as a distinct course within the programme."
	}
];
var ALLOWED_SUBJECTS = [
	"Nahwu",
	"Sarf",
	"Hadith",
	"As-Sarim Al-Battar"
];
function matchActiveSubjectOption(subject) {
	if (!subject) return null;
	const normalized = subject.trim().toLowerCase();
	if (!normalized) return null;
	if (normalized === "nahwu" || normalized.startsWith("nahwu")) return ACTIVE_SUBJECT_OPTIONS[0];
	if (normalized === "sarf" || normalized.startsWith("sarf")) return ACTIVE_SUBJECT_OPTIONS[1];
	if (normalized === "hadith" || normalized.startsWith("hadith")) return ACTIVE_SUBJECT_OPTIONS[2];
	if (normalized === "as-sarim al-battar" || normalized.startsWith("as-sarim") || normalized === "sarim" || normalized.startsWith("sarim")) return ACTIVE_SUBJECT_OPTIONS[3];
	return null;
}
function isAllowedSubject(subject) {
	return matchActiveSubjectOption(subject) !== null;
}
//#endregion
export { matchActiveSubjectOption as a, isAllowedSubject as i, ALLOWED_SUBJECTS as n, curriculum as r, ACTIVE_SUBJECT_OPTIONS as t };
