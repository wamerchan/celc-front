import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import type { User } from '../context/AuthContext';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      await usersAPI.createUser(user);
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError('Error al crear el usuario');
      console.error(err);
      throw err;
    }
  };

  const editUser = async (user: User) => {
    try {
      await usersAPI.updateUser(user.id.toString(), user);
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error(err);
      throw err;
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await usersAPI.deleteUser(userId);
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError('Error al eliminar el usuario');
      console.error(err);
      throw err;
    }
  };

  return { users, loading, error, addUser, editUser, removeUser, refetch: fetchUsers };
};
