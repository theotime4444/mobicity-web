import { useState } from "react";
import { Card, Typography, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./common/LoadingSpinner";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    async function onConnect() {
        try {
            await login(email, password);
            message.success("Connexion réussie");
            navigate("/");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erreur lors de la connexion";
            message.error(errorMessage);
        }
    }

    return (
        <>
            <Typography.Title level={3}>
            Connexion Administrateur
            </Typography.Title>
            <Card>
            <Form layout="vertical">
                <Form.Item
                    label="Adresse email"
                    name="email"
                    rules={[
                        { required: true, message: "Veuillez entrer votre adresse email" },
                        { type: "email", message: "Veuillez entrer une adresse email valide" }
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input type="email" onChange={e => setEmail(e.target.value)}/>
                </Form.Item>
                <Form.Item
                    label="Mot de passe"
                    name="password"
                    rules={[
                        { required: true, message: "Veuillez entrer votre mot de passe"}
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input.Password onChange={e => setPassword(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        onClick={onConnect} 
                        block 
                        loading={loading}
                        disabled={loading}
                    >
                        Se connecter
                    </Button>
                </Form.Item>
            </Form>
            </Card>
        </>
    );
}

export default Login;