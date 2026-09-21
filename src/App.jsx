import { useState, useEffect } from 'react'
import './App.css'
import {Footer} from './components/layout/Footer'
import {Header} from './components/layout/Header'
import {Sidebar} from './components/layout/Sidebar'
import {Routes, Route, Navigate} from 'react-router'
import AboutPage from './components/pages/AboutPage'
import DashboardPage from './components/pages/DashboardPage'
import EquipmentListPage from './components/pages/equipment/EquipmentListPage'
import EquipmentDetailPage from './components/pages/equipment/EquipmentDetailPage'

import EquipmentEditPage from './components/pages/equipment/EquipmentEditPage'
import EquipmentAddPage from './components/pages/equipment/EquipmentAddPage'


import MaintenanceRecord from './classes/MaintenanceRecord';
import ProtectedRoute from './auth/ProtectedRoute'

import LoginPage from './components/pages/auth/LoginPage'
import RegisterPage from './components/pages/auth/RegisterPage'

import { apiFetch } from './api/apiClient'


const parseJSONText = (rawText, dataName) => {
  try{
    return JSON.parse(rawText)
  }catch{
    throw new Error(
      `Unable to parse ${dataName}. Google Docs export uses plain text and should contain valid JSON.`,
    )
  }
}

function App() {
  const [equipmentList, setEquipmentList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [equipListError, setEquipListError] = useState(null);

  const [maintenanceRecords, setMaintenanceRecords] = useState(null);
  const [maintenanceError, setMaintenanceError] = useState(null);
  
  // useEffect(callback, dependencies);
  // callback: 1. cleanup function or 2. no return
  useEffect(()=>{
    const fetchEquipmentList = async ()=>{
      try{
        // define fetch()
        // if you see aync -> return Promise -> so need await to get result
        const response = await apiFetch("/api/equipment");

        if (!response.ok) {
          throw new Error(`Unable to retrieve equipment list (status ${response.status}).`);
        }
        
        // convert response body from JSON to JavaScript object
        const result = await response.json();

        setEquipmentList(result.data);


        
        // Clear any previous error when fetch succeeds
        setEquipListError(null);
      }catch(error){
        console.error(error.message);
        setEquipListError(error.message);
        setEquipmentList([]);

      }
    }
    // call fetch()
    fetchEquipmentList();
  }, [])


  useEffect(()=>{
    const fetchMaintenanceRecord = async () => {
      let maintenanceRecords = [];
      try{
        // define fetch
        const response = await fetch(
            'https://docs.google.com/document/d/1h3esMGbkYT-nHb98xU8cN42CvQS7--ZB-c2LwxIJ2QM/export?format=txt'
        );
        
        if (!response.ok){
          throw new Error(`Unable to retrieve maintenance record (status ${response.status}).`);
        }

        const rawText = await response.text();
        const data = parseJSONText(rawText, 'maintenanceRecord')


        maintenanceRecords = data.map((record)=> {
          let newMaintenanceRecord = new MaintenanceRecord(
            record.id,
            record.equipmentId,
            record.maintenanceType,
            record.status,
            record.scheduledDate,
            record.completedDate,
            record.performedBy,
            record.description,
            record.notes,
          );
          return newMaintenanceRecord;
        })
        setMaintenanceError(null);

      }catch(error){
        console.error(error.message);
        setMaintenanceError(error.message);

      }finally{
        setMaintenanceRecords(maintenanceRecords);
      }
    }
    fetchMaintenanceRecord();
  },[])

    useEffect(()=>{
    if(isLoading && equipmentList != null && maintenanceRecords != null) {
      setIsLoading(false);
    }
  }, [isLoading, equipmentList, maintenanceRecords])



  return (
    <Routes>

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            <div id="body-container">
              <Header />

              <div className="page-container">
                <Sidebar />
                
                <Routes>
                  <Route 
                    path="/" 
                    element={ 
                      <DashboardPage 
                        equipmentList={equipmentList}
                        isLoading={isLoading} 
                        equipListError={equipListError}
                      />}
                  />
                  <Route 
                    path="/equipmentList" 
                    element={
                      <EquipmentListPage 
                        equipmentList={equipmentList} 
                        isLoading={isLoading} 
                        equipListError={equipListError}
                      />
                    }
                  />
                  <Route path="/about" element={ <AboutPage />}/>
                  <Route 
                    path="/equipment/details/:id" 
                    element={
                      <EquipmentDetailPage 
                        equipListError={equipListError}
                        setEquipmentList={setEquipmentList}
                        maintenanceRecords={maintenanceRecords}
                        setMaintenanceRecords={setMaintenanceRecords}
                        maintenanceError={maintenanceError}
                      />
                    } 
                  />
                  <Route 
                    path="/equipment/details/:id/edit" 
                    element={
                      <EquipmentEditPage 
                        equipmentList={equipmentList}
                        isLoading={isLoading}
                        equipListError={equipListError}
                        setEquipmentList={setEquipmentList}
                        maintenanceRecords={maintenanceRecords}
                        setMaintenanceRecords={setMaintenanceRecords}
                      />
                      
                    } 
                  
                  />

                  <Route 
                    path="/equipment/add" 
                    element={
                      <EquipmentAddPage 
                        equipmentList={equipmentList}
                        isLoading={isLoading}
                        equipListError={equipListError}
                        setEquipmentList={setEquipmentList}
                      />
                      
                    } 
                  
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>


              </div>
              <Footer />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
