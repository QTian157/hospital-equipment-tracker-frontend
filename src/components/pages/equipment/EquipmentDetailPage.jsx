import { useNavigate, useParams } from 'react-router';
import ErrorPage from '../ErrorPage';
import GoBack from '../../common/GoBack';
import LoadingPage from '../LoadingPage';
import { useState, useEffect } from "react";
import EquipDeleteConfirmation from './EquipDeleteConfirmation.jsx'

import Button from '../../forms/inputs/Button.jsx'
import equipmentImages from "../../../mockData/equipmentImages.js";

import { apiFetch } from "../../../api/apiClient";


const EquipmentDetailPage = ({equipmentList, setEquipmentList})=>{

    const {id} = useParams();
    const [equip, setEquip] = useState(null);
    const [detailLoading, setDetailLoading] = useState(true);
    const [detailError, setDetailError] = useState(null);

    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [maintenanceLoading, setMaintenanceLoading] = useState(true);
    const [maintenanceError, setMaintenanceError] = useState(null);
    

    const navigate = useNavigate();

    const handleGoToDashboardPage = () => {
        navigate('/');
    };

    const handleGoToEquipmentListPage = () => {
        navigate('/equipmentList');
    };

    const handleGoToEquipmentEditPage = ()=>{
        navigate(`/equipment/details/${id}/edit`)
    }
    const handleShowDeleteModal = ()=> {
        setShowDeleteModal(true)
    }

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchEquipmentDetail = async () => {
            try {
                const response = await apiFetch(`/api/equipment/${id}`);

                if (!response.ok) {
                    throw new Error(
                        `Unable to retrieve equipment detail (status ${response.status}).`
                    );
                }

                const result = await response.json();

                setEquip(result.data);
                setDetailError(null);

            } catch (error) {
                console.error(error.message);
                setDetailError(error.message);

            } finally {
                setDetailLoading(false);
            }
        };

        fetchEquipmentDetail();
    }, [id]);

    useEffect(() => {
        const fetchMaintenanceRecords = async () => {
            try {
                const response = await apiFetch(
                    `/api/equipment/${id}/maintenance-records`
                );

                if (!response.ok) {
                    throw new Error(
                        `Unable to retrieve maintenance records (status ${response.status}).`
                    );
                }

                const result = await response.json();

                setMaintenanceRecords(result.data);
                setMaintenanceError(null);

            } catch (error) {
                console.error(error.message);
                setMaintenanceError(error.message);
                setMaintenanceRecords([]);

            } finally {
                setMaintenanceLoading(false);
            }
        };

        fetchMaintenanceRecords();
    }, [id]);
    

    if (detailLoading || maintenanceLoading){
        return (<LoadingPage dataName={'equipmentDetail'}/>)
    }else if(detailError){
        // all equipment list error -> go back to dashboard page
        return (
            <ErrorPage>
                {detailError}
                <GoBack text={'Return Dashboard'} handleClick={handleGoToDashboardPage} />
            </ErrorPage>
        )
    } else if (maintenanceError) {
        return (
            <ErrorPage>
                {maintenanceError}
                <GoBack text={'Return Dashboard'} handleClick={handleGoToDashboardPage} />
            </ErrorPage>
        )
    }else {
        if (!equip) {
            // equipment not found -> go back to equipment List page
            return(
                <ErrorPage>
                    <p>Sorry, that equipment does not exist!</p>
                    <GoBack text={'View All Equipments'} handleClick={handleGoToEquipmentListPage} />
                </ErrorPage>
            );
        } else {
            
            if (!maintenanceRecords){
                return (
                    <div>
                        <h2>No Records show up.</h2>
                    </div>
                )
            }
            return(
                <main>
                    <div className="main-content">
                        <h1>
                            Equipment Detail
                        </h1>
                        <div className="detail-info">
                            <p> NAME: {equip.name}</p>
                            <p> ASSET TAG: {equip.assetTag}</p>
                            <p> STATUS: {equip.status}</p>
                            <h3>EQUIPMENT DETAIL INFORMATION</h3>
                            <p> TYPE: {equip.type}</p>
                            <p> CATEGORY: {equip.category}</p>
                            <p> SERIAL NUMBER: {equip.serialNumber}</p>
                            <p> MOBILE: {equip.mobile ? "Mobile Equipment" : "Fixed Equipment"}</p>
                            <h3>LOCATION</h3>
                            <p> DEPARTMENT: {equip.departmentName}</p>
                            <p> ROOM: {equip.roomName}</p>
                            <img
                                className="equipment-image"
                                src={equipmentImages[equip.type] || "/images/default-equipment.png"}
                                alt={equip.name}
                            />
                        </div>
                        <div className="detail-buttons">
                            <GoBack text={'Back to Equipment List'} handleClick={handleGoToEquipmentListPage} />
                            <Button id="edit-equip" label={'Edit Equipment'} handleClick={handleGoToEquipmentEditPage} />
                            <Button id="delete-equip" label={'Delete Equipment'} handleClick={handleShowDeleteModal} />
                        </div>

                        {showDeleteModal && 
                            <EquipDeleteConfirmation 
                                equip={equip} 
                                equipmentList={equipmentList} 
                                setEquipmentList={setEquipmentList}
                                setShowDeleteModal={setShowDeleteModal}
                            
                            />
                        }
                        <div className="maintenance-history">
                            <h2>Maintenance History</h2>
                            {maintenanceRecords.length === 0 ?(
                                <p>No maintenance records found.</p>
                            ):(
                                maintenanceRecords.map((record)=>(

                                <div className="maintenance-record" key={record.id}>
                                    <p>Maintenance Type: {record.maintenanceType}</p>
                                    <p>Status: {record.status}</p>
                                    {record.status === "SCHEDULED" && (
                                        <p>Scheduled:{record.scheduledDate}
                                        </p>
                                    )}
                                    {record.status === "COMPLETED" && (
                                        <p>Completed: {record.completedDate}</p>
                                    )}
                                    <p>Performance By: {record.performedBy}</p>
                                    <p>Description: {record.description}</p>
                                </div>
                            ))
                        )}
                        </div>
                    </div>
                </main>
            )
        }
    }
}

export default EquipmentDetailPage;