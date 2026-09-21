import { useState } from "react";
import { useNavigate } from "react-router";

import { registerUser } from "../../../api/authApi";

import FormItem from "../../forms/FormItem";
import Input from "../../forms/inputs/Input";
import InputErrorMessage from "../../forms/inputs/InputErrorMessage";
import Button from "../../forms/inputs/Button";

const initialData = {
    username: "",
    password: "",
};

const errorMessage = {
    userNameRequired: "User Name is required.",
    passwordRequired: "Password is required.",
};

const RegisterPage = ()=>{
    const [data, setData] = useState(initialData);
    const [hasErrors, setHasErrors] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const handleDataChange = (domEvent) => {
        const { id, value } = domEvent.target;

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                [id]: value,
            };

            return updatedData;
        });
    };
    const handleRegisterSubmit = async (event) => {
    event.preventDefault();

    if (data.username === "" || data.password === "") {
        setHasErrors(true);
        return;
    }

    setHasErrors(false);
    setError("");
    setIsLoading(true);

    try {
        const response = await registerUser(data);

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message || "Registration failed."
            );
        }

        navigate("/login");

        } catch (error) {
            setError(error.message);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleRegisterSubmit}>
                <FormItem>
                    <Input
                        id="username"
                        label="Username:"
                        value={data.username}
                        required={true}
                        handleChange={handleDataChange}
                    />

                    <InputErrorMessage
                        hasError={
                            hasErrors && data.username === ""
                        }
                        msg={errorMessage.userNameRequired}
                    />
                </FormItem>

                <FormItem>
                    <Input
                        id="password"
                        label="Password:"
                        type="password"
                        value={data.password}
                        required={true}
                        handleChange={handleDataChange}
                    />

                    <InputErrorMessage
                        hasError={
                            hasErrors && data.password === ""
                        }
                        msg={errorMessage.passwordRequired}
                    />
                </FormItem>

                {error && <p>{error}</p>}

                <Button
                    id="register"
                    label={
                        isLoading ? "Registering..." : "Register"
                    }
                    type="submit"
                    classes="register"
                />
            </form>
        </div>
    );
}

export default RegisterPage;