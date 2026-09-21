import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import Button from '../forms/inputs/Button.jsx';

export const Header = () =>{
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("logout clicked");
        logout();
        navigate("/login");
    };

    return (
        <header>
            <div className="tracker">
                <strong>Hospital Equipment Tracking</strong>
                <Button 
                    label="Log out"
                    handleClick={handleLogout}
                />
            </div>
        </header>
    )
}