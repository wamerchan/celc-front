import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ReportsView = () => {
  const [reportType, setReportType] = useState('Líneas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateReport = () => {
    console.log('Generating report with:', { reportType, startDate, endDate });
    setSuccessMessage(`Reporte de ${reportType} generado exitosamente.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Gestión de Reportes</h1>
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Reporte</label>
            <select 
              id="report-type" 
              name="report-type" 
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option>Líneas</option>
              <option>Equipos</option>
              <option>Asignaciones</option>
            </select>
          </div>
          <div>
            <Input 
              id='start-date' 
              name='start-date' 
              label='Fecha de Inicio' 
              type='date' 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Input 
              id='end-date' 
              name='end-date' 
              label='Fecha de Fin' 
              type='date' 
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleGenerateReport}>Generar Reporte</Button>
        </div>
        {successMessage && (
          <div className="mt-4 p-3 bg-emerald bg-opacity-20 text-emerald rounded-md text-sm">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;