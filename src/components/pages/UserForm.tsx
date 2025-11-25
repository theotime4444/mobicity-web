import { Typography, Card, Form, Input, Button, Switch, Radio } from "antd"
import { type IUser } from "../../model/IUser"

const UserForm : React.FC = ({modifiedUser} : {modifiedUser? : IUser}) => {
    return (
        <>
            <Typography.Title level={3}>
                {modifiedUser ? "Modification" : "Ajout"} Utilisateur
            </Typography.Title>
            <Card>
                <Form layout="vertical">
                    <Form.Item<IUser>
                        label="Prénom"
                        name="firstname"
                        rules={[
                            { required: true, message: "Veuillez entrer votre prénom"},
                            { max : 100, message: "Le prénom ne peut pas excéder 100 caractères."}
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item<IUser>
                        label="Nom de famille"
                        name="lastname"
                        rules={[
                            { required: true, message: "Veuillez entrer votre nom de famille"},
                            { max : 100, message: "Le nom de famille ne peut pas excéder 100 caractères."}
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item<IUser>
                        label="Adresse mail"
                        name="email"
                        rules={[
                            { required: true, message: "Veuillez entrer une adresse mail valide", type:"email"}
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item<IUser>
                        label="Mot de passe"
                        name="password"
                        rules={[
                            { required: true, message: "Veuillez entrer un mot de passe"},
                            { min: 8, max: 50, message: "Le mot de passe doit faire entre 8 et 50 caractères."},
                            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/, message: "Le mot de passe doit être composé au minimum de: 1 maj, 1 min, 1 chiffre, 1 caractère spécial."}
                        ]}
                        validateTrigger="onBlur"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item<IUser>
                        required
                        label="Administrateur ?"   
                        name="isAdmin" 
                    >
                        <Radio.Group
                            block
                            options={[
                                {label : 'Oui', value: true},
                                {label : 'Non', value: false},
                            ]}
                            defaultValue={false}
                            
                        />
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

export default UserForm;