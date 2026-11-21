export const SEED_USERS = [
  { _id: '64a000000000000000000001', name: 'John Doe', email: 'john@example.com', bio: 'Full-stack developer', passwordHash: '$2b$10$abcdefghijklmnopqrstuv' },
  { _id: '64a000000000000000000002', name: 'Sarah Smith', email: 'sarah@example.com', bio: 'Travel writer', passwordHash: '$2b$10$zyxwvutsrqponmlkjihgfe' },
  { _id: '64a000000000000000000003', name: 'Mike Johnson', email: 'mike@example.com', bio: 'Chef and foodie', passwordHash: '$2b$10$qwertyuiopasdfghjklzxc' },
  { _id: '64a000000000000000000004', name: 'Emma Wilson', email: 'emma@example.com', bio: 'Wellness coach', passwordHash: '$2b$10$mnbvcxzlkjhgfdsapoiuyt' },
];

const CATEGORIES = ['Conference', 'Workshop', 'Meetup', 'Webinar'];
const TITLES = ['Alpha Primer', 'Beta Notes', 'Gamma Guide', 'Delta Review', 'Epsilon Draft', 'Zeta Archive'];
const OWNERS = [0, 0, 1, 2, 0, 1];
const CATEGORY_OF = [0, 1, 0, 2, 1, 0];

function seedItems() {
  return TITLES.map((title, i) => {
    const stamp = '2025-01-0' + (i + 1) + 'T10:00:00.000Z';
    return {
      _id: '5f' + String(i + 1).padStart(22, '0'),
      name: title,
      agenda: 'Full text of ' + title + '. ' + 'Lorem ipsum dolor sit amet. '.repeat(10),
      teaser: 'Summary of ' + title,
      type: CATEGORIES[CATEGORY_OF[i]],
      tags: ['seed', 'item-' + (i + 1)],
      capacity: 50 + i,
      public: i !== 4, // the 5th seed item ("Epsilon Draft") is unpublished
      organizer: SEED_USERS[OWNERS[i]]._id,
      createdAt: stamp,
      updatedAt: stamp,
    };
  });
}

export const db = { users: [], items: [] };
let counter = 0;

export const newId = () => '6a1' + String(++counter).padStart(21, '0');
export const isValidId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

/** Put the in-memory "database" back into its initial state. The tests call this before every test. */
export function reset() {
  counter = 0;
  db.users = SEED_USERS.map((u) => ({ ...u }));
  db.items = seedItems();
}

reset();
