import { useState } from "react";

export default function LoginForm () {
    const [username, setUsername] = useState("");
    return (
        <form>
            <fieldset>
                <legend>Connexion administrateur</legend>
                <label>
                    Nom d'utilisateur
                    <input
                        name="username"
                        placeholder="Nom d'utilisateur"
                    />
                </label>
                <label>
                    Mot de passe
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                    />
                </label>
            </fieldset>

            <input
                type="submit"
                value="Connexion"
            />
        </form>
    );
}