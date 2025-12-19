// Formulaire de création/édition d'emplacement de transport

import { useEffect, useState } from 'react';
import { Typography, Card, Form, Input, Button, InputNumber, Select, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { ILocation } from '../../model/ILocation';
import { createLocation, updateLocation, getLocationById } from '../../API/locations.api';
import { getCategories } from '../../API/categories.api';
import { getVehicles } from '../../API/vehicles.api';
import type { ICategory } from '../../model/ICategory';
import type { IVehicle } from '../../model/IVehicle';
import { handleApiError } from '../../utils/errorHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../utils/errorHandler';

export default function LocationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState<ApiError | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [vehicles, setVehicles] = useState<IVehicle[]>([]);
  const [originalLocation, setOriginalLocation] = useState<ILocation | null>(null);
  const isEditMode = !!id;

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [cats, vehs] = await Promise.all([
          getCategories(),
          getVehicles(),
        ]);
        setCategories(cats);
        setVehicles(vehs);
      } catch (err) {
        // Erreur silencieuse - les options ne sont pas critiques
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchLocation = async () => {
        setInitialLoading(true);
        setError(null);
        try {
          const location = await getLocationById(id);
          setOriginalLocation(location);
          form.setFieldsValue({
            address: location.address,
            categoryId: location.categoryId,
            vehicleId: location.vehicleId,
            // Normaliser les valeurs en nombres pour éviter les problèmes de validation
            latitude: location.latitude != null ? Number(location.latitude) : null,
            longitude: location.longitude != null ? Number(location.longitude) : null,
          });
        } catch (err) {
          const apiError = handleApiError(err);
          setError(apiError);
          message.error(apiError.message);
        } finally {
          setInitialLoading(false);
        }
      };

      fetchLocation();
    }
  }, [id, form]);

  const onFinish = async (values: {
    address: string;
    categoryId?: number;
    vehicleId?: number;
    latitude?: number;
    longitude?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const locationData = {
        address: values.address,
        categoryId: values.categoryId ?? null,
        vehicleId: values.vehicleId ?? null,
        // Préserver les valeurs originales si elles ne sont pas modifiées (undefined)
        latitude: values.latitude ?? originalLocation?.latitude ?? null,
        longitude: values.longitude ?? originalLocation?.longitude ?? null,
      };

      if (isEditMode && id) {
        await updateLocation(id, locationData);
        message.success('Emplacement modifié avec succès');
      } else {
        await createLocation(locationData);
        message.success('Emplacement créé avec succès');
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
    return <LoadingSpinner message="Chargement des données de l'emplacement..." />;
  }

  if (error && initialLoading) {
    return <ErrorMessage error={error} fullWidth />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography.Title level={3}>
        {isEditMode ? 'Modification' : 'Ajout'} Emplacement de transport
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
          <Form.Item<ILocation>
            label="Adresse"
            name="address"
            rules={[
              { required: true, message: 'Veuillez entrer une adresse' },
              { min: 1, message: 'L\'adresse doit contenir au moins 1 caractère.' },
            ]}
            validateTrigger="onBlur"
          >
            <Input />
          </Form.Item>

          <Form.Item<ILocation>
            label="Catégorie"
            name="categoryId"
          >
            <Select
              placeholder="Sélectionner une catégorie"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={categories.map(cat => ({
                value: cat.id as number,
                label: cat.name || `Catégorie ${cat.id}`,
              }))}
            />
          </Form.Item>

          <Form.Item<ILocation>
            label="Véhicule"
            name="vehicleId"
          >
            <Select
              placeholder="Sélectionner un véhicule"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={vehicles.map(veh => ({
                value: veh.id as number,
                label: `${veh.brand || ''} ${veh.model || ''}`.trim() || `Véhicule ${veh.id}`,
              }))}
            />
          </Form.Item>

          <Form.Item<ILocation>
            label="Latitude"
            name="latitude"
            normalize={(value) => {
              // Convertir en nombre si la valeur existe, sinon null
              if (value === null || value === undefined || value === '') {
                return null;
              }
              const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
              return isNaN(numValue) ? null : numValue;
            }}
            rules={[
              {
                validator: (_, value) => {
                  // Accepter null/undefined (champ optionnel)
                  if (value === null || value === undefined || value === '') {
                    return Promise.resolve();
                  }
                  // Valider que c'est un nombre dans la plage valide
                  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
                  if (isNaN(numValue)) {
                    return Promise.reject(new Error('La latitude doit être un nombre'));
                  }
                  if (numValue < -90 || numValue > 90) {
                    return Promise.reject(new Error('La latitude doit être entre -90 et 90'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} step={0.00000001} />
          </Form.Item>

          <Form.Item<ILocation>
            label="Longitude"
            name="longitude"
            normalize={(value) => {
              // Convertir en nombre si la valeur existe, sinon null
              if (value === null || value === undefined || value === '') {
                return null;
              }
              const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
              return isNaN(numValue) ? null : numValue;
            }}
            rules={[
              {
                validator: (_, value) => {
                  // Accepter null/undefined (champ optionnel)
                  if (value === null || value === undefined || value === '') {
                    return Promise.resolve();
                  }
                  // Valider que c'est un nombre dans la plage valide
                  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
                  if (isNaN(numValue)) {
                    return Promise.reject(new Error('La longitude doit être un nombre'));
                  }
                  if (numValue < -180 || numValue > 180) {
                    return Promise.reject(new Error('La longitude doit être entre -180 et 180'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} step={0.00000001} />
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

