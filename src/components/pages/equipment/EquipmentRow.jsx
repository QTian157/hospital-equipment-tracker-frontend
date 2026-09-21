import { Link } from "react-router";
import StatusBadge from "../../statusBadge/StatusBadge.jsx"

const EquipmentRow = ({equip})=>{
    return (
        <tr>
            <td>{equip.name}</td>
            <td>{equip.assetTag}</td>
            <td>{equip.status && <StatusBadge status={equip.status}/>}</td>
            <td>{equip.departmentName}</td>
            <td>{equip.roomName}</td>
            <td>{equip.mobile ? "Mobile Equipment" : "Fixed Equipment"}</td>
            <td>
                <Link 
                    className="text-link" 
                    to={`/equipment/details/${equip.id}`}
                >
                    View Details
                </Link>

            </td>
        </tr>
    );
}

export default EquipmentRow;