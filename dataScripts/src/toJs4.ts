const l2j = require('lua2js');

const text = `

local function shuffle_table( t )
	assert( t, "shuffle_table() expected a table, got nil" )
	local iterations = #t
	local j

	for i = iterations, 2, -1 do
		j = Random(1,i)
		t[i], t[j] = t[j], t[i]
	end
end

`;

const a = l2j.parse(text);
console.log(a);
