import React, { useState } from 'react';
import { DataTable } from '../shared/components/ui/DataTable';
import { Modal } from '../shared/components/ui/Modal';
import { Button } from '../shared/components/ui/Button';
import { Input } from '../shared/components/ui/Input';
import { useReviews, type Review } from '../hooks/useReviews';
import { useEquipments } from '../hooks/useEquipments';
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

const ReviewsView = () => {
  const { reviews, error, addReview, editReview, removeReview } = useReviews();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  const columns = [
    {
      key: 'equipment',
      header: 'Equipo',
      sortable: true,
    },
    {
      key: 'fecha',
      header: 'Fecha Programada',
      sortable: true,
      render: (review: Review) => {
        const rawDate = review.fecha || review.date;
        if (!rawDate) return '-';
        // Formatear fecha localmente
        const dateObj = new Date(rawDate);
        if (isNaN(dateObj.getTime())) return rawDate;
        // Evitar desfase de zona horaria al formatear YYYY-MM-DD
        const utcDate = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
        return utcDate.toLocaleDateString();
      },
    },
    {
      key: 'resultado',
      header: 'Resultado',
      sortable: true,
      render: (review: Review) => {
        const res = review.resultado || review.result || 'Pendiente';
        const resultColors: Record<string, string> = {
          Aprobada: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
          Reparacion_Necesaria: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
          Rechazada: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
          Pendiente: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
        };
        const colorClass = resultColors[res] || resultColors.Pendiente;
        const displayLabel: Record<string, string> = {
          Aprobada: 'Aprobada',
          Reparacion_Necesaria: 'Reparación Necesaria',
          Rechazada: 'Rechazada',
          Pendiente: 'Pendiente',
        };
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {displayLabel[res] || res}
          </span>
        );
      },
    },
  ];

  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta revisión?')) {
      try {
        await removeReview(reviewId);
      } catch (err: any) {
        const errMsg = err.response?.data?.message || 'Error al eliminar revisión';
        alert(errMsg);
      }
    }
  };

  const handleCreate = () => {
    setCurrentReview(null);
    setIsModalOpen(true);
  };

  const handleSave = async (review: Omit<Review, 'id'> | Review) => {
    try {
      if (currentReview && 'id' in review) {
        await editReview(review as Review);
      } else {
        await addReview(review as Omit<Review, 'id'>);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Error al guardar la revisión';
      alert(errMsg);
    }
  };

  const renderActions = (review: Review) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleEdit(review)}
        title="Editar"
        icon={<HiOutlinePencilSquare className="w-4 h-4 text-emerald-500" />}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(review.id.toString())}
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
            Gestión de Revisiones
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Programa mantenimientos y auditorías técnicas para los equipos registrados.
          </p>
        </div>
        <Button onClick={handleCreate} variant="primary">
          Programar Revisión
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-sm">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={reviews as any[]}
        actions={renderActions as any}
        rowKey={(rev: any) => rev.id}
        searchable={true}
        searchPlaceholder="Buscar revisiones..."
      />

      {isModalOpen && (
        <ReviewFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          review={currentReview}
        />
      )}
    </div>
  );
};

const ReviewFormModal = ({ isOpen, onClose, onSave, review }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: Omit<Review, 'id'> | Review) => void;
  review: Review | null;
}) => {
  const { equipments } = useEquipments();
  const [formData, setFormData] = useState({
    equipoId: review?.equipoId?.toString() || '',
    date: review?.fecha?.split('T')[0] || review?.date?.split('T')[0] || '',
    result: review?.resultado || review?.result || 'Aprobada',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedEquipment = equipments.find(eq => eq.id.toString() === formData.equipoId);
    if (!selectedEquipment) {
      alert('Por favor selecciona un equipo válido');
      return;
    }

    const reviewData = {
      equipoId: selectedEquipment.id.toString(),
      fecha: formData.date,
      resultado: formData.result,
      equipment: `${selectedEquipment.marca} ${selectedEquipment.modelo}`,
      date: formData.date,
      result: formData.result,
    };

    if (review) {
      onSave({ ...review, ...reviewData });
    } else {
      onSave(reviewData as Omit<Review, 'id'>);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={review ? 'Editar Revisión' : 'Programar Revisión'}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <div className="flex flex-col gap-2">
          <label htmlFor="equipoId" className="text-sm font-semibold text-[var(--color-text)]">
            Equipo a Revisar
          </label>
          <select
            id="equipoId"
            name="equipoId"
            required
            value={formData.equipoId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
          >
            <option value="">Selecciona un equipo</option>
            {equipments.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.marca} {eq.modelo} (S/N: {eq.numeroSerie})
              </option>
            ))}
          </select>
        </div>

        <Input 
          id="date" 
          name="date" 
          type="date"
          label="Fecha Programada" 
          required 
          value={formData.date}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="result" className="text-sm font-semibold text-[var(--color-text)]">
            Resultado de la Revisión
          </label>
          <select
            id="result"
            name="result"
            required
            value={formData.result}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm"
          >
            <option value="Aprobada">Aprobada</option>
            <option value="Reparacion_Necesaria">Reparación Necesaria</option>
            <option value="Rechazada">Rechazada</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {review ? 'Guardar Cambios' : 'Programar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewsView;