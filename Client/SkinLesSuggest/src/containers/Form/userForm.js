import React from 'react';
import CustomTextInput from '../../components/CustomTextInput';
import CustomDropDown from '../../components/CustomDropDown';

const UserForm = ({
  userIsLoggedIn, userData, setField
}) => {
  const contentToRender = (
    <>
      {
        userIsLoggedIn ? (
          <>
            <CustomTextInput
              value={userData.firstName}
              name="firstName"
              placeholder="First Name"
              setField={setField}
            />
            <CustomTextInput
              value={userData.lastName}
              name="lastName"
              placeholder="Last Name"
              setField={setField}
            />
            <CustomTextInput
              value={userData.age}
              name="age"
              type="numeric"
              placeholder="Age"
              setField={setField}
            />
            <CustomDropDown
              name="gender"
              defaultValue="Gender"
              value={userData.gender}
              options={['Male', 'Female']}
              setField={setField}
            />
          </>
        ) : null
    }
    </>
  );

  return contentToRender;
};

export default UserForm;
