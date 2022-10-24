import React, { useState } from 'react';
import './profile.scss';
import Form from 'devextreme-react/form';

export default function Profile() {
  const [notes, setNotes] = useState(
    'Notes about the company might go here'
  );
  const employee = {
    YourCompanyId: 7,
    CompanyName: 'Our First Client',
    AddressLineOne: '123 AnyStreet',
    AddressLineTwo: 'Suite 402',
    AddressLineThree: 'PO Bpx 231',
    AddressLineFour: '...',
    Country: 'Canada',
    PhoneNumber: '416-111-2222',
    Notes: notes,
    EmailAddress: 'bill@bill.com',
   
  };

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Company Information</h2>

      <div className={'content-block dx-card responsive-paddings'}>

        <span>{notes}</span>
      </div>

      <div className={'content-block dx-card responsive-paddings'}>
        <Form
          id={'form'}
          defaultFormData={employee}
          onFieldDataChanged={e => e.dataField === 'Notes' && setNotes(e.value)}
          labelLocation={'top'}
          colCountByScreen={colCountByScreen}
        />
      </div>
    </React.Fragment>
  );
}

const colCountByScreen = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4
};