import { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Modal } from '../shared/components/ui/Modal';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../features/auth/store/authStore';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

const UsersView = () => {
  const { users, error, addUser, editUser, removeUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const columns = [
    {
      key: 'nombres',
      header: 'Nombre Completo',
      sortable: true,
      render: (u: User) => `${u.nombres} ${u.apellidos || ''}`,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'rol',
      header: 'Rol',
      sortable: true,
    },
  ];

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
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

  const renderActions = (user: User) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(user)}
        title="Editar"
        icon={<HiOutlinePencilSquare className="w-4 h-4 text-emerald-500" />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(user.id.toString())}
        title="Eliminar"
        icon={<HiOutlineTrash className="w-4 h-4 text-rose-500" />}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--color-text)] to-[var(--color-text-muted)] bg-clip-text text-transparent">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Administra los usuarios autorizados, sus credenciales y sus roles en la plataforma.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          Crear Usuario
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={users as any[]}
        actions={renderActions as any}
        rowKey={(u: any) => u.id}
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
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
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
      onSave(formData as Omit<User, 'id'>);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Editar Usuario' : 'Crear Usuario'}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <Input
          id="nombres"
          name="nombres"
          label="Nombres"
          placeholder="Ej. Carlos"
          required
          value={formData.nombres}
          onChange={handleChange}
        />
        <Input
          id="apellidos"
          name="apellidos"
          label="Apellidos"
          placeholder="Ej. Gómez"
          required
          value={formData.apellidos}
          onChange={handleChange}
        />
        <Input
          id="email"
          name="email"
          label="Correo Electrónico"
          placeholder="ejemplo@correo.com"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          id="rol"
          name="rol"
          label="Rol en el Sistema"
          placeholder="Ej. Administrador o Técnico"
          required
          value={formData.rol}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {user ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UsersView;