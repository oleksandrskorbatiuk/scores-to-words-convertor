const units_fem = [
	"", "одна", "дві", "три", "чотири", "п'ять", "шість",
	"сім", "вісім", "дев'ять", "десять", "одинадцять",
	"дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять",
	"шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"
];

const units_masc = [
	"", "один", "два", "три", "чотири", "п'ять", "шість",
	"сім", "вісім", "дев'ять", "десять", "одинадцять",
	"дванадцять", "тринадцять", "чотирнадцять", "п'ятнадцять",
	"шістнадцять", "сімнадцять", "вісімнадцять", "дев'ятнадцять"
];

const tens = [
	"", "", "двадцять", "тридцять", "сорок",
	"п'ятдесят", "шістдесят", "сімдесят",
	"вісімдесят", "дев'яносто"
];

const hundreds = ["", "сто", "двісті", "триста", "чотириста", "п'ятсот", "шістсот", "сімсот", "вісімсот", "дев'ятсот"];

function numberToWords(n, gender = "f") {
	if (n === 0) return "нуль";

	let result = "";

	if (n >= 100) {
		result += hundreds[Math.floor(n / 100)] + " ";
		n %= 100;
	}

	if (n >= 20) {
		result += tens[Math.floor(n / 10)] + " ";
		n %= 10;
	}

	if (n > 0) {
		const units = (gender === "f") ? units_fem : units_masc;
		result += units[n] + " ";
	}

	return result.trim();
}

function pluralForm(n, forms) {
	n = Math.abs(n);
	let lastTwo = n % 100;
	let last = n % 10;

	if (lastTwo >= 11 && lastTwo <= 14) return forms[2];
	if (last === 1) return forms[0];
	if (last >= 2 && last <= 4) return forms[1];
	return forms[2];
}

// ціла / цілі / цілих
function integerLabel(n) {
	return pluralForm(n, ["ціла", "цілі", "цілих"]);
}

function fractionLabel(n, digits) {
	const map = {
		1: ["десята", "десяті", "десятих"],
		2: ["сота", "соті", "сотих"],
		3: ["тисячна", "тисячні", "тисячних"]
	};

	const forms = map[digits];
	if (!forms) return ""; // страховка

	return pluralForm(n, forms);
}

function normalizeFraction(frac) {
	frac = frac.slice(0, 3);
	return frac.replace(/0+$/, '') || "0";
}

function convertLine(line, thousandsMode) {
	if (!line.trim()) return "";

	line = line.trim().replace(',', '.');

	let intPart = 0;
	let fracPart = "";

	if (thousandsMode) {
		let num = parseInt(line, 10);
		intPart = Math.floor(num / 1000);
		fracPart = String(num % 1000).padStart(3, '0');
	} else {
		let parts = line.split('.');
		intPart = parseInt(parts[0], 10) || 0;
		fracPart = parts[1] || "";
	}

	if (intPart > 200) return "Число поза діапазоном";

	let intWords = numberToWords(intPart, "f");
	let intLbl = integerLabel(intPart);

	if (!fracPart || Number(fracPart) === 0) {
		return `${intWords} ${intLbl} і нуль десятих`;
	}

	let norm = normalizeFraction(fracPart);
	let fracNum = parseInt(norm, 10);

	let fracWords = numberToWords(fracNum, "f");
	let fracLbl = fractionLabel(fracNum, norm.length);

	return `${intWords} ${intLbl} і ${fracWords} ${fracLbl}`;
}

function convert() {
	const lines = document.getElementById("input").value.split("\n");
	const thousandsMode = document.getElementById("thousandsMode").checked;

	const result = lines.map(line => convertLine(line, thousandsMode));

	document.getElementById("output").value = result.join("\n");
}

function copyToClipboard() {
	navigator.clipboard.writeText(document.getElementById("output").value)
}
