import React from 'react';
import CustomTextInput from '../../components/CustomTextInput';
import CustomDropDown from '../../components/CustomDropDown';
import { localizationValues } from '../../utils/consts';

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
            <CustomDropDown
              name="localization"
              defaultValue="Localization"
              value={userData.localization}
              options={localizationValues}
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
