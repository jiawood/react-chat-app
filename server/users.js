const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!name || !room) {
    return {
      error: "Username and room are required.",
    };
  }

  let existingUser = users.find(
    (user) => user.name === name && user.room === room
  );
  if (existingUser) {
    return {
      error: "Username is token.",
    };
  }

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  let index = users.findIndex((user) => user.id === id);
  return users.splice(index, 1)[0];
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUserInRoom = (room) => {
  return users.find((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUserInRoom };
