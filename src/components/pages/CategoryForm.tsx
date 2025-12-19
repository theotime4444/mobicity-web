import { useEffect, useState } from 'react';
import { Typography, Card, Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { ICategory } from '../../model/ICategory';
import { createCategory, updateCategory, getCategoryById } from '../../API/categories.api';
import { handleApiError } from '../../utils/errorHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../utils/errorHandler';

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState<ApiError | null>(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setInitialLoading(true);
        setError(null);
        try {
          const category = await getCategoryById(id);
          form.setFieldsValue({
            name: category.name,
          });
        } catch (err) {
          const apiError = handleApiError(err);
          setError(apiError);
          message.error(apiError.message);
        } finally {
          setInitialLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id, form]);

  const onFinish = async (values: Omit<ICategory, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && id) {
        const updateData: Partial<Omit<ICategory, 'id'>> = {
          name: values.name,
        };
        await updateCategory(id, updateData);
        message.success('Catégorie modifiée avec succès');
      } else {
        await createCategory(values);
        message.success('Catégorie créée avec succès');
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
    return <LoadingSpinner message="Chargement des données de la catégorie..." />;
  }

  if (error && initialLoading) {
    return <ErrorMessage error={error} fullWidth />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography.Title level={3}>
        {isEditMode ? 'Modification' : 'Ajout'} Catégorie
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
          <Form.Item<ICategory>
            label="Nom"
            name="name"
            rules={[
              { required: true, message: 'Veuillez entrer un nom' },
              { min: 1, message: 'Le nom doit contenir au moins 1 caractère.' },
            ]}
            validateTrigger="onBlur"
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

