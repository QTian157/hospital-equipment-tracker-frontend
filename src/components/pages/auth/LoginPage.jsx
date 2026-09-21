import { useState } from "react"; 
import { useNavigate } from "react-router"; 
import { loginUser } from "../../../api/authApi"; 
import { useAuth } from "../../../auth/AuthContext";
import FormItem from "../../forms/FormItem";
import Input from "../../forms/inputs/Input";
import InputErrorMessage from "../../forms/inputs/InputErrorMessage";
import Button from "../../forms/inputs/Button";


const initialData = {
    username: '',
    password: '',
};

const errorMessage ={
    userNameRequired: 'User Name is required.',
    passwordRequired: 'User Password Tag is required.',
}
const LoginPage = () => {
    const [data, setData] = useState(initialData);
    // for FE
    const [hasErrors, setHasErrors] = useState(false);
    // for BE
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

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

    const handleLoginSubmit = async (domEvent)=>{
        domEvent.preventDefault();

        if (data.username === '' || data.password === '') {
            setHasErrors(true);
            return;
        }

        setHasErrors(false);
        setError("");
        setIsLoading(true);

        try{
            const response = await loginUser(
                data.username,
                data.password
            );
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(
                    responseData.message || "Login failed."
                );
            }
            login(responseData.token);
            navigate("/");

        }catch(err){
            setError(err.message);
        }finally{
            setIsLoading(false);
        }

    }


    return (
        <div>
            Login Page
            <form onSubmit={handleLoginSubmit}>
                <FormItem>
                    <Input 
                        id="username"
                        label="Username:"
                        value={data.username}
                        required={true}
                        handleChange={handleDataChange}
                    />
                    <InputErrorMessage
                        hasError={hasErrors && data.username ===''}
                        msg={errorMessage['userNameRequired']}
                    />
                </FormItem>
                <FormItem>
                    <Input 
                        id="password"
                        type="password"
                        label="Password:"
                        value={data.password}
                        required={true}
                        handleChange={handleDataChange}
                    />
                    <InputErrorMessage
                        hasError={hasErrors && data.password ===''}
                        msg={errorMessage['passwordRequired']}
                    />
                </FormItem>
                {error && <div>{error}</div>}
                <Button 
                    id = "login"
                    label={isLoading ? "Logging in..." : "Log in"}
                    type="submit"
                    classes="login" 
                    
                />
            </form>
        </div>
    );
};


export default LoginPage;