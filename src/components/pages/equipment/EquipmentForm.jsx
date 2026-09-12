import FormItem from "../../forms/FormItem.jsx"
import { useEffect, useRef, useState} from 'react';
import InputErrorMessage from '../../forms/inputs/InputErrorMessage.jsx'
import Button from '../../forms/inputs/Button.jsx'
import Input from '../../forms/inputs/Input.jsx'
import { useNavigate, useParams } from "react-router";

import Select from '../../forms/inputs/Select.jsx'
import GoBack from '../../common/GoBack.jsx'

import { departments, statusList, categories} from '../../../mockData/equipmentOptions.js'
import MaintenanceForm from './MaintenanceForm.jsx'
import equipmentImages from "../../../mockData/equipmentImages.js";

const initialData = {
    name: '',
    assetTag: '',
    serialNumber: '',
    type: '',
    category: '',
    department: '',
    room: '',
    status: '',
    mobile: false,
};

const errorMessage ={
    equipmentNameRequired: 'Equipment Name is required.',
    assetTagRequired: 'Equipment Asset Tag is required.',
    serialNumberRequired: 'Equipment Serial Number is required.',
    typeRequired: 'Equipment type is required.',
    categoryRequired: 'Equipment Category is required.',
    departmentRequired: 'Equipment Department is required.',
    roomRequired: 'Equipment Room is required.',
    statusRequired: 'Equipment Status is required.',
}

const initialMaintenanceData = {
    maintenanceType: '',
    scheduledDate: '',
    completedDate: '',
    performedBy: '',
    description: '',
};

const departmentList = departments.map((d)=> d.name);
const categoriesList = categories.map((c)=> c.name);


const EquipmentForm = ({equip, equipmentList, setEquipmentList, mode, maintenanceRecords, setMaintenanceRecords})=> {


    // check for edit form or add form
    const isEditable = mode === "edit";
    const isAdded = mode === "add";

    const {id} = useParams();

    let equipData = {};
    if (isEditable){
        equipData = {...equip};

    }
    if (isAdded) {
        equipData = {...initialData};
    }
    const [data, setData] = useState({...equipData})
    const [hasErrors, setHasErrors] = useState(false)

    const [maintenanceData, setMaintenanceData] = useState({...initialMaintenanceData});

    const inputRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const isValidForAdd = () => {
        return (
            data.name.trim() !== '' &&
            data.assetTag.trim() !== '' &&
            data.serialNumber.trim() !== '' &&
            data.type.trim() != ''&&
            data.category.trim() != ''&&
            data.department !=''&&
            data.room != ''&&
            data.status != ''

        );
    };

    
    const isValidForEdit = () => {
        return (
            data.department !=''&&
            data.room != ''&&
            data.status != ''
        );
    };
    


    const handleDataChange = (domEvent) => {
        const { id, value } = domEvent.target;

        setData((prevData) => {
            const updatedData = {
                ...prevData,
                [id]: value,
            };

            if (id === "department") {
                updatedData.room = "";
            }

            if (id === "category") {
                updatedData.type = "";
            }

            return updatedData;
        });
    };
    const handleDataCheckboxChange = (domEvent) => {
        const { id, checked } = domEvent.target;
        setData((prevData) => ({
            ...prevData,
            [id]:checked,
        }));
    };


    const handleGoToEquipmentListPage = (()=> {
        navigate("/equipmentList")
    })
    const handleGoToEquipmentDetailPage =(() => {
        navigate(`/equipment/details/${id}`)
    })

    const selectedDepartment = departments.find(
    (department) => department.name === data.department
    );

 
    const roomList = selectedDepartment ? selectedDepartment.rooms : [];

    const selectedCategory = categories.find ((category)=> category.name === data.category);
    const typeList = selectedCategory ? selectedCategory.types : [];
    

    // maintenace history is under Edit mode
    const startMaintenance  = isEditable && equip.status !== "UNDER MAINTENANCE" && data.status === "UNDER MAINTENANCE";
    const endMaintenance  = isEditable && equip.status === "UNDER MAINTENANCE" && data.status !== "UNDER MAINTENANCE";

    useEffect(() => {
        if (endMaintenance) {
            const currentMaintenanceRecord = maintenanceRecords.find(
                (record) =>
                    String(record.equipmentId) === String(equip.id) &&
                    record.status === "IN_PROGRESS"
            );

            if (currentMaintenanceRecord) {
                setMaintenanceData({
                    maintenanceType: currentMaintenanceRecord.maintenanceType,
                    scheduledDate: currentMaintenanceRecord.scheduledDate,
                    completedDate: "",
                    performedBy: currentMaintenanceRecord.performedBy,
                    description: currentMaintenanceRecord.description,
                });
            }
        }
    }, [endMaintenance, maintenanceRecords, equip]);

    const isValidateMaintenace = () =>{
        if(startMaintenance) {
            return (
                maintenanceData.maintenanceType !== "" &&
                maintenanceData.scheduledDate !== "" &&
                maintenanceData.performedBy.trim() !== ""
            );
        }
        if (endMaintenance){
            return(
                maintenanceData.completedDate !== "" &&
                maintenanceData.performedBy.trim() !== ""
            );
        }
        return true;
    }

    
    const handleSubmit =  (domEvent) => {
        domEvent.preventDefault();
        if (isEditable) {
            if (!isValidForEdit() || !isValidateMaintenace()) {
                setHasErrors(true);
            } else {
                // edit equipment
                const updatedEquipmentList=[...equipmentList].map((e) => e.id === data.id ?data : e);
                setEquipmentList( updatedEquipmentList);
                // maintenance starts
                if (startMaintenance) {
                    const idList = maintenanceRecords.map((r)=>r.id);
                    const newRecordId = idList.length > 0 ? (Math.max(...idList) + 1): 1;
                    const newMaintenanceRecord = {
                        ...maintenanceData,
                        id: newRecordId,
                        equipmentId: equip.id,
                        status: "IN_PROGRESS",
                        completedDate: null,
                        notes: ""
                    }
                    const updatedMaintenanceRecords = [
                        ...maintenanceRecords,
                        newMaintenanceRecord
                    ];
                    setMaintenanceRecords(updatedMaintenanceRecords);
                }
                if (endMaintenance) {
                    const updatedMaintenanceRecords = maintenanceRecords.map((record) =>
                        String(record.equipmentId) === String(equip.id) &&
                        record.status === "IN_PROGRESS"
                            ? {
                                ...record,
                                status: "COMPLETED",
                                completedDate: maintenanceData.completedDate,
                                performedBy: maintenanceData.performedBy,
                                description: maintenanceData.description
                            }
                            : record
                    );

                    setMaintenanceRecords(updatedMaintenanceRecords);
                }
                navigate(`/equipment/details/${data.id}`);
            }
        }else {
            if (!isValidForAdd()) {
                setHasErrors(true);
            } else {
                // add equipment
                const idList = [...equipmentList].map((e)=> e.id);
                const newId = idList.length > 0 ? (Math.max(...idList) + 1) : 1;
                const newEquipment = {
                    ...data,
                    id: newId
                }


                const updatedEquipmentList = [
                    ...equipmentList,
                    newEquipment 
                ];
                setEquipmentList(updatedEquipmentList);
                navigate(`/equipment/details/${newId}`);
            }
        }
    }


    return (
        <div className="equipForm-layout">
            <h2>{mode === "edit" ? "Edit Equipment" : "Add Equipment"}</h2>
            <h3>Enter equipment information and current location</h3>
            
            <form 
                className="equipment-form"
                onSubmit={handleSubmit}
            >
                <div className="form-info">
                    <div className="basic-info">
                    <h3> BASIC INFORMATION</h3>
                        <FormItem>
                            <Input 
                                id="name"
                                label="Equipment Name:"
                                value={data.name}
                                ref={isAdded ? inputRef : null}
                                required={isEditable ? false : true}
                                disabled={isEditable}
                                handleChange={handleDataChange}
                            />
                            <InputErrorMessage
                                hasError={mode ==="add" && hasErrors && data.name ===''}
                                msg={errorMessage['equipmentNameRequired']}
                            />

                        </FormItem>

                        <FormItem>
                            <Input 
                                id="assetTag"
                                label="Asset Tag:"
                                value={data.assetTag}
                                required={isEditable ? false : true}
                                disabled={isEditable}
                                handleChange={handleDataChange}
                            />
                            <InputErrorMessage
                                hasError={mode ==="add" && hasErrors && data.assetTag ===''}
                                msg={errorMessage['assetTagRequired']}
                            />
                        </FormItem>
                        
                        <FormItem>
                            <Input 
                                id="serialNumber"
                                label="Serial Number:"
                                value={data.serialNumber}
                                required={isEditable ? false : true}
                                disabled={isEditable}
                                handleChange={handleDataChange}
                            />
                            <InputErrorMessage
                                hasError={mode ==="add" && hasErrors && data.serialNumber ===''}
                                msg={errorMessage['serialNumberRequired']}
                            />
                        </FormItem>
                        <FormItem>
                            <Select 
                                id="category"
                                label="Category:"
                                value={data.category}
                                required={isEditable ? false : true}
                                disabled={isEditable}
                                handleSelected={handleDataChange}
                                selectList={categoriesList}
                            />
                            <InputErrorMessage
                                hasError={mode ==="add" && hasErrors && data.category ===''}
                                msg={errorMessage['categoryRequired']}
                            /> 
                        </FormItem>
                        <FormItem>
                            <Select
                                id="type"
                                label="Type:"
                                value={data.type}
                                required={isEditable ? false : true}
                                disabled={isEditable}
                                handleSelected={handleDataChange}
                                selectList={typeList}
                            />
                            <InputErrorMessage
                                hasError={mode ==="add" && hasErrors && data.type ===''}
                                msg={errorMessage['typeRequired']}
                            />
                        </FormItem>
                        <FormItem>
                            {isEditable ? (
                                <>
                                    <label>Mobility: </label>
                                    <p>{data.mobile ? "Mobile" : "Fixed"}</p>
                                </>
                            ) : (
                                <Input

                                    id="mobile"
                                    label="Mobile Equipment"
                                    checked={data.mobile}
                                    type="checkbox"
                                    handleChange={handleDataCheckboxChange}
                                />
                            )}
                        </FormItem>
                    </div>
                    <div className="location">

                        <h3>CURRENT LOCATION</h3>
                        <FormItem>
                            <Select 
                                id="department"
                                label="Department:"
                                ref={isEditable ? inputRef : null}
                                required={true}
                                handleSelected={handleDataChange}
                                value={data.department}
                                selectList={departmentList}
                            />
                            <InputErrorMessage
                                hasError={hasErrors && data.department ===''}
                                msg={errorMessage['departmentRequired']}
                            />
                        </FormItem>

                        <FormItem>
                            <Select 
                                id="room"
                                label="Room:"
                                required={true}
                                handleSelected={handleDataChange}
                                value={data.room}
                                selectList={roomList}
                            />
                            <InputErrorMessage
                                hasError={hasErrors && data.room ===''}
                                msg={errorMessage['roomRequired']}
                            />
                        </FormItem>
                        <FormItem>
                            <Select 
                                id="status"
                                label="Status"
                                required={true}
                                handleSelected={handleDataChange}
                                value={data.status}
                                selectList={statusList}
                            />
                            <InputErrorMessage
                                hasError={hasErrors && data.status===''}
                                msg={errorMessage['statusRequired']}
                            />
                        </FormItem>

                    </div>
                    <div className="image">
                        {
                            isEditable&&
                            <img
                                className="equipment-image-edit"
                                src={equipmentImages[equip.type] || "/images/default-equipment.png"}
                                alt={equip.name}
                            />
                        }
                    </div>
                    <div>
                        {startMaintenance && (
                            <div>
                                <MaintenanceForm  
                                    maintenanceData={maintenanceData} 
                                    setMaintenanceData={setMaintenanceData} 
                                    action="start"
                                    hasErrors={hasErrors}
                                />
                            </div>
                        )}
                        {endMaintenance && (
                            <div>
                                <MaintenanceForm  
                                    maintenanceData={maintenanceData} 
                                    setMaintenanceData={setMaintenanceData} 
                                    action="end"
                                    hasErrors={hasErrors}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="form-operation">
                    <Button id="submit" type="submit" label={isEditable ? "Save changes" : "Add Equipment"}/>
                    {isEditable 
                        ? <GoBack text="Cancel Changes" handleClick={handleGoToEquipmentDetailPage} /> 
                        :<GoBack text="Cancel Changes" handleClick={handleGoToEquipmentListPage} />
                    }
                </div>
            </form>
        </div>

    )
}


export default EquipmentForm;