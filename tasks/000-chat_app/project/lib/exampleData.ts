let base = (new Date("2025-02-04 12:00:00")).getTime();
function getTimestamp() {
  base += 1000 * 60;
  return base;
}

export const userId1 = 'c54555b3-5df1-4862-9aea-664ad2e66b05';
export const userId2 = '7496e663-3efc-48fc-92d2-8196979bb400';
export const userId3 = '00a325f0-8b02-4cb4-9dab-31716deb06ec';
export const initialUsers = [
  {
    id: userId1,
    email: 'joe@example.com',
  },
  {
    id: userId2,
    email: 'bob@example.com',
  },
  {
    id: userId3,
    email: 'alice@example.com',
  },
];

const channelId1 = '8905e7e1-2a36-4264-8f55-4539f77cf3bf';
const channelId2 = '2037d2ed-c0be-4a65-b948-2dfcb2627403';
export const initialChannels = [
  { id: channelId1, name: "general", createdAt: getTimestamp() },
  { id: channelId2, name: "random", createdAt: getTimestamp() },
];

const messageId1 = '5d97e337-1166-412d-a102-24349f1620e4';
const messageId2 = '9621f96a-8a85-40b5-8b17-d38178522a5b';
export const initialMessages = [
  { id: messageId1, channelId: channelId1, userId: userId1, content: "Four score and seven years ago...", createdAt: getTimestamp(), },
  { id: messageId2, channelId: channelId2, userId: userId2, content: "Foursquare and Seven Rooms...", createdAt: getTimestamp(), },
];