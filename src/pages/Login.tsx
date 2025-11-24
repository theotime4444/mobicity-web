import { useState } from "react";
import { Card, Typography, Form, Input, Button } from "antd";

const { Title } = Typography;

const Login : React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
            <Title level={3}>
                Connexion admin
            </Title>
            <Card>
            <Form layout="vertical">
                <Form.Item
                    label="Nom d'utilisateur"
                    name="username"
                    rules={[{ required: true, message: "Veuillez entrer votre nom d'utilisateur" }]}
                >
                    <Input onChange={e => setUsername(e.target.value)}/>
                </Form.Item>
                <Form.Item
                    label="Mot de passe"
                    name="password"
                    rules={[{ required: true, message: "Veuillez entrer votre mot de passe"}]}
                >
                    <Input.Password onChange={e => setPassword(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Se connecter
                </Button>
                </Form.Item>
            </Form>
            </Card>
        </>
    );
}

export default Login;