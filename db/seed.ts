import { db, Guestbook } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	await db.insert(Guestbook).values([
		{
			name: 'alex buh',
			message: '1 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '2 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '3 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '4 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '5 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '6 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '7 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '8 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '9 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '10 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '11 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '12 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '13 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '14 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '15 test test test test buh buh buh',
		},
		{
			name: 'alex buh',
			message: '16 test test test test buh buh buh',
		},
	])
}
