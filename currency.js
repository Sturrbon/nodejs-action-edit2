const canadianDollar = 0.91

function roundTwo (amount) {
	return Math.round(amount * 100) / 100
}
exports.canadianDollar = canadian => roundTwo(canadian * canadianDollar);
exports.USTOCanadian = us => roundTwo(us / canadianDollar);