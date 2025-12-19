import { useEffect, useState } from 'react';
import { Typography, Card, Form, Input, Button, Radio, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import type { IUser } from '../../model/IUser';
import { createUser, updateUser, getUserById } from '../../API/users.api';
import { handleApiError } from '../../utils/errorHandler';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import type { ApiError } from '../../utils/errorHandler';

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [error, setError] = useState<ApiError | null>(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setInitialLoading(true);
        setError(null);
        try {
          const user = await getUserById(id);
          form.setFieldsValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
          });
        } catch (err) {
          const apiError = handleApiError(err);
          setError(apiError);
          message.error(apiError.message);
        } finally {
          setInitialLoading(false);
        }
      };

      fetchUser();
    }
  }, [id, form]);

  const onFinish = async (values: Omit<IUser, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      if (isEditMode && id) {
        const updateData: Partial<Omit<IUser, 'id'>> = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          isAdmin: values.isAdmin,
        };
        
        if (values.password && values.password.trim() !== '') {
          updateData.password = values.password;
        }
        
        await updateUser(id, updateData);
        message.success('Utilisateur modifié avec succès');
      } else {
        await createUser(values);
        message.success('Utilisateur créé avec succès');
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
    return <LoadingSpinner message="Chargement des données de l'utilisateur..." />;
  }

  if (error && initialLoading) {
    return <ErrorMessage error={error} fullWidth onRetry={() => window.location.reload()} />;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography.Title level={3}>
        {isEditMode ? 'Modification' : 'Ajout'} Utilisateur
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
          <Form.Item<IUser>
            label="Prénom"
            name="firstName"
            rules={[
              { required: true, message: 'Veuillez entrer votre prénom' },
              { min: 1, message: 'Le prénom doit contenir au moins 1 caractère.' },
            ]}
            validateTrigger="onBlur"
          >
            <Input />
          </Form.Item>

          <Form.Item<IUser>
            label="Nom de famille"
            name="lastName"
            rules={[
              { required: true, message: 'Veuillez entrer votre nom de famille' },
              { min: 1, message: 'Le nom de famille doit contenir au moins 1 caractère.' },
            ]}
            validateTrigger="onBlur"
          >
            <Input />
          </Form.Item>

          <Form.Item<IUser>
            label="Adresse mail"
            name="email"
            rules={[
              { required: true, message: 'Veuillez entrer une adresse mail valide', type: 'email' },
            ]}
            validateTrigger="onBlur"
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item<IUser>
            label="Mot de passe"
            name="password"
            rules={[
              ...(isEditMode
                ? []
                : [{ required: true, message: 'Veuillez entrer un mot de passe' }]),
              { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères.' },
            ]}
            validateTrigger="onBlur"
            extra={isEditMode ? 'Laissez vide pour ne pas modifier le mot de passe' : undefined}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<IUser>
            required
            label="Administrateur ?"
            name="isAdmin"
            initialValue={false}
          >
            <Radio.Group
              block
              options={[
                { label: 'Oui', value: true },
                { label: 'Non', value: false },
              ]}
            />
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
