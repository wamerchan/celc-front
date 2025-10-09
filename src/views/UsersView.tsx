import React, { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useUsers } from '../hooks/useUsers';
import { User } from '../context/AuthContext';

const UsersView = () => {
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const headers = ['Name', 'Email', 'Role', 'Actions'];

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      removeUser(userId);
    }
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleSave = (user: Omit<User, 'id'> | User) => {
    if ('id' in user) {
      editUser(user as User);
    } else {
      addUser(user as Omit<User, 'id'>);
    }
    setIsModalOpen(false);
  };

  const renderRow = (user: User) => (
    <tr key={user.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{user.name}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{user.email}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{user.role}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(user)}>Editar</Button>
        <Button onClick={() => handleDelete(user.id)} className="ml-2 bg-coral">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Usuarios</h1>
        <Button onClick={handleCreate}>Crear Usuario</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
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

const UserFormModal = ({ isOpen, onClose, onSave, user }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id'> | User) => void;
  user: User | null;
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
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
          id='name' 
          name='name' 
          label='Name' 
          placeholder='John Doe' 
          required 
          value={formData.name}
          onChange={handleChange}
        />
        <Input 
          id='email' 
          name='email' 
          label='Email' 
          placeholder='john@example.com' 
          required 
          value={formData.email}
          onChange={handleChange}
        />
        <Input 
          id='role' 
          name='role' 
          label='Role' 
          placeholder='Admin' 
          required 
          value={formData.role}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  )
}

export default UsersView;