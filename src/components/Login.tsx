import { useState } from "react";
import { Card, Typography, Form, Input, Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const Login : React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function onConnect() {
        //appel api pour vérif connection
        if (true) { // si login et mdp correct
            navigate("/");
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
                    label="Nom d'utilisateur"
                    name="username"
                    rules={[
                        { required: true, message: "Veuillez entrer votre nom d'utilisateur" }
                    ]}
                    validateTrigger="onBlur"
                >
                    <Input onChange={e => setUsername(e.target.value)}/>
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
                    <Button type="primary" htmlType="submit" onClick={onConnect} block>
                        Se connecter
                    </Button>
                </Form.Item>
            </Form>
            </Card>
        </>
    );
}

export default Login;