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
      // Mapping fields to CreateUsuarioDto if necessary, or pass directly
      await usuariosEndpoints.create({
        nombres: user.nombres,
        apellidos: user.apellidos || '',
        correoElectronico: user.email,
        cedula: '', // Required by CreateUsuarioDto but not present in simple user
        contrasenaHash: '123456', // default value
        rolId: user.rol === 'Administrador' ? 1 : 2, // Map rol to rolId
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
        nombres: user.nombres,
        apellidos: user.apellidos || '',
        email: user.email,
        rol: user.rol,
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
