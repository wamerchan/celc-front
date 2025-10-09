import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { User } from '../context/AuthContext';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await api.getUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      const newUser = await api.createUser(user);
      setUsers((prevUsers) => [...prevUsers, newUser]);
    } catch (err) {
      setError('Error al crear el usuario');
      console.error(err);
    }
  };

  const editUser = async (user: User) => {
    try {
      const updatedUser = await api.updateUser(user);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error(err);
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
    } catch (err) {
      setError('Error al eliminar el usuario');
      console.error(err);
    }
  };

  return { users, loading, error, addUser, editUser, removeUser };
};
