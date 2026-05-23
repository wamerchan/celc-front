import { useState, useEffect } from 'react';
import { usuariosEndpoints } from '../shared/api/endpoints';
import type { User } from '../features/auth/store/authStore';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usuariosEndpoints.getAll();
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
      await usuariosEndpoints.create({
        nombre: user.nombres,
        apellidos: user.apellidos || '',
        email: user.email,
        password: '123456', // default value
        id_rol: user.rol === 'Administrador' ? 1 : 2,
      });
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError('Error al crear el usuario');
      console.error(err);
      throw err;
    }
  };

  const editUser = async (user: User) => {
    try {
      await usuariosEndpoints.update(user.id, {
        nombre: user.nombres,
        apellidos: user.apellidos || '',
        email: user.email,
        id_rol: user.rol === 'Administrador' ? 1 : 2,
      });
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError('Error al actualizar el usuario');
      console.error(err);
      throw err;
    }
  };

  const removeUser = async (userId: string | number) => {
    try {
      const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      await usuariosEndpoints.delete(id);
      await fetchUsers(); // Refresh list
    } catch (err) {
      setError('Error al eliminar el usuario');
      console.error(err);
      throw err;
    }
  };

  return { users, loading, error, addUser, editUser, removeUser, refetch: fetchUsers };
};
export default useUsers;
