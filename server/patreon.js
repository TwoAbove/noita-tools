const { Router } = require('express');
const cron = require('node-cron');

const router = Router();

const getPatreonPatronsData = async () => {
	if (!process.env.PATREON_CREATORS_ACCESS_TOKEN) {
		return {};
	}

	const membersQueryParams = {
		include: ['currently_entitled_tiers'].join(','),
		'fields[member]': [
			'full_name',
			'is_follower',
			'lifetime_support_cents',
			'currently_entitled_amount_cents',
			'patron_status'
		].join(','),
		'fields[tier]': ['amount_cents', 'published', 'title', 'url'].join(',')
	};

	const membersQuery = new URL(
		'https://www.patreon.com/api/oauth2/v2/campaigns/10343002/members'
	);

	Object.entries(membersQueryParams).forEach(([key, value]) => {
		membersQuery.searchParams.append(key, value);
	});

	// TODO: Handler pagination
	const data = await fetch(membersQuery.href, {
		headers: {
			Authorization: `Bearer ${process.env.PATREON_CREATORS_ACCESS_TOKEN}`,
			'Content-Type': 'application/json'
		}
	}).then(r => r.json());

	const tiers = data.included
		.filter(i => i.type === 'tier' && i.attributes.published)
		.reduce((acc, tier) => {
			acc[tier.id] = tier;
			return acc;
		}, {});

	const members = data.data.filter(d => d.type === 'member');

	const tierMembers = members
		.sort(
			(a, b) =>
				b.attributes.lifetime_support_cents -
				a.attributes.lifetime_support_cents
		)
		.reduce((acc, member) => {
			const tierIds = member.relationships.currently_entitled_tiers.data.map(
				t => t.id
			);
			tierIds.forEach(tierId => {
				if (!acc[tierId]) {
					acc[tierId] = {
						tier: tiers[tierId],
						members: []
					};
				}
				acc[tierId].members.push(member.attributes.full_name);
			});
			return acc;
		}, {});

	return tierMembers;
};

let patronCache = {};

const updatePatrons = async () => {
	patronCache = await getPatreonPatronsData();
};

router.get('/patrons', async (req, res) => {
	res.send(patronCache);
});

updatePatrons();
cron.schedule('* * * * *', updatePatrons); // every minute

module.exports = router;
