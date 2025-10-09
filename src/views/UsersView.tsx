import { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../context/AuthContext';

const UsersView = () => {
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const headers = ['Nombre', 'Email', 'Rol', 'Acciones'];

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await removeUser(userId);
      } catch (err) {
        alert('Error al eliminar usuario');
      }
    }
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleSave = async (user: Omit<User, 'id'> | User) => {
    try {
      if ('id' in user) {
        await editUser(user as User);
      } else {
        await addUser(user as Omit<User, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error al guardar usuario');
    }
  };

  const renderRow = (user: User) => (
    <tr key={user.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{user.nombre}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{user.rol}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(user)} className="mr-2">Editar</Button>
        <Button onClick={() => handleDelete(user.id.toString())} variant="danger">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Usuarios</h1>
        <Button onClick={handleCreate}>Crear Usuario</Button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <DataTable
        headers={headers}
        data={users}
        renderRow={renderRow}
        searchable={true}
        searchPlaceholder="Buscar usuarios..."
      />
      {isModalOpen && (
        <UserFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          user={currentUser}
        />
      )}
    </div>
  );
};

const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  user
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'> | User) => void;
  user: User | null;
}) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    rol: user?.rol || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave({ ...user, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Editar Usuario' : 'Crear Usuario'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="nombre"
          name="nombre"
          label="Nombre"
          placeholder="John Doe"
          required
          value={formData.nombre}
          onChange={handleChange}
        />
        <Input
          id="email"
          name="email"
          label="Email"
          placeholder="john@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          id="rol"
          name="rol"
          label="Rol"
          placeholder="Administrador"
          required
          value={formData.rol}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  );
};

export default UsersView;