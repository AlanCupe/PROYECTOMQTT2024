import React from 'react'
import EmployeeForm from '../../../components/EmployeeForm/EmployeForm'
import UsersTable from '../../../components/UserTable/UserTable'
import { UserProvider } from '../../../Context/UserProvider'

export const RegistroUsers = () => {
  return (
    <div>
          <EmployeeForm />
          <UsersTable />
        
    </div>

  

  )
}
