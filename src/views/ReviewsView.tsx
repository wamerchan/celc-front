import React, { useState } from 'react';
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useReviews } from '../hooks/useReviews';
import { useEquipments } from '../hooks/useEquipments';
import type { Review } from '../services/api';

const ReviewsView = () => {
  const { reviews, error, addReview, editReview, removeReview } = useReviews();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  const headers = ['Equipment', 'Date', 'Result', 'Actions'];

  const handleEdit = (review: Review) => {
    setCurrentReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = (reviewId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta revisión?')) {
      removeReview(reviewId);
    }
  };

  const handleCreate = () => {
    setCurrentReview(null);
    setIsModalOpen(true);
  };

  const handleSave = (review: Omit<Review, 'id'> | Review) => {
    if ('id' in review) {
      editReview(review as Review);
    } else {
      addReview(review as Omit<Review, 'id'>);
    }
    setIsModalOpen(false);
  };

  const renderRow = (review: Review) => (
    <tr key={review.id}>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{review.equipment}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{review.date}</td>
      <td className="px-6 py-4 whitespace-nowrap dark:text-gray-300">{review.result}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Button onClick={() => handleEdit(review)}>Editar</Button>
        <Button onClick={() => handleDelete(review.id.toString())} className="ml-2 bg-coral">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Gestión de Revisiones</h1>
        <Button onClick={handleCreate}>Crear Revisión</Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <DataTable 
        headers={headers} 
        data={reviews} 
        renderRow={renderRow} 
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
    equipment: review?.equipment || '',
    date: review?.date || '',
    result: review?.result || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find the selected equipment to get its ID
    const selectedEquipment = equipments.find(eq => eq.modelo === formData.equipment);
    if (!selectedEquipment) {
      alert('Por favor selecciona un equipo válido');
      return;
    }

    const reviewData = {
      equipoId: selectedEquipment.id.toString(),
      fecha: formData.date,
      resultado: formData.result,
    };

    if (review) {
      onSave({ ...review, ...reviewData });
    } else {
      onSave(reviewData as Omit<Review, 'id'>);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={review ? 'Editar Revisión' : 'Crear Revisión'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="equipment">Equipo</label>
          <select id="equipment" name="equipment" value={formData.equipment} onChange={handleChange} className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Selecciona un equipo</option>
            {equipments.map(equipment => <option key={equipment.id} value={equipment.modelo}>{equipment.modelo}</option>)}
          </select>
        </div>
        <Input 
          id='date' 
          name='date' 
          type='date'
          label='Date' 
          placeholder='2023-10-26' 
          required 
          value={formData.date}
          onChange={handleChange}
        />
        <Input 
          id='result' 
          name='result' 
          label='Result' 
          placeholder='Passed' 
          required 
          value={formData.result}
          onChange={handleChange}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </Modal>
  )
}

export default ReviewsView;