// Formulaire de création/édition de véhicule

import { useEffect, useState } from 'react';
import { Typography, Card, Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { IVehicle } from '../../model/IVehicle';
import { createVehicle, updateVehicle, getVehicleById } from '../../API/vehicles.api';
import { handleApiError } from '../../utils/errorHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../utils/errorHandler';

export default function VehicleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState<ApiError | null>(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      const fetchVehicle = async () => {
        setInitialLoading(true);
        setError(null);
        try {
          const vehicle = await getVehicleById(id);
          form.setFieldsValue({
            brand: vehicle.brand,
            model: vehicle.model,
          });
        } catch (err) {
          const apiError = handleApiError(err);
          setError(apiError);
          message.error(apiError.message);
        } finally {
          setInitialLoading(false);
        }
      };

      fetchVehicle();
    }
  }, [id, form]);

  const onFinish = async (values: Omit<IVehicle, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && id) {
        const updateData: Partial<Omit<IVehicle, 'id'>> = {
          brand: values.brand,
          model: values.model,
        };
        await updateVehicle(id, updateData);
        message.success('Véhicule modifié avec succès');
      } else {
        await createVehicle(values);
        message.success('Véhicule créé avec succès');
      }
      navigate('/');
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      message.error(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Chargement des données du véhicule..." />;
  }

  if (error && initialLoading) {
    return <ErrorMessage error={error} fullWidth />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography.Title level={3}>
        {isEditMode ? 'Modification' : 'Ajout'} Véhicule
      </Typography.Title>
      <Card>
        {error && !initialLoading && (
          <div style={{ marginBottom: '16px' }}>
            <ErrorMessage error={error} fullWidth />
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item<IVehicle>
            label="Marque"
            name="brand"
          >
            <Input />
          </Form.Item>

          <Form.Item<IVehicle>
            label="Modèle"
            name="model"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {isEditMode ? 'Modifier' : 'Créer'}
            </Button>
            <Button
              type="default"
              block
              style={{ marginTop: '8px' }}
              onClick={() => navigate('/')}
            >
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

